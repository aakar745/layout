import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Button, App, Divider, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { User } from '../../services/user.service';
import { fetchRoles } from '../../store/slices/roleSlice';
import { modifyUser } from '../../store/slices/userSlice';

const { Option } = Select;
const { Text } = Typography;

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
  
  // Get roles from Redux store
  const { roles, loading: rolesLoading } = useSelector((state: RootState) => state.role);
  const { loading: usersLoading } = useSelector((state: RootState) => state.user);

  // Reset form when user changes
  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        username: user.username,
        name: user.name || '',
        email: user.email,
        role: typeof user.role === 'object' ? user.role._id : user.role,
        isActive: user.isActive
      });
    }
  }, [visible, user, form]);

  // Fetch roles when modal becomes visible
  useEffect(() => {
    if (visible) {
      dispatch(fetchRoles());
    }
  }, [visible, dispatch]);

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
        isActive: values.isActive
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

  if (!user) return null;

  return (
    <Modal
      title="Edit User"
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
          Update User
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
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
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter an email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Email address" />
        </Form.Item>
        
        <Divider>
          <Text type="secondary">Change Password (Optional)</Text>
        </Divider>
        
        <Form.Item
          name="password"
          label="New Password"
          extra="Leave blank to keep the current password"
          rules={[
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="New password (optional)" />
        </Form.Item>
        
        <Divider />
        
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select loading={rolesLoading}>
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
        
        <Form.Item
          name="isActive"
          label="Status"
          valuePropName="checked"
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

export default EditUserModal; 