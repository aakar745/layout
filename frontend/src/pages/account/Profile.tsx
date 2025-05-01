import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Avatar, Row, Col, Tabs, message, App, Alert } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setCredentials } from '../../store/slices/authSlice';
import authService from '../../services/auth';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile: React.FC = () => {
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Fetch the latest profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await authService.getProfile();
        
        // Update user data in Redux store with latest from server
        if (response.data) {
          dispatch(setCredentials({
            user: response.data,
            token: localStorage.getItem('token') || '',
          }));
        }
      } catch (error) {
        message.error('Failed to fetch profile');
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [dispatch]);
  
  // Handle password change
  const handlePasswordChange = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      setPasswordError(null);
      setPasswordLoading(true);
      
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      
      notification.success({
        message: 'Success',
        description: 'Password has been changed successfully',
      });
      
      passwordForm.resetFields();
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.message || 
        'Failed to change password. Please try again.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const getRoleName = () => {
    if (!user?.role) return 'User';
    
    if (typeof user.role === 'string') {
      return user.role;
    }
    
    if (typeof user.role === 'object' && 'name' in user.role) {
      return user.role.name;
    }
    
    return 'User';
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Title level={4}>My Account</Title>
            <Text type="secondary">Manage your account settings and change your password</Text>
          </Col>
        </Row>
      </div>
      
      <Card loading={profileLoading}>
        <Tabs defaultActiveKey="account">
          <TabPane tab="Account Information" key="account">
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
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Title level={4}>{user?.username}</Title>
                  <Text type="secondary">{getRoleName()}</Text>
                </div>
              </Col>
              
              <Col span={18}>
                <Form
                  layout="vertical"
                  initialValues={{
                    username: user?.username,
                    email: user?.email,
                  }}
                  disabled={true} // Disabled for now since we're not implementing profile updates
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please enter your username' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                      </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="Change Password" key="password">
            {passwordError && (
              <Alert 
                message="Error" 
                description={passwordError} 
                type="error" 
                showIcon 
                style={{ marginBottom: 24 }} 
              />
            )}
            
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Current Password" 
                />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password' },
                  { min: 8, message: 'Password must be at least 8 characters' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="New Password" 
                />
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
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Confirm New Password" 
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={passwordLoading}
                  icon={<SaveOutlined />}
                >
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

export default Profile; 