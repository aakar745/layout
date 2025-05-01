import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Button, App, Divider, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { CreateUserData } from '../../services/user.service';
import { fetchRoles } from '../../store/slices/roleSlice';
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
  
  // Get roles and loading state from Redux
  const { roles, loading: rolesLoading } = useSelector((state: RootState) => state.role);
  const { loading: usersLoading } = useSelector((state: RootState) => state.user);

  // Fetch roles when modal becomes visible
  useEffect(() => {
    if (visible) {
      dispatch(fetchRoles());
    }
  }, [visible, dispatch]);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

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
        isActive: values.status
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