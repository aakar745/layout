import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Switch, Button, App, Divider, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { User } from '../../services/user.service';
import { fetchRoles } from '../../store/slices/roleSlice';
import { fetchAllExhibitionsForAssignment } from '../../store/slices/exhibitionSlice';
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
          <Select loading={rolesLoading} value={selectedRole} onChange={handleRoleChange}>
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