import React, { useState, useEffect } from 'react';
import { createUser, CreateUserData } from '../../services/user.service';
import { getAllRoles, Role } from '../../services/role.service';
import { Modal, Form, Input, Select, Switch, Button, message } from 'antd';

const { Option } = Select;

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
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch roles when modal becomes visible
  useEffect(() => {
    if (visible) {
      fetchRoles();
    }
  }, [visible]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const rolesData = await getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      message.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      setSubmitting(true);
      
      // Transform form values to match API expectations
      const userData: CreateUserData = {
        username: values.name.replace(/\s+/g, '_').toLowerCase(), // Generate username from name
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        isActive: values.status
      };
      
      await createUser(userData);
      message.success('User created successfully');
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Failed to create user: ${error.message}`);
      } else {
        message.error('Failed to create user');
      }
      console.error('Create user error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Create New User"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={submitting} 
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
        
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select 
            placeholder="Select role"
            loading={loading}
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