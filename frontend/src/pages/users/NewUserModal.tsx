import React, { useState, useEffect } from 'react';
import { 
  Modal, Form, Input, Select, Switch, Button, App, Divider, Typography,
  Card, Space, Row, Col, Alert, Avatar, Tooltip
} from 'antd';
import { 
  UserAddOutlined, UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined,
  TeamOutlined, CheckCircleOutlined, InfoCircleOutlined, CrownOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { CreateUserData } from '../../services/user.service';
import { fetchRoles } from '../../store/slices/roleSlice';
import { fetchAllExhibitionsForAssignment } from '../../store/slices/exhibitionSlice';
import { addUser } from '../../store/slices/userSlice';

const { Option } = Select;
const { Text } = Typography;

interface NewUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ 
  visible, 
  onClose,
  onSuccess
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  // Get roles and loading state from Redux
  const { roles, loading: rolesLoading } = useSelector((state: RootState) => state.role);
  const { exhibitions, loading: exhibitionsLoading } = useSelector((state: RootState) => state.exhibition);
  const { loading: usersLoading } = useSelector((state: RootState) => state.user);

  // Helper function to check if a role is admin
  const isAdminRole = (roleId: string): boolean => {
    const role = roles.find(r => r._id === roleId);
    return role?.name?.toLowerCase().includes('admin') || false;
  };

  // Get role details for styling
  const getRoleDetails = (roleId: string) => {
    const role = roles.find(r => r._id === roleId);
    if (!role) return null;
    
    const isAdmin = role.name.toLowerCase().includes('admin');
    const isManager = role.name.toLowerCase().includes('manager');
    
    return {
      ...role,
      isAdmin,
      isManager,
      icon: isAdmin ? <CrownOutlined /> : isManager ? <TeamOutlined /> : <UserOutlined />,
      color: isAdmin ? '#722ed1' : isManager ? '#1890ff' : '#52c41a'
    };
  };

  // Fetch roles and exhibitions when modal becomes visible
  useEffect(() => {
    if (visible) {
      dispatch(fetchRoles());
      dispatch(fetchAllExhibitionsForAssignment());
    }
  }, [visible, dispatch]);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setSelectedRole('');
    }
  }, [visible, form]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    // Clear exhibition assignments if switching to admin role
    if (isAdminRole(roleId)) {
      form.setFieldsValue({ assignedExhibitions: [] });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Transform form values to match API expectations
      const userData: CreateUserData = {
        username: values.username,
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        isActive: values.isActive,
        // Don't send exhibition assignments for admin users
        assignedExhibitions: isAdminRole(values.role) ? [] : (values.assignedExhibitions || [])
      };
      
      dispatch(addUser(userData))
        .unwrap()
        .then((response) => {
          message.success('User created successfully');
          form.resetFields();
          onSuccess();
          onClose();
        })
        .catch((err: any) => {
          message.error(`Failed to create user: ${err}`);
        });
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <Avatar 
            icon={<UserAddOutlined />} 
            style={{ backgroundColor: '#1890ff', color: 'white' }}
            size="small"
          />
          <span style={{ fontSize: '16px', fontWeight: 600 }}>Create New User</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={700}
      footer={
        <div style={{ 
          textAlign: 'right', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '8px',
          padding: '16px 24px'
        }}>
          <Button key="cancel" onClick={onClose} size="large">
            Cancel
          </Button>
          <Button 
            key="submit" 
            type="primary" 
            loading={usersLoading} 
            onClick={handleSubmit}
            size="large"
            icon={<CheckCircleOutlined />}
          >
            Create User
          </Button>
        </div>
      }
    >
      <div style={{ padding: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          {/* Basic Information Section */}
          <Card 
            title={
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                <span>Basic Information</span>
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: 'Please enter a username' },
                    { min: 3, message: 'Username must be at least 3 characters' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Enter username" 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter the full name' }]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Enter full name" 
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Enter email address" 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter password' },
                    { min: 6, message: 'Password must be at least 6 characters' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Enter password" 
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Role & Permissions Section */}
          <Card 
            title={
              <Space>
                <SafetyCertificateOutlined style={{ color: '#722ed1' }} />
                <span>Role & Permissions</span>
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            <Form.Item
              name="role"
              label="Select Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select 
                placeholder="Choose a role for this user"
                loading={rolesLoading}
                value={selectedRole}
                onChange={handleRoleChange}
              >
                {roles.length > 0 ? (
                  roles.map(role => {
                    const roleDetails = getRoleDetails(role._id);
                    return (
                      <Option key={role._id} value={role._id}>
                        <Space>
                          <span style={{ color: roleDetails?.color }}>
                            {roleDetails?.icon}
                          </span>
                          <span>{role.name}</span>
                        </Space>
                      </Option>
                    );
                  })
                ) : (
                  <>
                    <Option value="admin">
                      <Space>
                        <CrownOutlined style={{ color: '#722ed1' }} />
                        <span>Admin</span>
                      </Space>
                    </Option>
                    <Option value="manager">
                      <Space>
                        <TeamOutlined style={{ color: '#1890ff' }} />
                        <span>Manager</span>
                      </Space>
                    </Option>
                    <Option value="agent">
                      <Space>
                        <UserOutlined style={{ color: '#52c41a' }} />
                        <span>Agent</span>
                      </Space>
                    </Option>
                  </>
                )}
              </Select>
            </Form.Item>
            
            {/* Exhibition Access */}
            {!isAdminRole(selectedRole) && (
              <Form.Item
                name="assignedExhibitions"
                label={
                  <Space>
                    <span>Assigned Exhibitions</span>
                    <Tooltip title="Select exhibitions this user can manage. If none selected, user won't have access to any exhibition data.">
                      <InfoCircleOutlined style={{ color: '#bfbfbf' }} />
                    </Tooltip>
                  </Space>
                }
              >
                <Select 
                  mode="multiple"
                  placeholder="Select exhibitions to assign to this user"
                  loading={exhibitionsLoading}
                  allowClear
                  optionLabelProp="label"
                >
                  {exhibitions.map(exhibition => (
                    <Option 
                      key={exhibition._id} 
                      value={exhibition._id}
                      label={exhibition.name}
                    >
                      <Space direction="vertical" size={0}>
                        <Text strong>{exhibition.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {exhibition.venue}
                        </Text>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            
            {isAdminRole(selectedRole) && (
              <Alert
                type="success"
                icon={<CrownOutlined />}
                message="Administrator Access"
                description={
                  <Space direction="vertical" size={4}>
                    <Text>This user will have access to all exhibitions in the system.</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      No specific exhibition assignment is required for administrators.
                    </Text>
                  </Space>
                }
                showIcon
                style={{ borderRadius: '8px' }}
              />
            )}
          </Card>

          {/* Account Status Section */}
          <Card 
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <span>Account Status</span>
              </Space>
            }
          >
            <Form.Item
              name="isActive"
              label="Account Status"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive"
                size="default"
              />
            </Form.Item>
            
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
              Active users can log in and access the system. Inactive users are blocked from logging in.
            </Text>
          </Card>
        </Form>
      </div>
    </Modal>
  );
};

export default NewUserModal; 