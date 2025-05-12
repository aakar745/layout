import React from 'react';
import { Form, Input, Typography, FormInstance, Card, Row, Col, Button, Select, InputNumber, Tabs, Space, Tooltip } from 'antd';
import { MinusCircleOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface AmenitiesSettingsProps {
  form: FormInstance;
}

const AmenitiesSettings: React.FC<AmenitiesSettingsProps> = ({ form }) => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Tabs defaultActiveKey="basic" type="card">
        <TabPane tab="Basic Amenities" key="basic">
          <Card className="settings-card">
            <Title level={4}>Basic Amenities</Title>
            <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
              Configure basic amenities that are included with all stall bookings based on stall size
            </Text>

            <Form.List name="basicAmenities">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} style={{ marginBottom: '16px' }}>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'type']}
                          rules={[{ required: true, message: 'Please select amenity type' }]}
                        >
                          <Select placeholder="Select type">
                            <Select.Option value="facility">Facility</Select.Option>
                            <Select.Option value="service">Service</Select.Option>
                            <Select.Option value="equipment">Equipment</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[
                            { required: true, message: 'Please enter amenity name' },
                            { max: 100, message: 'Name cannot be longer than 100 characters' }
                          ]}
                        >
                          <Input placeholder="Enter name (e.g. Tables)" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          rules={[
                            { required: true, message: 'Please enter amenity description' },
                            { max: 200, message: 'Description cannot be longer than 200 characters' }
                          ]}
                        >
                          <Input.TextArea 
                            placeholder="Describe the amenity"
                            rows={2}
                            showCount
                            maxLength={200}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          {...restField}
                          name={[name, 'perSqm']}
                          label={
                            <Space>
                              Per sqm
                              <Tooltip title="How many square meters per 1 unit (e.g., 1 table per 9 sqm)">
                                <InfoCircleOutlined />
                              </Tooltip>
                            </Space>
                          }
                          rules={[
                            { required: true, message: 'Required' },
                            { type: 'number', min: 1, message: 'Must be ≥ 1' }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="9"
                            min={1}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          label={
                            <Space>
                              Quantity
                              <Tooltip title="Default quantity to provide (e.g., 1 table for every 9 sqm)">
                                <InfoCircleOutlined />
                              </Tooltip>
                            </Space>
                          }
                          rules={[
                            { required: true, message: 'Required' },
                            { type: 'number', min: 1, message: 'Must be ≥ 1' }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="1"
                            min={1}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={1} style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add({ 
                        type: 'equipment',
                        perSqm: 9,
                        quantity: 1
                      })}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Basic Amenity
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </TabPane>
        
        <TabPane tab="Extra Amenities" key="extra">
          <Card className="settings-card">
            <Title level={4}>Extra Amenities</Title>
            <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
              Configure additional amenities and facilities available at your exhibition for an extra charge
            </Text>

            <Form.List name="amenities">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} style={{ marginBottom: '16px' }}>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'type']}
                          rules={[{ required: true, message: 'Please select amenity type' }]}
                        >
                          <Select placeholder="Select type">
                            <Select.Option value="facility">Facility</Select.Option>
                            <Select.Option value="service">Service</Select.Option>
                            <Select.Option value="equipment">Equipment</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[
                            { required: true, message: 'Please enter amenity name' },
                            { max: 100, message: 'Name cannot be longer than 100 characters' }
                          ]}
                        >
                          <Input placeholder="Enter name (e.g. Power)" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          rules={[
                            { required: true, message: 'Please enter amenity description' },
                            { max: 200, message: 'Description cannot be longer than 200 characters' }
                          ]}
                        >
                          <Input.TextArea 
                            placeholder="Describe the amenity"
                            rows={2}
                            showCount
                            maxLength={200}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'rate']}
                          rules={[
                            { required: true, message: 'Please enter rate' },
                            { type: 'number', min: 0, message: 'Rate must be greater than or equal to 0' }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Enter rate"
                            prefix="₹"
                            min={0}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string | undefined) => {
                              const parsed = value ? Number(value.replace(/\₹\s?|(,*)/g, '')) : 0;
                              return isNaN(parsed) ? 0 : parsed;
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add({ type: 'service' })}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Extra Amenity
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </TabPane>
      </Tabs>

      <Card className="settings-card" style={{ marginTop: '24px' }}>
        <Title level={4}>Special Requirements</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Specify any special requirements or accessibility features
        </Text>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="specialRequirements"
              rules={[
                { max: 1000, message: 'Requirements cannot be longer than 1000 characters' }
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter any special requirements or accessibility features"
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AmenitiesSettings; 