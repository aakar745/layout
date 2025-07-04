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
  Table,
  Modal,
  InputNumber,
  Popconfirm,
  Alert,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ServiceCharges.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Exhibition {
  _id: string;
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
  serviceTypes: ServiceType[];
  razorpayKeyId?: string;
}

interface ServiceType {
  name: string;
  amount: number;
  description: string;
  isActive: boolean;
}

const ServiceChargeSettings: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [serviceTypeModalVisible, setServiceTypeModalVisible] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [serviceTypeForm] = Form.useForm();

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
      const response = await fetch('/api/exhibitions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // The exhibitions endpoint returns array directly, not wrapped in data
        setExhibitions(Array.isArray(data) ? data : data.data || []);
      } else {
        message.error('Failed to fetch exhibitions');
      }
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      message.error('Error fetching exhibitions');
    } finally {
      setLoading(false);
    }
  };

  const loadExhibitionConfig = (exhibition: Exhibition) => {
    const config = exhibition.serviceChargeConfig || {
      isEnabled: false,
      title: 'Service Charges',
      description: 'Pay service charges for stall positioning and setup',
      serviceTypes: [],
      razorpayKeyId: ''
    };

    form.setFieldsValue({
      isEnabled: config.isEnabled,
      title: config.title,
      description: config.description,
      razorpayKeyId: config.razorpayKeyId || ''
    });
  };

  const handleExhibitionChange = (exhibitionId: string) => {
    const exhibition = exhibitions.find(ex => ex._id === exhibitionId);
    if (exhibition) {
      setSelectedExhibition(exhibition);
      loadExhibitionConfig(exhibition);
      // Update URL params
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
        ...values,
        serviceTypes: selectedExhibition.serviceChargeConfig?.serviceTypes || []
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
        
        // Update local state
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

  const handleAddServiceType = () => {
    setEditingServiceType(null);
    serviceTypeForm.resetFields();
    setServiceTypeModalVisible(true);
  };

  const handleEditServiceType = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    serviceTypeForm.setFieldsValue(serviceType);
    setServiceTypeModalVisible(true);
  };

  const handleSaveServiceType = async (values: ServiceType) => {
    if (!selectedExhibition) return;

    const currentServiceTypes = selectedExhibition.serviceChargeConfig?.serviceTypes || [];
    let newServiceTypes: ServiceType[];

    if (editingServiceType) {
      // Edit existing service type
      newServiceTypes = currentServiceTypes.map(st => 
        st.name === editingServiceType.name ? values : st
      );
    } else {
      // Add new service type
      if (currentServiceTypes.some(st => st.name === values.name)) {
        message.error('Service type with this name already exists');
        return;
      }
      newServiceTypes = [...currentServiceTypes, values];
    }

    try {
      const configData = {
        ...form.getFieldsValue(),
        serviceTypes: newServiceTypes
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
        message.success(`Service type ${editingServiceType ? 'updated' : 'added'} successfully`);
        
        // Update local state
        setExhibitions(prev => prev.map(ex => 
          ex._id === selectedExhibition._id 
            ? { ...ex, serviceChargeConfig: configData }
            : ex
        ));
        
        setSelectedExhibition(prev => prev ? {
          ...prev,
          serviceChargeConfig: configData
        } : null);
        
        setServiceTypeModalVisible(false);
      } else {
        message.error('Failed to save service type');
      }
    } catch (error) {
      console.error('Error saving service type:', error);
      message.error('Error saving service type');
    }
  };

  const handleDeleteServiceType = async (serviceTypeName: string) => {
    if (!selectedExhibition) return;

    const currentServiceTypes = selectedExhibition.serviceChargeConfig?.serviceTypes || [];
    const newServiceTypes = currentServiceTypes.filter(st => st.name !== serviceTypeName);

    try {
      const configData = {
        ...form.getFieldsValue(),
        serviceTypes: newServiceTypes
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
        message.success('Service type deleted successfully');
        
        // Update local state
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
        message.error('Failed to delete service type');
      }
    } catch (error) {
      console.error('Error deleting service type:', error);
      message.error('Error deleting service type');
    }
  };

  const serviceTypeColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text>₹{amount.toLocaleString('en-IN')}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (record: ServiceType) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditServiceType(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this service type?"
            onConfirm={() => handleDeleteServiceType(record.name)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

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
                  <div style={{ 
                    padding: '8px 4px',
                    lineHeight: '1.4'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 600,
                      color: '#1d1d1d',
                      marginBottom: '2px'
                    }}>
                      {exhibition.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      color: '#8c8c8c',
                      maxWidth: '280px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {exhibition.venue && exhibition.venue.length > 25 
                        ? `${exhibition.venue.substring(0, 25)}...` 
                        : exhibition.venue || 'No venue specified'}
                    </div>
                  </div>
                </Option>
              ))}
            </Select>

            {selectedExhibition && (
              <div style={{ 
                marginTop: 16, 
                padding: 16, 
                background: '#f9f9f9', 
                borderRadius: 8,
                border: '1px solid #e8e8e8'
              }}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong style={{ fontSize: '16px', color: '#1d1d1d' }}>
                    {selectedExhibition.name}
                  </Text>
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    <strong>Venue:</strong> {selectedExhibition.venue}
                  </Text>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1px solid #e8e8e8'
                }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Status:</Text>
                    <br />
                    <Tag color={selectedExhibition.serviceChargeConfig?.isEnabled ? 'green' : 'red'}>
                      {selectedExhibition.serviceChargeConfig?.isEnabled ? 'Enabled' : 'Disabled'}
                    </Tag>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Service Types:</Text>
                    <br />
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                      {selectedExhibition.serviceChargeConfig?.serviceTypes?.length || 0}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col span={16}>
          {selectedExhibition ? (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Basic Configuration */}
              <Card 
                title="Basic Configuration"
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
                    <Col span={12}>
                      <Form.Item
                        name="razorpayKeyId"
                        label="Razorpay Key ID (Optional)"
                        tooltip="Leave empty to use default Razorpay credentials"
                      >
                        <Input placeholder="rzp_live_..." />
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
                          placeholder="Brief description of the service charges"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

                <Alert
                  message="Configuration Note"
                  description="When service charges are enabled, a public form will be available for vendors to make payments without logging in. The form link will be available in the public exhibition view."
                  type="info"
                  icon={<InfoCircleOutlined />}
                  style={{ marginTop: 16 }}
                />
              </Card>

              {/* Service Types Configuration */}
              <Card
                title="Service Types"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddServiceType}
                    disabled={!selectedExhibition.serviceChargeConfig?.isEnabled}
                  >
                    Add Service Type
                  </Button>
                }
              >
                <Table
                  columns={serviceTypeColumns}
                  dataSource={selectedExhibition.serviceChargeConfig?.serviceTypes || []}
                  rowKey="name"
                  size="small"
                  locale={{
                    emptyText: selectedExhibition.serviceChargeConfig?.isEnabled 
                      ? 'No service types configured. Click "Add Service Type" to get started.'
                      : 'Enable service charges to configure service types.'
                  }}
                />
              </Card>

              {/* Public Form Preview */}
              {selectedExhibition.serviceChargeConfig?.isEnabled && (
                <Card title="Public Form Access">
                  <Paragraph>
                    <Text strong>Public Form URL:</Text>
                  </Paragraph>
                  <Paragraph copyable>
                    {`${window.location.origin}/exhibitions/${selectedExhibition._id}/service-charge`}
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
                  payment settings, and service types for vendors.
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
                    payments directly without logging in to the system.
                  </Text>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Service Type Modal */}
      <Modal
        title={`${editingServiceType ? 'Edit' : 'Add'} Service Type`}
        open={serviceTypeModalVisible}
        onCancel={() => setServiceTypeModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={serviceTypeForm}
          layout="vertical"
          onFinish={handleSaveServiceType}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Service Name"
                rules={[
                  { required: true, message: 'Please enter service name' },
                  { max: 50, message: 'Name cannot exceed 50 characters' }
                ]}
              >
                <Input 
                  placeholder="e.g., Stall Positioning"
                  disabled={!!editingServiceType}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Amount (₹)"
                rules={[
                  { required: true, message: 'Please enter amount' },
                  { type: 'number', min: 1, message: 'Amount must be greater than 0' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0"
                  min={1}
                  max={100000}
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => Number(value?.replace(/₹\s?|(,*)/g, '') || 0) as any}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: 'Please enter description' },
                  { max: 200, message: 'Description cannot exceed 200 characters' }
                ]}
              >
                <TextArea
                  rows={3}
                  placeholder="Brief description of this service"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="isActive"
                label="Status"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch 
                  checkedChildren="Active" 
                  unCheckedChildren="Inactive"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingServiceType ? 'Update' : 'Add'} Service Type
              </Button>
              <Button onClick={() => setServiceTypeModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceChargeSettings; 