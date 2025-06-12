import React, { useEffect, useState } from 'react';
import { 
  Modal, Form, Input, Select, Switch, Button, App, Divider, Typography,
  Card, Space, Row, Col, Alert, Avatar, Tag, Tooltip
} from 'antd';
import { 
  UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined,
  EditOutlined, KeyOutlined, TeamOutlined, CheckCircleOutlined,
  InfoCircleOutlined, WarningOutlined, CrownOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { User } from '../../services/user.service';
import { fetchRoles } from '../../store/slices/roleSlice';
import { fetchAllExhibitionsForAssignment } from '../../store/slices/exhibitionSlice';
import { modifyUser } from '../../store/slices/userSlice';

const { Option } = Select;
const { Text, Title } = Typography;

interface EditUserModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  user,
  onClose,
  onSuccess,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  // Get roles from Redux store
  const { roles, loading: rolesLoading } = useSelector((state: RootState) => state.role);
  const { exhibitions, loading: exhibitionsLoading } = useSelector((state: RootState) => state.exhibition);
  const { loading: usersLoading } = useSelector((state: RootState) => state.user);

  // Helper function to check if a role is admin
  const isAdminRole = (roleId: string): boolean => {
    const role = roles.find(r => r._id === roleId);
    return role?.name?.toLowerCase().includes('admin') || false;
  };

  // Reset form when user changes
  useEffect(() => {
    if (visible && user) {
      // Extract exhibition IDs from assignedExhibitions (handle both populated objects and IDs)
      const assignedExhibitionIds = user.assignedExhibitions?.map((exhibition: any) => {
        return typeof exhibition === 'string' ? exhibition : exhibition._id;
      }) || [];

      const roleId = typeof user.role === 'object' ? user.role._id : user.role;
      setSelectedRole(roleId);

      form.setFieldsValue({
        username: user.username,
        name: user.name || '',
        email: user.email,
        role: roleId,
        isActive: user.isActive,
        assignedExhibitions: assignedExhibitionIds
      });
    }
  }, [visible, user, form, roles]);

  // Fetch roles and exhibitions when modal becomes visible
  useEffect(() => {
    if (visible) {
      dispatch(fetchRoles());
      dispatch(fetchAllExhibitionsForAssignment());
    }
  }, [visible, dispatch]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    // Clear exhibition assignments if switching to admin role
    if (isAdminRole(roleId)) {
      form.setFieldsValue({ assignedExhibitions: [] });
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      const values = await form.validateFields();
      
      // Prepare update data (omit empty password)
      const updateData: any = {
        username: values.username,
        name: values.name,
        email: values.email,
        role: values.role,
        isActive: values.isActive,
        // Don't send exhibition assignments for admin users
        assignedExhibitions: isAdminRole(values.role) ? [] : (values.assignedExhibitions || [])
      };
      
      // Only include password if it's provided
      if (values.password && values.password.trim() !== '') {
        updateData.password = values.password;
      }
      
      dispatch(modifyUser({ 
        id: user._id, 
        userData: updateData
      }))
        .unwrap()
        .then(() => {
          message.success('User updated successfully');
          onSuccess();
          onClose();
        })
        .catch((err: any) => {
          message.error(`Failed to update user: ${err}`);
        });
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  // Helper function to get role name
  const getRoleName = (role: any): string => {
    return typeof role === 'string' ? role : 
           (role && typeof role === 'object' && role.name) ? role.name : 'Unknown';
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

  const currentRoleDetails = user ? getRoleDetails(typeof user.role === 'object' ? user.role._id : user.role) : null;

  // Watch form values to update header display
  const formValues = Form.useWatch([], form);
  const currentIsActive = formValues?.isActive !== undefined ? formValues.isActive : user?.isActive;

  if (!user) return null;

  return (
    <Modal
      title={
        <Space>
          <Avatar 
            icon={<EditOutlined />} 
            style={{ backgroundColor: '#52c41a', color: 'white' }}
            size="small"
          />
          <span style={{ fontSize: '16px', fontWeight: 600 }}>Edit User</span>
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
            Update User
          </Button>
        </div>
      }
    >
      <div style={{ padding: '24px' }}>
        {/* User Info Header */}
        <Card 
          style={{ 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd'
          }}
        >
          <Row align="middle" gutter={16}>
            <Col>
              <Avatar 
                size={64} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#0ea5e9' }}
              />
            </Col>
            <Col flex="auto">
              <Space direction="vertical" size={4}>
                <Title level={4} style={{ margin: 0, color: '#0c4a6e' }}>
                  {user.name || user.username}
                </Title>
                <Text type="secondary">{user.email}</Text>
                <Space>
                  <Tag 
                    color={currentRoleDetails?.color} 
                    icon={currentRoleDetails?.icon}
                    style={{ borderRadius: '12px' }}
                  >
                    {getRoleName(user.role)}
                  </Tag>
                  <Tag 
                    color={currentIsActive ? 'success' : 'default'}
                    style={{ borderRadius: '12px' }}
                  >
                    {currentIsActive ? 'Active' : 'Inactive'}
                  </Tag>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>

        <Form
          form={form}
          layout="vertical"
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
                    { min: 3, message: 'Username must be at least 3 characters' }
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
          </Card>
          {/* Password Section */}
          <Card 
            title={
              <Space>
                <KeyOutlined style={{ color: '#fa8c16' }} />
                <span>Password Management</span>
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            <Alert
              type="info"
              icon={<InfoCircleOutlined />}
              message="Password Change"
              description="Leave the password field empty to keep the current password unchanged."
              showIcon
              style={{ marginBottom: '16px', borderRadius: '8px' }}
            />
            
            <Form.Item
              name="password"
              label="New Password (Optional)"
              rules={[
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter new password (leave blank to keep current)" 
              />
            </Form.Item>
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
            >
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive"
                size="default"
              />
            </Form.Item>
            
            <Alert
              type="warning"
              icon={<WarningOutlined />}
              message="Important"
              description="Deactivating a user will immediately log them out and prevent them from accessing the system."
              showIcon
              style={{ borderRadius: '8px', marginTop: '8px' }}
            />
          </Card>
        </Form>
      </div>
    </Modal>
  );
};

export default EditUserModal; 