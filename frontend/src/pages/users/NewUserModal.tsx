import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Button, App, Divider, Typography } from 'antd';
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
        isActive: values.status,
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
      title="Create New User"
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={usersLoading} 
          onClick={handleSubmit}
        >
          Create User
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please enter a username' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the user name' }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Email address" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        
        <Divider />
        
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select 
            placeholder="Select role"
            loading={rolesLoading}
            value={selectedRole}
            onChange={handleRoleChange}
          >
            {roles.length > 0 ? (
              roles.map(role => (
                <Option key={role._id} value={role._id}>
                  {role.name}
                </Option>
              ))
            ) : (
              <>
                <Option value="admin">Admin</Option>
                <Option value="manager">Manager</Option>
                <Option value="agent">Agent</Option>
              </>
            )}
          </Select>
        </Form.Item>
        
        {!isAdminRole(selectedRole) && (
          <Form.Item
            name="assignedExhibitions"
            label="Assigned Exhibitions"
            tooltip="Select exhibitions this user can manage. If none selected, user won't have access to any exhibition data."
          >
            <Select 
              mode="multiple"
              placeholder="Select exhibitions to assign"
              loading={exhibitionsLoading}
              allowClear
            >
              {exhibitions.map(exhibition => (
                <Option key={exhibition._id} value={exhibition._id}>
                  {exhibition.name} ({exhibition.venue})
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        
        {isAdminRole(selectedRole) && (
          <Form.Item
            label="Exhibition Access"
          >
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              borderRadius: '6px',
              color: '#52c41a'
            }}>
              ✅ <strong>Admin users have access to all exhibitions</strong>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                No exhibition assignment needed - admins can manage all exhibitions in the system.
              </Text>
            </div>
          </Form.Item>
        )}
        
        <Form.Item
          name="status"
          label="Status"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch 
            checkedChildren="Active" 
            unCheckedChildren="Inactive" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewUserModal; 