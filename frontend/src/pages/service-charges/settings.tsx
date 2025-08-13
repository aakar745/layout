import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  message,
  InputNumber,
  Alert
} from 'antd';
import {
  SaveOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPublicExhibitionUrl } from '../../utils/url';
import './ServiceCharges.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Exhibition {
  _id: string;
  slug?: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  serviceChargeConfig?: ServiceChargeConfig;
}

interface ServiceChargeConfig {
  isEnabled: boolean;
  title: string;
  description: string;
  pricingRules: {
    smallStallThreshold: number;
    smallStallPrice: number;
    largeStallPrice: number;
  };
}

const ServiceChargeSettings: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchExhibitions();
  }, []);

  useEffect(() => {
    const exhibitionId = searchParams.get('exhibition');
    if (exhibitionId && exhibitions.length > 0) {
      const exhibition = exhibitions.find(ex => ex._id === exhibitionId);
      if (exhibition) {
        setSelectedExhibition(exhibition);
        loadExhibitionConfig(exhibition);
      }
    }
  }, [searchParams, exhibitions]);

  const fetchExhibitions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/exhibitions/active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setExhibitions(Array.isArray(data) ? data : data.data || []);
      } else {
        message.error('Failed to fetch active exhibitions');
      }
    } catch (error) {
      console.error('Error fetching active exhibitions:', error);
      message.error('Error fetching active exhibitions');
    } finally {
      setLoading(false);
    }
  };

  const loadExhibitionConfig = (exhibition: Exhibition) => {
    const config = exhibition.serviceChargeConfig || {
      isEnabled: false,
      title: 'Service Charges',
      description: 'Pay service charges for stall positioning and setup',
      pricingRules: {
        smallStallThreshold: 50,
        smallStallPrice: 2000,
        largeStallPrice: 2500
      }
    };

    form.setFieldsValue({
      isEnabled: config.isEnabled,
      title: config.title,
      description: config.description,
      smallStallThreshold: config.pricingRules?.smallStallThreshold || 50,
      smallStallPrice: config.pricingRules?.smallStallPrice || 2000,
      largeStallPrice: config.pricingRules?.largeStallPrice || 2500
    });
  };

  const handleExhibitionChange = (exhibitionId: string) => {
    const exhibition = exhibitions.find(ex => ex._id === exhibitionId);
    if (exhibition) {
      setSelectedExhibition(exhibition);
      loadExhibitionConfig(exhibition);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('exhibition', exhibitionId);
      navigate(`?${newSearchParams.toString()}`, { replace: true });
    }
  };

  const handleSaveConfig = async (values: any) => {
    if (!selectedExhibition) {
      message.error('Please select an exhibition');
      return;
    }

    setSaveLoading(true);
    try {
      const configData = {
        isEnabled: values.isEnabled,
        title: values.title,
        description: values.description,
        pricingRules: {
          smallStallThreshold: values.smallStallThreshold,
          smallStallPrice: values.smallStallPrice,
          largeStallPrice: values.largeStallPrice
        }
      };

      const response = await fetch(`/api/service-charges/config/${selectedExhibition._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(configData)
      });

      if (response.ok) {
        message.success('Configuration saved successfully');
        
        setExhibitions(prev => prev.map(ex => 
          ex._id === selectedExhibition._id 
            ? { ...ex, serviceChargeConfig: configData }
            : ex
        ));
        
        setSelectedExhibition(prev => prev ? {
          ...prev,
          serviceChargeConfig: configData
        } : null);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      message.error('Error saving configuration');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="service-charges-page">
      <div className="page-header">
        <Title level={2}>
          <SettingOutlined /> Service Charge Settings
        </Title>
        <Button onClick={() => navigate('/service-charges')}>
          Back to Service Charges
        </Button>
      </div>

      <Row gutter={24}>
        <Col span={8}>
          <Card 
            title="Select Exhibition" 
            loading={loading}
            style={{ height: 'fit-content' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Choose an exhibition to configure service charges
              </Text>
            </div>
            
            <Select
              placeholder="Choose an exhibition..."
              style={{ width: '100%', marginBottom: 16 }}
              value={selectedExhibition?._id}
              onChange={handleExhibitionChange}
              showSearch
              optionFilterProp="children"
              dropdownStyle={{ 
                maxHeight: 400, 
                overflow: 'auto',
                padding: '4px'
              }}
              size="large"
              filterOption={(input, option) => {
                const exhibition = exhibitions.find(ex => ex._id === option?.value);
                if (!exhibition) return false;
                const searchText = `${exhibition.name} ${exhibition.venue}`.toLowerCase();
                return searchText.includes(input.toLowerCase());
              }}
            >
              {exhibitions.map(exhibition => (
                <Option key={exhibition._id} value={exhibition._id}>
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                      {exhibition.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <span>📍 {exhibition.venue}</span>
                      {exhibition.serviceChargeConfig?.isEnabled && (
                        <span style={{ color: '#52c41a' }}>✓ Enabled</span>
                      )}
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Card>
        </Col>

        <Col span={16}>
          {selectedExhibition ? (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card 
                title="Service Charge Configuration"
                extra={
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={saveLoading}
                    onClick={() => form.submit()}
                  >
                    Save Configuration
                  </Button>
                }
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSaveConfig}
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="isEnabled"
                        label="Enable Service Charges"
                        valuePropName="checked"
                      >
                        <Switch 
                          checkedChildren="Enabled" 
                          unCheckedChildren="Disabled"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter a title' }]}
                      >
                        <Input placeholder="e.g., Service Charges" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                      >
                        <TextArea
                          rows={3}
                          placeholder="Brief description of service charges"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider>Pricing Rules</Divider>

                  <Alert
                    message="Stall-Based Pricing"
                    description="Service charges are calculated based on stall area. Configure the threshold and prices below."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="smallStallThreshold"
                        label="Small Stall Threshold (sqm)"
                        rules={[{ required: true, message: 'Please enter threshold' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="50"
                          min={1}
                          max={1000}
                          addonAfter="sqm"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="smallStallPrice"
                        label="Small Stall Price (₹)"
                        rules={[{ required: true, message: 'Please enter price' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="2000"
                          min={1}
                          max={100000}
                          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => Number(value?.replace(/₹\s?|(,*)/g, '') || 0) as any}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="largeStallPrice"
                        label="Large Stall Price (₹)"
                        rules={[{ required: true, message: 'Please enter price' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="2500"
                          min={1}
                          max={100000}
                          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => Number(value?.replace(/₹\s?|(,*)/g, '') || 0) as any}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Alert
                    message="Pricing Logic"
                    description={
                      <div>
                        <p>• Stalls with area ≤ {form.getFieldValue('smallStallThreshold') || 50} sqm will be charged ₹{form.getFieldValue('smallStallPrice') || 2000}</p>
                        <p style={{ margin: 0 }}>• Stalls with area &gt; {form.getFieldValue('smallStallThreshold') || 50} sqm will be charged ₹{form.getFieldValue('largeStallPrice') || 2500}</p>
                      </div>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                </Form>
              </Card>

              {selectedExhibition.serviceChargeConfig?.isEnabled && (
                <Card title="Stall Management">
                  <Paragraph>
                    <Text strong>Manage Stalls:</Text>
                  </Paragraph>
                  <Paragraph>
                    Use the <Button type="link" onClick={() => navigate('/service-charge-stalls')} style={{ padding: 0 }}>Stall Management</Button> page to add, edit, and import stall data. 
                    This data is used for auto-filling exhibitor company names in the public service charge form.
                  </Paragraph>
                </Card>
              )}

              {selectedExhibition.serviceChargeConfig?.isEnabled && (
                <Card title="Public Form Access">
                  <Paragraph>
                    <Text strong>Public Form URL:</Text>
                  </Paragraph>
                  <Paragraph copyable>
                    {`${window.location.origin}${getPublicExhibitionUrl(selectedExhibition, 'service-charge')}`}
                  </Paragraph>
                  <Paragraph type="secondary">
                    This URL can be shared with vendors to access the service charge payment form directly.
                    No login is required for vendors to use this form.
                  </Paragraph>
                </Card>
              )}
            </Space>
          ) : (
            <Card style={{ minHeight: 400 }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
                <SettingOutlined style={{ 
                  fontSize: 64, 
                  color: '#d9d9d9',
                  marginBottom: 24 
                }} />
                <Title level={3} type="secondary" style={{ marginBottom: 16 }}>
                  Select an Exhibition
                </Title>
                <Paragraph type="secondary" style={{ 
                  fontSize: '16px',
                  maxWidth: 400,
                  lineHeight: 1.6
                }}>
                  Choose an exhibition from the dropdown to configure service charges, 
                  pricing rules, and payment settings for vendors.
                </Paragraph>
                <div style={{ 
                  marginTop: 24,
                  padding: 16,
                  background: '#f8f9fa',
                  borderRadius: 8,
                  border: '1px solid #e9ecef'
                }}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    💡 <strong>Tip:</strong> Enable service charges to allow vendors to make 
                    payments based on stall area without logging in to the system.
                  </Text>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ServiceChargeSettings; 