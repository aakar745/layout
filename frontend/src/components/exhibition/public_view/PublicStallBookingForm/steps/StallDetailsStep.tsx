import React, { useState, useMemo, useEffect } from 'react';
import { Form, Select, message, Empty, Table, Tag, Button, Space, Tooltip } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { StepProps } from '../types';
import { PublicDiscount } from '../../../../../services/publicExhibition';
import { 
  StepContent, 
  PageTitle,
  PageSubtitle,
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
  exhibition
}) => {
  const [internalSelectedStallIds, setInternalSelectedStallIds] = useState<string[]>([]);

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
      selectedStallNumbers: selectedStalls.map(s => `${s.number || s.stallNumber || `Stall ${s.id}`} (${s.hallName || `Hall ${s.hallId || 1}`})`).join(', ')
    };
  }, [stallDetails, internalSelectedStallIds, exhibition?.taxConfig, exhibition?.publicDiscountConfig]);

  // Handle stall selection
  const handleStallSelection = (stallId: string) => {
    // Ensure ID is always a string for consistent comparison
    const normalizedStallId = String(stallId);
    
    // Check if the stall is already selected using string comparison
    const isSelected = internalSelectedStallIds.some(id => String(id) === normalizedStallId);
    
    // Only allow removal of stalls, not adding new ones
    if (isSelected) {
      // Create a new selection array, normalizing all IDs to strings
      const newSelection = internalSelectedStallIds.filter(id => String(id) !== normalizedStallId);
      
      // Update internal state and form values
      setInternalSelectedStallIds(newSelection);
      form.setFieldsValue({ selectedStalls: newSelection });
      
      // Show user feedback
      message.info(`Stall removed from selection`);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <StepContent>
      <PageTitle>Your Selected Stalls</PageTitle>
      <PageSubtitle>
        Review your selected stalls. You can remove a stall by clicking the delete button.
      </PageSubtitle>
      
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
      
      {/* Selected Stalls as List View */}
      {selectedStalls.length > 0 ? (
        <div style={{ 
          marginBottom: 24, 
          background: '#fff', 
          borderRadius: '8px', 
          padding: '16px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' 
        }}>
          <Table
            dataSource={selectedStalls.map(stall => ({
              ...stall,
              key: stall.id,
              price: stall.price || (stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height),
              area: stall.dimensions.width * stall.dimensions.height,
              dimensions: `${stall.dimensions.width}m × ${stall.dimensions.height}m`,
              size: `${stall.dimensions.width}m × ${stall.dimensions.height}m`,
              stallType: stall.stallType || { 
                name: stall.typeName || stall.type || 'Standard' 
              },
              type: stall.typeName || stall.type || 'Standard'
            }))}
            pagination={false}
            size="middle"
            rowClassName={() => 'stall-table-row'}
            className="selected-stalls-table"
            style={{ 
              borderRadius: '6px',
              overflow: 'hidden'
            }}
            columns={[
              {
                title: 'Stall',
                dataIndex: 'number',
                key: 'number',
                render: (number, record: any) => (
                  <span style={{ fontWeight: 600, fontSize: '15px' }}>
                    Stall {number || record.stallNumber}
                  </span>
                )
              },
              {
                title: 'Hall',
                dataIndex: 'hallName',
                key: 'hallName',
                render: (hallName, record: any) => (
                  <Tag color="blue" style={{ borderRadius: '4px' }}>
                    {hallName || `Hall ${record.hallId}`}
                  </Tag>
                )
              },
              {
                title: 'Stall Type',
                dataIndex: 'stallType',
                key: 'stallType',
                align: 'center',
                render: (_, record: any) => {
                  const typeName = record.stallType?.name || record.type || 'Standard';
                  return (
                    <Tag color="purple" style={{ borderRadius: '4px', padding: '2px 8px' }}>
                      {typeName}
                    </Tag>
                  );
                }
              },
              {
                title: 'Dimensions',
                dataIndex: 'dimensions',
                key: 'dimensions',
                align: 'center',
                render: (dims, record: any) => (
                  <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>{dims}</span>
                    <span style={{ color: '#888', fontSize: '13px' }}>{record.area} sqm</span>
                  </Space>
                )
              },
              {
                title: 'Rate',
                dataIndex: 'ratePerSqm',
                key: 'ratePerSqm',
                align: 'right',
                render: (rate, record: any) => (
                  <span style={{ color: '#555' }}>
                    ₹{(record.ratePerSqm || 0).toLocaleString('en-IN')}/sqm
                  </span>
                )
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                align: 'right',
                render: (price) => (
                  <span style={{ 
                    fontWeight: 600, 
                    color: '#1890ff',
                    fontSize: '15px',
                    display: 'block',
                    padding: '4px 8px',
                    background: 'rgba(24, 144, 255, 0.1)',
                    borderRadius: '4px',
                    textAlign: 'right' 
                  }}>
                    {formatCurrency(price)}
                  </span>
                )
              },
              {
                title: '',
                key: 'action',
                width: 70,
                align: 'center' as 'center',
                render: (_, record: any) => (
                  <Tooltip title="Remove from selection">
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleStallSelection(record.id)}
                      size="middle"
                      style={{
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    />
                  </Tooltip>
                )
              }
            ]}
          />
        </div>
      ) : (
        <Empty
          description="No stalls selected yet. Please select stalls from the layout."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '32px 0' }}
        />
      )}
      
      {/* Booking Summary */}
      {internalSelectedStallIds.length > 0 && (
        <BookingSummaryCard 
          title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Booking Summary</span>}
          style={{ 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
          }}
          headStyle={{ 
            background: '#f6f8fa',
            borderBottom: '1px solid #eee'
          }}
          bodyStyle={{ 
            padding: '16px 24px' 
          }}
        >
          <div className="summary-row">
            <div className="label">Selected Stalls</div>
            <div className="value">{internalSelectedStallIds.length} stall(s) selected</div>
          </div>
          <div className="summary-row">
            <div className="label">Stall Numbers</div>
            <div className="value" style={{ maxWidth: '60%', wordBreak: 'break-word' }}>
              {calculations.selectedStallNumbers}
            </div>
          </div>
          <div className="summary-row">
            <div className="label">Base Amount</div>
            <div className="value">{formatCurrency(calculations.baseAmount)}</div>
          </div>
          
          {calculations.discounts.map((discount, index) => (
            <div className="summary-row discount" key={`discount-${index}`}>
              <div className="label">
                {discount.name}
                {discount.type === 'percentage' ? ` (${discount.value}%)` : ''}
              </div>
              <div className="value" style={{ color: '#52c41a' }}>
                - {formatCurrency(discount.amount)}
              </div>
            </div>
          ))}
          
          <div className="summary-row">
            <div className="label">Amount after Discount</div>
            <div className="value" style={{ fontWeight: 500 }}>
              {formatCurrency(calculations.amountAfterDiscount)}
            </div>
          </div>
          
          {calculations.taxes.map((tax, index) => (
            <div className="summary-row" key={`tax-${index}`}>
              <div className="label">
                {tax.name} ({tax.rate}%)
              </div>
              <div className="value" style={{ color: '#faad14' }}>
                + {formatCurrency(tax.amount)}
              </div>
            </div>
          ))}
          
          <div className="summary-row total" style={{ 
            marginTop: '16px', 
            paddingTop: '16px',
            borderTop: '1px solid #f0f0f0' 
          }}>
            <div className="label" style={{ fontSize: '16px', fontWeight: 600 }}>Total</div>
            <div className="value" style={{ 
              fontSize: '18px', 
              fontWeight: 700,
              color: '#1890ff' 
            }}>
              {formatCurrency(calculations.total)}
            </div>
          </div>
        </BookingSummaryCard>
      )}
    </StepContent>
  );
};

export default StallDetailsStep; 