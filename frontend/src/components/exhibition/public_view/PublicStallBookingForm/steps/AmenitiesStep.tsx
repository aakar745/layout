import React, { useState, useMemo } from 'react';
import { Alert, Card, Divider, Empty, Typography, Form, List, Checkbox, Tag, Space, Row, Col, Badge, Tooltip, Table, Button, Select, Collapse, InputNumber, Input } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, RocketOutlined, InboxOutlined, PlusOutlined, InfoCircleOutlined, DownOutlined } from '@ant-design/icons';
import { StepProps } from '../types';
import { StepContent } from '../styles';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

// Define interfaces for amenities
interface BasicAmenity {
  _id?: string;
  id?: string;
  type: 'facility' | 'service' | 'equipment' | 'other';
  name: string;
  description: string;
  perSqm: number;
  quantity: number;
  calculatedQuantity?: number;
}

interface ExtraAmenity {
  _id?: string;
  id?: string;
  type: 'facility' | 'service' | 'equipment' | 'other';
  name: string;
  description: string;
  rate: number;
  quantity?: number;
}

const AmenitiesStep: React.FC<StepProps> = ({
  form,
  formValues,
  selectedStallIds = [],
  exhibition,
  stallDetails = []
}) => {
  // Get selected stalls from form
  const selectedStalls = form.getFieldValue('selectedStalls') || selectedStallIds || [];
  
  // Create state for selected amenities
  const [selectedExtraAmenities, setSelectedExtraAmenities] = useState<string[]>(
    form.getFieldValue('amenities') || []
  );

  // State to track quantity for each selected amenity
  const [amenityQuantities, setAmenityQuantities] = useState<Record<string, number>>({});

  // Find the selected stall details
  const selectedStallDetails = useMemo(() => {
    if (!stallDetails?.length) return [];
    
    return stallDetails.filter(stall => 
      selectedStalls.includes(stall.id)
    );
  }, [stallDetails, selectedStalls]);
  
  // Calculate total square meters of all selected stalls
  const totalStallArea = useMemo(() => {
    return selectedStallDetails.reduce((total, stall) => {
      return total + (stall.dimensions.width * stall.dimensions.height);
    }, 0);
  }, [selectedStallDetails]);
  
  // Safely check for basic amenities and extra amenities
  const hasBasicAmenities = exhibition?.basicAmenities && exhibition.basicAmenities.length > 0;
  const hasExtraAmenities = exhibition?.amenities && exhibition.amenities.length > 0;

  // Calculate quantities for basic amenities based on stall size
  const basicAmenitiesWithQuantities = useMemo(() => {
    if (!hasBasicAmenities || totalStallArea === 0) return [];

    return (exhibition?.basicAmenities || []).map((amenity: BasicAmenity) => {
      // Calculate quantity based on square meters and perSqm rate
      // e.g., 1 table per 9 sqm with total area of 27 sqm = 3 tables
      const calculatedQuantity = Math.floor(totalStallArea / amenity.perSqm) * amenity.quantity;
      
      return {
        ...amenity,
        calculatedQuantity: calculatedQuantity > 0 ? calculatedQuantity : 0,
        key: amenity._id || amenity.id // Add key for table
      };
    });
  }, [exhibition, hasBasicAmenities, totalStallArea]);

  // Handle extra amenities selection
  const handleExtraAmenityChange = (amenityIds: string[]) => {
    // Initialize quantity of 1 for newly selected amenities
    const updatedQuantities = { ...amenityQuantities };
    
    // Set quantity = 1 for any newly selected amenities
    amenityIds.forEach(id => {
      if (!selectedExtraAmenities.includes(id)) {
        updatedQuantities[id] = 1;
      }
    });
    
    // Remove quantities for deselected amenities
    Object.keys(updatedQuantities).forEach(id => {
      if (!amenityIds.includes(id)) {
        delete updatedQuantities[id];
      }
    });
    
    setAmenityQuantities(updatedQuantities);
    setSelectedExtraAmenities(amenityIds);
  };

  // Get amenity ID safely (handles both _id and id properties)
  const getAmenityId = (amenity: ExtraAmenity): string => {
    return (amenity._id || amenity.id || '').toString();
  };

  // Handle quantity change for an amenity
  const handleQuantityChange = (amenityId: string, quantity: number) => {
    setAmenityQuantities(prev => ({
      ...prev,
      [amenityId]: quantity
    }));
  };

  // Update form field when selected amenities change
  React.useEffect(() => {
    // Create an array of amenity objects with their quantities
    const amenitiesWithQuantities = selectedExtraAmenities.map(id => ({
      id,
      quantity: amenityQuantities[id] || 1
    }));
    
    form.setFieldsValue({ amenities: amenitiesWithQuantities });
  }, [selectedExtraAmenities, amenityQuantities, form]);

  // Format currency display
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };
  
  // Selected Extra Amenities for display
  const selectedExtraAmenitiesDetails = useMemo(() => {
    if (!hasExtraAmenities) return [];
    
    return (exhibition?.amenities || [])
      .filter((amenity: ExtraAmenity) => selectedExtraAmenities.includes(getAmenityId(amenity)))
      .map((amenity: ExtraAmenity) => ({
        ...amenity,
        key: getAmenityId(amenity),
        quantity: amenityQuantities[getAmenityId(amenity)] || 1
      }));
  }, [exhibition, hasExtraAmenities, selectedExtraAmenities, amenityQuantities]);
  
  // Basic Amenities table columns
  const basicAmenitiesColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: BasicAmenity) => (
        <Space>
          <Text strong>{text}</Text>
          <Tag color="blue">{record.type}</Tag>
        </Space>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'calculatedQuantity',
      key: 'calculatedQuantity',
      width: 120,
      render: (quantity: number) => (
        <Tag color="green">{quantity} {quantity === 1 ? 'unit' : 'units'}</Tag>
      )
    },
    {
      title: 'Allocation',
      dataIndex: 'perSqm',
      key: 'perSqm',
      width: 180,
      render: (perSqm: number, record: BasicAmenity) => (
        <Tooltip title={record.description}>
          <Text type="secondary">
            <InfoCircleOutlined style={{ marginRight: 5 }} />
            1 {record.quantity > 1 ? `set of ${record.quantity}` : 'unit'} per {perSqm} sqm
          </Text>
        </Tooltip>
      )
    }
  ];

  // Extra amenities table columns
  const extraAmenitiesColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ExtraAmenity) => (
        <Space align="center">
          <Text strong>{text}</Text>
          <Tag color="blue">{record.type}</Tag>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {record.description}
          </Text>
        </Space>
      )
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 120,
      render: (rate: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          {formatCurrency(rate)}
        </Text>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (_: any, record: ExtraAmenity & { key: string }) => (
        <InputNumber
          min={1}
          value={amenityQuantities[record.key] || 1}
          onChange={(value) => handleQuantityChange(record.key, value || 1)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Total',
      key: 'total',
      width: 120,
      render: (_: unknown, record: ExtraAmenity & { key: string }) => {
        const quantity = amenityQuantities[record.key] || 1;
        const total = record.rate * quantity;
        return (
          <Text strong style={{ color: '#1890ff' }}>
            {formatCurrency(total)}
          </Text>
        );
      }
    }
  ];
  
  return (
    <StepContent>
      <Title level={4}>Stall Amenities</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Review included amenities and select additional amenities for your exhibition stalls.
      </Paragraph>
      
      <Card title={`Selected Stalls: ${selectedStalls.length}`} style={{ marginBottom: 24 }}>
        {selectedStalls.length > 0 ? (
          <Paragraph>
            You've selected {selectedStalls.length} stall(s) with a total area of {totalStallArea} sq. meters.
          </Paragraph>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="No stalls selected" 
          />
        )}
      </Card>
      
      {/* Basic Amenities Section - Now in table format */}
      <Card 
        title={<Space><Badge status="success" />Included Amenities</Space>}
        style={{ marginBottom: 24 }}
      >
        {selectedStalls.length === 0 ? (
          <Alert 
            message="Select stalls first" 
            description="Please select stalls to see what amenities are included." 
            type="info" 
            showIcon 
          />
        ) : hasBasicAmenities ? (
          <Table 
            dataSource={basicAmenitiesWithQuantities.filter(a => a.calculatedQuantity > 0)} 
            columns={basicAmenitiesColumns} 
            pagination={false}
            size="small"
            locale={{
              emptyText: (
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Your stall area is too small to qualify for any basic amenities." 
                />
              )
            }}
          />
        ) : (
          <Empty 
            image={<InboxOutlined style={{ fontSize: 60, color: '#cccccc' }} />}
            description="No basic amenities have been configured for this exhibition."
          />
        )}
      </Card>
      
      <Divider />
      
      {/* Extra Amenities Section - Now with dropdown selection */}
      <Card title="Additional Amenities (Extra Charges)">
        {hasExtraAmenities ? (
          <div>
            <Form.Item label="Select Additional Amenities" style={{ marginBottom: 24 }}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select amenities"
                value={selectedExtraAmenities}
                onChange={handleExtraAmenityChange}
                optionLabelProp="label"
              >
                {(exhibition?.amenities || []).map((amenity: ExtraAmenity) => (
                  <Option 
                    key={getAmenityId(amenity)} 
                    value={getAmenityId(amenity)}
                    label={`${amenity.name} (${formatCurrency(amenity.rate)})`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Space>
                        <Text strong>{amenity.name}</Text>
                        <Tag color="blue">{amenity.type}</Tag>
                      </Space>
                      <Text style={{ color: '#1890ff' }}>{formatCurrency(amenity.rate)}</Text>
                    </div>
                    <div>
                      <Text type="secondary">{amenity.description}</Text>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            {selectedExtraAmenitiesDetails.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Divider orientation="left">Selected Amenities</Divider>
                <Table 
                  dataSource={selectedExtraAmenitiesDetails} 
                  columns={extraAmenitiesColumns}
                  pagination={false}
                  size="small"
                />
              </div>
            )}
          </div>
        ) : (
          <Empty 
            image={<InboxOutlined style={{ fontSize: 60, color: '#cccccc' }} />}
            description="No additional amenities are available for this exhibition."
          />
        )}
      </Card>
      
      {/* Hidden form field to pass selected amenities */}
      <Form.Item name="amenities" hidden>
        <Input type="hidden" />
      </Form.Item>
      
      {/* Make sure to maintain the selectedStalls field to pass it to the next step */}
      <Form.Item name="selectedStalls" hidden>
        <Input type="hidden" />
      </Form.Item>
    </StepContent>
  );
};

export default AmenitiesStep; 