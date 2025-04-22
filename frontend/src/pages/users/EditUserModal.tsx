import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Button, message } from 'antd';
import { User, updateUser, getRoleId } from '../../services/user.service';

const { Option } = Select;

interface EditUserModalProps {
  user: User | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ 
  user, 
  visible, 
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Reset form when user changes
  useEffect(() => {
    if (user && visible) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: getRoleId(user.role),
        status: user.status === 'active'
      });
    }
  }, [user, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!user) return;
      
      setSubmitting(true);
      
      // Transform form values to match API expectations
      const userData = {
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status ? 'active' : 'inactive' as 'active' | 'inactive'
      };
      
      await updateUser(user.id, userData);
      message.success('User updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Failed to update user: ${error.message}`);
      } else {
        message.error('Failed to update user');
      }
      console.error('Update user error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Edit User"
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
          Save Changes
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
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select role">
            <Option value="admin">Admin</Option>
            <Option value="manager">Manager</Option>
            <Option value="agent">Agent</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="status"
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