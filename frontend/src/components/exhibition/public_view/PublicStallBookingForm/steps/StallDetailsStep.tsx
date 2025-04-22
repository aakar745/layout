import React, { useState, useMemo, useEffect } from 'react';
import { Form, Input, Select, message, Card, Table, Empty, Checkbox } from 'antd';
import { SearchOutlined, CheckCircleFilled, AppstoreOutlined, CheckOutlined, CheckCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { StepProps } from '../types';
import { PublicDiscount } from '../../../../../services/publicExhibition';
import { 
  StepContent, 
  PageTitle,
  PageSubtitle,
  FilterBar,
  StallTabsContainer,
  StallGrid,
  StallCard,
  BookingSummaryCard
} from '../styles';

interface CalculatedDiscount {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

const StallDetailsStep: React.FC<StepProps> = ({
  form,
  stallDetails = [],
  selectedStallId,
  selectedStallIds = [],
  selectedStallsCount = 0,
  exhibition
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [internalSelectedStallIds, setInternalSelectedStallIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'selected' | 'available'>('selected');

  // Initialize selected stalls from form, selectedStallId, or selectedStallIds
  useEffect(() => {
    const formSelectedStalls = form.getFieldValue('selectedStalls') || [];
    
    // Start with form values, ensuring all IDs are strings
    const mappedIds: string[] = formSelectedStalls.map((id: string | number) => String(id));
    let newSelectedStalls: string[] = [...mappedIds];
    
    // Add selectedStallId if provided and not already included
    if (selectedStallId) {
      const normalizedId = String(selectedStallId);
      if (!newSelectedStalls.some(id => id === normalizedId)) {
        newSelectedStalls.push(normalizedId);
      }
    }
    
    // Add selectedStallIds if provided and not already included
    if (selectedStallIds.length > 0) {
      selectedStallIds.forEach((id: string | number) => {
        const normalizedId = String(id);
        if (!newSelectedStalls.some((existingId: string) => existingId === normalizedId)) {
          newSelectedStalls.push(normalizedId);
        }
      });
    }
    
    console.log('StallDetailsStep - Initial stalls after normalization:', newSelectedStalls);
    
    // Always update form and state with the normalized IDs (even if empty)
    form.setFieldsValue({ selectedStalls: newSelectedStalls });
    setInternalSelectedStallIds(newSelectedStalls);
  }, [form, selectedStallId, selectedStallIds]);

  // Update form when internalSelectedStallIds changes
  useEffect(() => {
    // Only update if we have selections and they differ from current form values
    if (internalSelectedStallIds.length > 0) {
      const formSelectedStalls = form.getFieldValue('selectedStalls') || [];
      
      // Check if the arrays are different (ignoring order)
      const formStallsSet = new Set(formSelectedStalls.map((id: string | number) => String(id)));
      const internalStallsSet = new Set(internalSelectedStallIds.map(id => String(id)));
      
      let isDifferent = formStallsSet.size !== internalStallsSet.size;
      if (!isDifferent) {
        // Check if all items in internalStallsSet exist in formStallsSet
        for (const id of internalStallsSet) {
          if (!formStallsSet.has(id)) {
            isDifferent = true;
            break;
          }
        }
      }
      
      if (isDifferent) {
        console.log('Syncing form with selected stalls:', internalSelectedStallIds);
        
        // Normalize stall IDs to strings
        const normalizedStalls = internalSelectedStallIds.map(id => String(id));
        form.setFieldsValue({ selectedStalls: normalizedStalls });
        
        // Force a validation to update form status
        form.validateFields(['selectedStalls']).catch((_: unknown) => {
          // Ignore validation errors - just forcing a check
        });
      }
    }
  }, [internalSelectedStallIds, form]);

  // Get unique hall IDs
  const halls = useMemo(() => {
    if (!stallDetails || stallDetails.length === 0) {
      return [];
    }
    
    const uniqueHalls = new Set(stallDetails.map(stall => stall.hallId));
    return Array.from(uniqueHalls).map(hallId => ({
      value: hallId,
      label: stallDetails.find(s => s.hallId === hallId)?.hallName || `Hall - ${hallId}`
    }));
  }, [stallDetails]);

  // Filter stalls based on search and hall selection
  const filteredStalls = useMemo(() => {
    if (!stallDetails || stallDetails.length === 0) {
      return [];
    }
    
    return stallDetails
      .filter(stall => stall.status === 'available')
      .filter(stall => 
        (!searchQuery || stall.number?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!selectedHall || stall.hallId === selectedHall)
      );
  }, [stallDetails, searchQuery, selectedHall]);

  // Get selected stalls
  const selectedStalls = useMemo(() => {
    if (!stallDetails || stallDetails.length === 0) {
      return [];
    }
    
    return stallDetails.filter(stall => internalSelectedStallIds.includes(stall.id));
  }, [stallDetails, internalSelectedStallIds]);

  // Calculate totals based on selected stalls
  const calculations = useMemo(() => {
    if (!stallDetails || stallDetails.length === 0) {
      return {
        baseAmount: 0,
        discounts: [],
        totalDiscountAmount: 0,
        amountAfterDiscount: 0,
        taxes: [],
        totalTaxAmount: 0,
        total: 0,
        selectedStallNumbers: ''
      };
    }
    
    const selectedStalls = stallDetails.filter(stall => internalSelectedStallIds.includes(stall.id));
    
    const baseAmount = selectedStalls.reduce((sum, stall) => 
      sum + (stall.price || (stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height)), 0);

    // Find active public discounts and calculate total discount
    const activeDiscounts = exhibition?.publicDiscountConfig?.filter((d: PublicDiscount) => d.isActive) || [];
    const discounts = activeDiscounts.map((discount: PublicDiscount): CalculatedDiscount => {
      const amount = discount.type === 'percentage' 
        ? baseAmount * (Math.min(Math.max(0, discount.value), 100) / 100)
        : Math.min(discount.value, baseAmount);
      return {
        name: discount.name,
        type: discount.type,
        value: discount.value,
        amount
      };
    });

    const totalDiscountAmount = discounts.reduce((sum: number, d: CalculatedDiscount) => sum + d.amount, 0);
    const amountAfterDiscount = baseAmount - totalDiscountAmount;

    // Calculate taxes based on exhibition configuration
    const taxes = exhibition?.taxConfig
      ?.filter(tax => tax.isActive)
      ?.map(tax => ({
        name: tax.name,
        rate: tax.rate,
        amount: amountAfterDiscount * (tax.rate / 100)
      })) || [];

    const totalTaxAmount = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    const total = amountAfterDiscount + totalTaxAmount;

    return {
      baseAmount,
      discounts,
      totalDiscountAmount,
      amountAfterDiscount,
      taxes,
      totalTaxAmount,
      total,
      selectedStallNumbers: selectedStalls.map(s => `${s.number} (${s.hallName || `Hall - ${s.hallId}`})`).join(', ')
    };
  }, [stallDetails, internalSelectedStallIds, exhibition?.taxConfig, exhibition?.publicDiscountConfig]);

  // Handle stall selection
  const handleStallSelection = (stallId: string) => {
    // Ensure ID is always a string for consistent comparison
    const normalizedStallId = String(stallId);
    
    // Check if the stall is already selected using string comparison
    const isSelected = internalSelectedStallIds.some(id => String(id) === normalizedStallId);
    
    // Create a new selection array, normalizing all IDs to strings
    const newSelection = isSelected
      ? internalSelectedStallIds.filter(id => String(id) !== normalizedStallId)
      : [...internalSelectedStallIds, normalizedStallId];
    
    // Update internal state and form values
    setInternalSelectedStallIds(newSelection);
    form.setFieldsValue({ selectedStalls: newSelection });
    
    // Show user feedback
    if (isSelected) {
      message.info(`Stall removed from selection`);
    } else {
      message.success(`Stall added to selection`);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <StepContent>
      <PageTitle>Select Your Stalls</PageTitle>
      <PageSubtitle>
        Click on stalls to select or deselect them. You can select multiple stalls for booking.
      </PageSubtitle>
      
      <FilterBar>
        <Input
          placeholder="Search by stall number"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <Select
          placeholder="Filter by hall"
          allowClear
          className="filter-select"
          options={halls}
          onChange={value => setSelectedHall(value)}
        />
      </FilterBar>
      
      {/* Hide the actual form field but keep it for validation */}
      <Form.Item
        name="selectedStalls"
        rules={[
          { 
            required: true, 
            message: 'Please select at least one stall' 
          }
        ]}
        style={{ display: 'none' }}
      >
        <Select mode="multiple" />
      </Form.Item>
      
      <StallTabsContainer>
        <div className="tab-header">
          <div 
            className={`tab-item ${activeTab === 'selected' ? 'active' : ''}`}
            onClick={() => setActiveTab('selected')}
          >
            <CheckCircleOutlined />
            <span>Selected Stalls</span>
            <span className={`badge ${activeTab === 'selected' ? 'active' : ''}`}>
              {internalSelectedStallIds.length}
            </span>
          </div>
          <div 
            className={`tab-item ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <ShoppingCartOutlined />
            <span>Available Stalls</span>
          </div>
        </div>
        
        {/* Selected Stalls Tab */}
        {activeTab === 'selected' && (
          <>
            {selectedStalls.length > 0 ? (
              <StallGrid>
                {selectedStalls.map(stall => (
                  <StallCard
                    key={stall.id}
                    selected={true}
                    onClick={() => handleStallSelection(stall.id)}
                  >
                    <div className="selection-indicator">
                      <CheckOutlined />
                    </div>
                    <div className="stall-price">
                      {formatCurrency(stall.price || (stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height))}
                    </div>
                    <div className="stall-number">
                      Stall {stall.number || stall.stallNumber}
                      <span className="hall-label">Hall - {stall.hallName || stall.hallId}</span>
                    </div>
                    <div className="stall-details">
                      <div className="detail-item">
                        <div className="label">Area</div>
                        <div className="value">{stall.dimensions.width * stall.dimensions.height} sq.m</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Dimensions</div>
                        <div className="value">{stall.dimensions.width}m × {stall.dimensions.height}m</div>
                      </div>
                    </div>
                  </StallCard>
                ))}
              </StallGrid>
            ) : (
              <Empty
                description="No stalls selected yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ margin: '32px 0' }}
              />
            )}
          </>
        )}
        
        {/* Available Stalls Tab */}
        {activeTab === 'available' && (
          <StallGrid>
            {filteredStalls.map(stall => (
              <StallCard
                key={stall.id}
                selected={internalSelectedStallIds.includes(stall.id)}
                onClick={() => handleStallSelection(stall.id)}
              >
                <div className="selection-indicator">
                  {internalSelectedStallIds.includes(stall.id) && <CheckOutlined />}
                </div>
                <div className="stall-price">
                  {formatCurrency(stall.price || (stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height))}
                </div>
                <div className="stall-number">
                  Stall {stall.number || stall.stallNumber}
                  <span className="hall-label">Hall - {stall.hallName || stall.hallId}</span>
                </div>
                <div className="stall-details">
                  <div className="detail-item">
                    <div className="label">Area</div>
                    <div className="value">{stall.dimensions.width * stall.dimensions.height} sq.m</div>
                  </div>
                  <div className="detail-item">
                    <div className="label">Dimensions</div>
                    <div className="value">{stall.dimensions.width}m × {stall.dimensions.height}m</div>
                  </div>
                </div>
              </StallCard>
            ))}
          </StallGrid>
        )}
        
        {/* Booking Summary */}
        {internalSelectedStallIds.length > 0 && (
          <BookingSummaryCard title="Booking Summary">
            <div className="summary-row">
              <div className="label">Selected Stalls</div>
              <div className="value">{internalSelectedStallIds.length} stall(s) selected</div>
            </div>
            <div className="summary-row">
              <div className="label">Stall Numbers</div>
              <div className="value">{calculations.selectedStallNumbers}</div>
            </div>
            <div className="summary-row">
              <div className="label">Base Amount</div>
              <div className="value">{formatCurrency(calculations.baseAmount)}</div>
            </div>
            
            {calculations.discounts.map((discount, index) => (
              <div className="summary-row discount" key={`discount-${index}`}>
                <div className="label">
                  Discount ({discount.name})
                  {discount.type === 'percentage' ? ` (${discount.value}%)` : ''}
                </div>
                <div className="value">- {formatCurrency(discount.amount)}</div>
              </div>
            ))}
            
            <div className="summary-row">
              <div className="label">Amount after Discount</div>
              <div className="value">{formatCurrency(calculations.amountAfterDiscount)}</div>
            </div>
            
            {calculations.taxes.map((tax, index) => (
              <div className="summary-row" key={`tax-${index}`}>
                <div className="label">{tax.name} ({tax.rate}%)</div>
                <div className="value">{formatCurrency(tax.amount)}</div>
              </div>
            ))}
            
            <div className="summary-row total">
              <div className="label">Total</div>
              <div className="value">{formatCurrency(calculations.total)}</div>
            </div>
          </BookingSummaryCard>
        )}
      </StallTabsContainer>
    </StepContent>
  );
};

export default StallDetailsStep; 