import React from 'react';
import { Card, Table, Tag, Typography, Space, Select, InputNumber, Divider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Exhibition } from '../../../../services/exhibition';

const { Text } = Typography;

interface AmenitiesSectionProps {
  selectedExhibition: Exhibition | null;
  basicAmenitiesWithQuantities: any[];
  totalStallArea: number;
  selectedExtraAmenities: string[];
  extraAmenityQuantities: Record<string, number>;
  onExtraAmenitiesChange: (selectedIds: string[]) => void;
  onExtraAmenityQuantityChange: (amenityId: string, quantity: number) => void;
  getSelectedExtraAmenities: () => any[];
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  selectedExhibition,
  basicAmenitiesWithQuantities,
  totalStallArea,
  selectedExtraAmenities,
  extraAmenityQuantities,
  onExtraAmenitiesChange,
  onExtraAmenityQuantityChange,
  getSelectedExtraAmenities
}) => {
  return (
    <Card title="Stall Amenities" size="small" style={{ marginBottom: 16 }}>
      {/* Basic Amenities Section */}
      {selectedExhibition?.basicAmenities && selectedExhibition.basicAmenities.length > 0 && (
        <>
          <div style={{ marginBottom: 16 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              <Space>
                <span>Included Basic Amenities</span>
                <Tag color="green">Based on stall area</Tag>
              </Space>
            </Typography.Title>
            <Typography.Text type="secondary">
              The following amenities are included based on your total stall area of {totalStallArea.toFixed(2)} sqm.
            </Typography.Text>
          </div>
          
          <Table 
            dataSource={basicAmenitiesWithQuantities.filter(a => a.calculatedQuantity > 0)} 
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text: string, record: any) => (
                  <Space>
                    <Typography.Text strong>{text}</Typography.Text>
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
                render: (perSqm: number, record: any) => (
                  <div title={record.description}>
                    <Typography.Text type="secondary">
                      <InfoCircleOutlined style={{ marginRight: 5 }} />
                      1 {record.quantity > 1 ? `set of ${record.quantity}` : 'unit'} per {perSqm} sqm
                    </Typography.Text>
                  </div>
                )
              },
              {
                title: 'Status',
                key: 'status',
                width: 100,
                align: 'right' as const,
                render: () => <Typography.Text type="success">Included</Typography.Text>
              }
            ]}
            pagination={false}
            size="small"
            locale={{
              emptyText: <Typography.Text>No basic amenities qualify based on the selected stall area.</Typography.Text>
            }}
          />
          
          <Divider style={{ margin: '16px 0' }} />
        </>
      )}

      {/* Extra Amenities Section */}
      {selectedExhibition?.amenities && selectedExhibition.amenities.length > 0 && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              <Space>
                <span>Additional Amenities</span>
                <Tag color="blue">Optional</Tag>
              </Space>
            </Typography.Title>
            <Typography.Text type="secondary">
              Select any additional amenities for the booking.
            </Typography.Text>
          </div>
          
          <Select
            mode="multiple"
            placeholder="Select amenities"
            style={{ width: '100%', marginBottom: 16 }}
            onChange={onExtraAmenitiesChange}
            value={selectedExtraAmenities}
                         options={selectedExhibition?.amenities?.map((amenity: any) => ({
              label: `${amenity.name} (${amenity.rate ? `₹${amenity.rate.toLocaleString()}` : 'N/A'})`,
              value: amenity._id || amenity.id,
              key: amenity._id || amenity.id
            }))}
          />
          
          {selectedExtraAmenities.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Typography.Text strong>Selected Amenities:</Typography.Text>
              <Table 
                dataSource={getSelectedExtraAmenities()} 
                columns={[
                  {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text: string, record: any) => (
                      <Space align="center">
                        <Typography.Text strong>{text}</Typography.Text>
                        <Tag color="blue">{record.type}</Tag>
                        <Typography.Text type="secondary" style={{ fontSize: '13px' }}>
                          {record.description || ''}
                        </Typography.Text>
                      </Space>
                    )
                  },
                  {
                    title: 'Rate',
                    dataIndex: 'rate',
                    key: 'rate',
                    width: 120,
                    align: 'right' as const,
                    render: (rate: number) => (
                      <Typography.Text strong style={{ color: '#1890ff' }}>
                        ₹{rate.toLocaleString('en-IN')}
                      </Typography.Text>
                    )
                  },
                  {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    width: 120,
                    render: (_: any, record: any) => (
                      <InputNumber
                        min={1}
                        value={extraAmenityQuantities[record.id] || 1}
                        onChange={(value) => onExtraAmenityQuantityChange(record.id, value || 1)}
                        style={{ width: '100%' }}
                      />
                    )
                  },
                  {
                    title: 'Total',
                    key: 'total',
                    width: 120,
                    align: 'right' as const,
                    render: (_: any, record: any) => {
                      const quantity = extraAmenityQuantities[record.id] || 1;
                      const total = record.rate * quantity;
                      return (
                        <Typography.Text strong style={{ color: '#1890ff' }}>
                          ₹{total.toLocaleString('en-IN')}
                        </Typography.Text>
                      );
                    }
                  }
                ]}
                pagination={false}
                size="small"
              />
            </div>
          )}
        </div>
      )}

      {!selectedExhibition?.basicAmenities?.length && !selectedExhibition?.amenities?.length && (
        <Typography.Text type="secondary">
          No amenities have been configured for this exhibition.
        </Typography.Text>
      )}
    </Card>
  );
};

export default AmenitiesSection; 