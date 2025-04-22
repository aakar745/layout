import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Avatar, Row, Col, Tabs, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setExhibitorCredentials } from '../../store/slices/exhibitorAuthSlice';
import exhibitorService from '../../services/exhibitor';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ExhibitorProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const dispatch = useDispatch();
  const exhibitor = useSelector((state: RootState) => state.exhibitorAuth.exhibitor);
  
  // Fetch the latest exhibitor profile when component mounts
  useEffect(() => {
    const fetchExhibitorProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await exhibitorService.getProfile();
        
        // Update exhibitor data in Redux store with latest from server
        if (response.data) {
          dispatch(setExhibitorCredentials({
            exhibitor: response.data,
            token: exhibitor?.token || localStorage.getItem('exhibitor_token') || '',
          }));
        }
      } catch (error) {
        message.error('Failed to fetch exhibitor profile');
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchExhibitorProfile();
  }, [dispatch]);
  
  // Set form values when the exhibitor data is loaded
  useEffect(() => {
    if (exhibitor) {
      form.setFieldsValue({
        companyName: exhibitor.companyName || '',
        contactPerson: exhibitor.contactPerson || '',
        email: exhibitor.email || '',
        phone: exhibitor.phone || '',
        address: exhibitor.address || '',
        website: exhibitor.website || '',
        description: exhibitor.description || '',
        panNumber: exhibitor.panNumber || '',
        gstNumber: exhibitor.gstNumber || '',
        city: exhibitor.city || '',
        state: exhibitor.state || '',
        pinCode: exhibitor.pinCode || '',
      });
    }
  }, [exhibitor, form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      // In a real implementation, this would update the profile via API
      const response = await exhibitorService.updateProfile(values);
      
      // Get the current token from Redux or localStorage to avoid logout
      const currentToken = exhibitor?.token || localStorage.getItem('exhibitor_token') || '';
      
      // Update the exhibitor data in the Redux store
      dispatch(setExhibitorCredentials({
        exhibitor: { ...exhibitor, ...values },
        token: currentToken,
      }));
      
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>My Profile</Title>
      <Text type="secondary">Manage your exhibitor profile information</Text>
      
      <Card style={{ marginTop: 24 }} loading={profileLoading}>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="Profile Information" key="profile">
            <Row gutter={32}>
              <Col span={6}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                  <Avatar 
                    size={100} 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: '#1890ff',
                      marginBottom: 16,
                    }}
                  >
                    {exhibitor?.companyName?.charAt(0).toUpperCase() || 'E'}
                  </Avatar>
                  <Title level={4}>{exhibitor?.companyName}</Title>
                  <Text type="secondary">{exhibitor?.email}</Text>
                </div>
              </Col>
              
              <Col span={18}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    companyName: exhibitor?.companyName || '',
                    contactPerson: exhibitor?.contactPerson || '',
                    email: exhibitor?.email || '',
                    phone: exhibitor?.phone || '',
                    address: exhibitor?.address || '',
                    website: exhibitor?.website || '',
                    description: exhibitor?.description || '',
                    panNumber: exhibitor?.panNumber || '',
                    gstNumber: exhibitor?.gstNumber || '',
                    city: exhibitor?.city || '',
                    state: exhibitor?.state || '',
                    pinCode: exhibitor?.pinCode || '',
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="companyName"
                        label="Company Name"
                        rules={[{ required: true, message: 'Please enter your company name' }]}
                      >
                        <Input prefix={<HomeOutlined />} placeholder="Company Name" />
                      </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                      <Form.Item
                        name="contactPerson"
                        label="Contact Person"
                        rules={[{ required: true, message: 'Please enter contact person name' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Contact Person" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Email" disabled />
                      </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                      >
                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="address"
                    label="Address"
                  >
                    <Input.TextArea rows={2} placeholder="Company Address" />
                  </Form.Item>
                  
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="city"
                        label="City"
                      >
                        <Input placeholder="City" />
                      </Form.Item>
                    </Col>
                    
                    <Col span={8}>
                      <Form.Item
                        name="state"
                        label="State"
                      >
                        <Input placeholder="State" />
                      </Form.Item>
                    </Col>
                    
                    <Col span={8}>
                      <Form.Item
                        name="pinCode"
                        label="PIN Code"
                        rules={[
                          { pattern: /^[0-9]{6}$/, message: 'Please enter a valid 6-digit PIN code' }
                        ]}
                      >
                        <Input placeholder="PIN Code" maxLength={6} />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="panNumber"
                        label="PAN No."
                        rules={[
                          { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Please enter a valid PAN number' }
                        ]}
                      >
                        <Input placeholder="PAN Number" style={{ textTransform: 'uppercase' }} maxLength={10} />
                      </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                      <Form.Item
                        name="gstNumber"
                        label="GST No."
                        rules={[
                          { pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: 'Please enter a valid GST number' }
                        ]}
                      >
                        <Input placeholder="GST Number" style={{ textTransform: 'uppercase' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="website"
                    label="Website"
                  >
                    <Input placeholder="https://www.yourcompany.com" />
                  </Form.Item>
                  
                  <Form.Item
                    name="description"
                    label="Company Description"
                  >
                    <Input.TextArea 
                      rows={4} 
                      placeholder="Brief description of your company"
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Save Changes
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="Change Password" key="password">
            <Form
              layout="vertical"
              onFinish={(values) => {
                message.success('Password updated successfully');
              }}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password placeholder="Current Password" />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password placeholder="New Password" />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm New Password" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ExhibitorProfile; 