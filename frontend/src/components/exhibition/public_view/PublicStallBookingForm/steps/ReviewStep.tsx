import React, { useMemo, useEffect, useState } from 'react';
import { Typography, Descriptions, Card, Space, Spin, Alert, Button, Divider, Table, Tag, Form, Input } from 'antd';
import { StepProps } from '../types';
import { PublicDiscount } from '../../../../../services/publicExhibition';
import { StepContent } from '../styles';

const { Title, Paragraph, Text } = Typography;

interface CalculatedDiscount {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

const ReviewStep: React.FC<StepProps> = ({
  form,
  stallDetails = [],
  selectedStallId,
  selectedStallIds = [],
  selectedStalls = [],
  exhibition,
  onPrev,
  onFinish,
  loading = false,
  formValues = {}
}) => {
  const [formattedStallDetails, setFormattedStallDetails] = useState<any[]>([]);
  
  // Consolidate all selected stall IDs from various sources
  const allSelectedStallIds = useMemo(() => {
    // Start with form values - this should be the most reliable source
    const formStalls = form.getFieldValue('selectedStalls') || [];
    
    // Normalize to strings for consistent comparison
    const normalizedFormStalls = formStalls.map((id: any) => String(id));
    
    // Log for debugging
    console.log('ReviewStep - Form has selectedStalls:', normalizedFormStalls);
    console.log('ReviewStep - Props selectedStallIds:', selectedStallIds);
    console.log('ReviewStep - Props selectedStalls:', selectedStalls);
    
    // If we have form values, prioritize them
    if (normalizedFormStalls.length > 0) {
      return normalizedFormStalls;
    }
    
    // Otherwise, try to combine from all sources
    const combinedIds: string[] = [];
    
    if (selectedStallId) {
      const normalizedId = String(selectedStallId);
      combinedIds.push(normalizedId);
    }
    
    if (selectedStallIds && selectedStallIds.length) {
      selectedStallIds.forEach((id: any) => {
        const normalizedId = String(id);
        if (!combinedIds.includes(normalizedId)) {
          combinedIds.push(normalizedId);
        }
      });
    }
    
    if (selectedStalls && selectedStalls.length) {
      selectedStalls.forEach((id: any) => {
        const normalizedId = String(id);
        if (!combinedIds.includes(normalizedId)) {
          combinedIds.push(normalizedId);
        }
      });
    }
    
    console.log('ReviewStep - Final consolidated stall IDs:', combinedIds);
    return combinedIds;
  }, [form, selectedStallId, selectedStallIds, selectedStalls]);
  
  // Process stall details once we have them
  useEffect(() => {
    console.log('ReviewStep - Processing stall details with IDs:', allSelectedStallIds);
    console.log('ReviewStep - Available stall details:', stallDetails);
    
    if (stallDetails && stallDetails.length && allSelectedStallIds.length) {
      // Find all selected stalls in the stallDetails array
      const matchedStalls = stallDetails.filter(stall => 
        allSelectedStallIds.includes(String(stall.id))
      );
      
      console.log('ReviewStep - Matched stalls:', matchedStalls.length);
      
      // Format stall details for display
      const formatted = matchedStalls.map(stall => ({
        key: stall.id,
        id: stall.id,
        number: stall.number || (stall as any).stallNumber || `Stall ${stall.id}`,
        hallName: stall.hallName || `Hall ${stall.hallId}`,
        size: `${stall.dimensions.width}m × ${stall.dimensions.height}m`,
        area: stall.dimensions.width * stall.dimensions.height,
        rate: stall.ratePerSqm,
        price: stall.price || stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height,
        type: stall.typeName || stall.type || 'Standard'
      }));
      
      setFormattedStallDetails(formatted);
    }
  }, [stallDetails, allSelectedStallIds]);
  
  // Get selected amenities 
  const selectedAmenities = form.getFieldValue('amenities') || [];

  // Calculate booking summary with all stalls and amenities
  const bookingSummary = useMemo(() => {
    // Base stall amount
    const baseAmount = formattedStallDetails.reduce((sum, stall) => sum + stall.price, 0);
    
    // Calculate amenities total if any are selected
    let amenitiesTotal = 0;
    const amenityItems = selectedAmenities.map((amenityId: string) => {
      const amenity = (exhibition as any)?.amenities?.find((a: any) => 
        (a.id === amenityId || a._id === amenityId)
      );
      if (amenity) {
        amenitiesTotal += amenity.rate || 0;
        return {
          name: amenity.name,
          rate: amenity.rate,
          type: amenity.type
        };
      }
      return null;
    }).filter(Boolean);
    
    // Apply discounts
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
    
    // Calculate subtotal (stalls + amenities - discounts)
    const subtotal = amountAfterDiscount + amenitiesTotal;

    // Apply taxes
    const taxes = exhibition?.taxConfig
      ?.filter((tax: any) => tax.isActive)
      ?.map((tax: any) => ({
        name: tax.name,
        rate: tax.rate,
        amount: subtotal * (tax.rate / 100)
      })) || [];

    const totalTaxAmount = taxes.reduce((sum: number, tax: any) => sum + tax.amount, 0);
    
    return {
      baseAmount,
      amenities: amenityItems,
      amenitiesTotal,
      discounts,
      totalDiscountAmount,
      amountAfterDiscount,
      subtotal,
      taxes,
      totalTaxAmount,
      total: subtotal + totalTaxAmount,
      stallCount: formattedStallDetails.length
    };
  }, [formattedStallDetails, selectedAmenities, exhibition]);
  
  // Store discount in the form - properly moved outside of useMemo
  useEffect(() => {
    const activeDiscounts = exhibition?.publicDiscountConfig?.filter((d: PublicDiscount) => d.isActive) || [];
    if (activeDiscounts.length > 0) {
      const selectedDiscount = activeDiscounts[0];
      console.log('Setting discountId in form to:', selectedDiscount);
      form.setFieldsValue({
        discountId: {
          name: selectedDiscount.name,
          type: selectedDiscount.type,
          value: selectedDiscount.value
        }
      });
    }
  }, [exhibition, form]);
  
  // Columns for stall table
  const columns = [
    {
      title: 'Stall Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Hall',
      dataIndex: 'hallName',
      key: 'hallName',
    },
    {
      title: 'Stall Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="purple">{type}</Tag>
      )
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
      render: (area: number) => `${area} sqm`
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => `₹${rate}/sqm`
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `₹${price.toLocaleString()}`
    },
  ];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };
  
  // Get exhibitor details from form
  const customerName = formValues.customerName || form.getFieldValue('customerName');
  const customerPhone = formValues.customerPhone || form.getFieldValue('customerPhone');
  const customerEmail = formValues.email || form.getFieldValue('email');
  const companyName = formValues.companyName || form.getFieldValue('companyName');
  
  // Log exhibitor information for debugging
  console.log('ReviewStep - Exhibitor Info:', {
    customerName,
    companyName,
    customerPhone,
    customerEmail,
    formValues,
    formFieldValues: {
      customerName: form.getFieldValue('customerName'),
      companyName: form.getFieldValue('companyName'),
      customerPhone: form.getFieldValue('customerPhone'),
      email: form.getFieldValue('email')
    }
  });
  
  if (loading) {
    return (
      <StepContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Spin size="large" tip="Processing your booking..." />
      </StepContent>
    );
  }
  
  if (allSelectedStallIds.length === 0) {
    return (
      <StepContent>
        <Alert
          message="No Stalls Selected"
          description="Please go back and select at least one stall to book."
          type="warning"
          showIcon
        />
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button onClick={onPrev}>Back to Stall Selection</Button>
        </div>
      </StepContent>
    );
  }

  return (
    <StepContent>
      {/* Hidden form field for discount ID without a nested form */}
      <Form.Item name="discountId" hidden={true}>
        <Input />
      </Form.Item>
      
      <Title level={4}>Booking Summary</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Please review your booking details before submitting.
      </Paragraph>
      
      {/* Exhibitor Information */}
      <Card title="Exhibitor Information" style={{ marginBottom: 24 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Name">{customerName || "Not provided"}</Descriptions.Item>
          <Descriptions.Item label="Company">{companyName || "Not provided"}</Descriptions.Item>
          <Descriptions.Item label="Phone">{customerPhone || "Not provided"}</Descriptions.Item>
          <Descriptions.Item label="Email">{customerEmail || "Not provided"}</Descriptions.Item>
        </Descriptions>
      </Card>
      
      {/* Selected Stalls */}
      <Card title="Selected Stalls" className="review-card" size="small">
        <Table 
          dataSource={formattedStallDetails} 
          columns={columns} 
          pagination={false} 
          size="small"
          style={{ marginBottom: 16 }}
        />
        <Text strong>Total Base Amount: {formatCurrency(bookingSummary.baseAmount)}</Text>
      </Card>
      
      {/* Selected Amenities */}
      {bookingSummary.amenities && bookingSummary.amenities.length > 0 && (
        <Card title="Selected Amenities" style={{ marginBottom: 24 }}>
          {bookingSummary.amenities.map((amenity: any, index: number) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <Text>{amenity.name}</Text>
                <Tag color="blue" style={{ marginLeft: 8 }}>{amenity.type}</Tag>
              </div>
              <Text>{formatCurrency(amenity.rate)}</Text>
            </div>
          ))}
          <Divider />
          <Text strong>Amenities Total: {formatCurrency(bookingSummary.amenitiesTotal)}</Text>
        </Card>
      )}
      
      {/* Price Calculation */}
      <Card title="Price Calculation" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text>Base Amount:</Text>
          <Text>{formatCurrency(bookingSummary.baseAmount)}</Text>
        </div>
        
        {bookingSummary.discounts.length > 0 && (
          <>
            {bookingSummary.discounts.map((discount: CalculatedDiscount, index: number) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>{discount.name} ({discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value)}):</Text>
                <Text type="danger">- {formatCurrency(discount.amount)}</Text>
              </div>
            ))}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Amount after Discount:</Text>
              <Text>{formatCurrency(bookingSummary.amountAfterDiscount)}</Text>
            </div>
          </>
        )}
        
        {bookingSummary.amenitiesTotal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text>Amenities:</Text>
            <Text>{formatCurrency(bookingSummary.amenitiesTotal)}</Text>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text strong>Subtotal:</Text>
          <Text strong>{formatCurrency(bookingSummary.subtotal)}</Text>
        </div>
        
        {bookingSummary.taxes.length > 0 && (
          <>
            {bookingSummary.taxes.map((tax: any, index: number) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>{tax.name} ({tax.rate}%):</Text>
                <Text>{formatCurrency(tax.amount)}</Text>
              </div>
            ))}
          </>
        )}
        
        <Divider />
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={5}>Total:</Title>
          <Title level={5}>{formatCurrency(bookingSummary.total)}</Title>
        </div>
      </Card>
    </StepContent>
  );
};

export default ReviewStep; 