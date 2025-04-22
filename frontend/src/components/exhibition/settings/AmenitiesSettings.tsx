import React from 'react';
import { Form, Input, Typography, FormInstance, Card, Row, Col, Button, Select, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface AmenitiesSettingsProps {
  form: FormInstance;
}

const AmenitiesSettings: React.FC<AmenitiesSettingsProps> = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Card className="settings-card">
        <Title level={4}>Exhibition Amenities</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Add amenities and facilities available at your exhibition with their rates
        </Text>

        <Form.List name="amenities">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} style={{ marginBottom: '16px' }}>
                  <Col span={6}>
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
                  <Col span={7}>
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
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Amenity
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

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