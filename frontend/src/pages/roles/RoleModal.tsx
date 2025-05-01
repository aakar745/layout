import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Checkbox, Button, Row, Col, Card, Divider, Typography, Space } from 'antd';
import { Role, CreateRoleData } from '../../services/role.service';

const { Text } = Typography;
const CheckboxGroup = Checkbox.Group;

interface RoleModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (roleData: CreateRoleData) => void;
  role?: Role | null;
  loading: boolean;
}

// These would ideally come from an API or a constants file
const AVAILABLE_PERMISSIONS = [
  { key: 'dashboard_view', label: 'View Dashboard', group: 'Dashboard' },
  { key: 'dashboard_manage', label: 'Manage Dashboard', group: 'Dashboard' },
  
  { key: 'users_view', label: 'View Users', group: 'Users' },
  { key: 'users_create', label: 'Create Users', group: 'Users' },
  { key: 'users_edit', label: 'Edit Users', group: 'Users' },
  { key: 'users_delete', label: 'Delete Users', group: 'Users' },
  
  { key: 'roles_view', label: 'View Roles', group: 'Roles' },
  { key: 'roles_create', label: 'Create Roles', group: 'Roles' },
  { key: 'roles_edit', label: 'Edit Roles', group: 'Roles' },
  { key: 'roles_delete', label: 'Delete Roles', group: 'Roles' },
  
  { key: 'exhibitions_view', label: 'View Exhibitions', group: 'Exhibitions' },
  { key: 'exhibitions_create', label: 'Create Exhibitions', group: 'Exhibitions' },
  { key: 'exhibitions_edit', label: 'Edit Exhibitions', group: 'Exhibitions' },
  { key: 'exhibitions_delete', label: 'Delete Exhibitions', group: 'Exhibitions' },
  
  { key: 'bookings_view', label: 'View Bookings', group: 'Bookings' },
  { key: 'bookings_create', label: 'Create Bookings', group: 'Bookings' },
  { key: 'bookings_edit', label: 'Edit Bookings', group: 'Bookings' },
  { key: 'bookings_delete', label: 'Delete Bookings', group: 'Bookings' },
  
  { key: 'exhibitors_view', label: 'View Exhibitors', group: 'Exhibitors' },
  { key: 'exhibitors_create', label: 'Create Exhibitors', group: 'Exhibitors' },
  { key: 'exhibitors_edit', label: 'Edit Exhibitors', group: 'Exhibitors' },
  { key: 'exhibitors_delete', label: 'Delete Exhibitors', group: 'Exhibitors' },
  
  { key: 'settings_view', label: 'View Settings', group: 'Settings' },
  { key: 'settings_edit', label: 'Edit Settings', group: 'Settings' },
];

// Group permissions by their category
const groupedPermissions = AVAILABLE_PERMISSIONS.reduce<Record<string, Array<{key: string, label: string}>>>(
  (groups, permission) => {
    if (!groups[permission.group]) {
      groups[permission.group] = [];
    }
    groups[permission.group].push({ key: permission.key, label: permission.label });
    return groups;
  },
  {}
);

const RoleModal: React.FC<RoleModalProps> = ({ visible, onCancel, onSave, role, loading }) => {
  const [form] = Form.useForm();
  const isEditing = !!role;
  
  useEffect(() => {
    if (visible) {
      if (role) {
        form.setFieldsValue({
          name: role.name,
          description: role.description,
          permissions: role.permissions,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, role, form]);
  
  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSave(values);
    });
  };
  
  // Function to check if all permissions in a group are selected
  const areAllGroupPermissionsSelected = (group: string) => {
    const allPermissionKeys = form.getFieldValue('permissions') || [];
    const groupPermissionKeys = groupedPermissions[group].map(p => p.key);
    return groupPermissionKeys.every(key => allPermissionKeys.includes(key));
  };
  
  // Function to toggle all permissions in a group
  const toggleGroupPermissions = (group: string, checked: boolean) => {
    const currentPermissions = form.getFieldValue('permissions') || [];
    const groupPermissionKeys = groupedPermissions[group].map(p => p.key);
    
    let newPermissions;
    if (checked) {
      // Add all group permissions
      newPermissions = [...new Set([...currentPermissions, ...groupPermissionKeys])];
    } else {
      // Remove all group permissions
      newPermissions = currentPermissions.filter((key: string) => !groupPermissionKeys.includes(key));
    }
    
    form.setFieldsValue({ permissions: newPermissions });
  };
  
  return (
    <Modal
      title={isEditing ? 'Edit Role' : 'Add New Role'}
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={handleSubmit}
        >
          {isEditing ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ 
          name: '',
          description: '',
          permissions: [] 
        }}
      >
        <Form.Item
          name="name"
          label="Role Name"
          rules={[{ required: true, message: 'Please enter a role name' }]}
        >
          <Input placeholder="e.g., Administrator, Editor, Viewer" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please provide a description' }]}
        >
          <Input.TextArea 
            placeholder="Describe the purpose of this role" 
            rows={3}
          />
        </Form.Item>
        
        <Divider plain>Permissions</Divider>
        
        <Form.Item name="permissions">
          <Checkbox.Group style={{ width: '100%' }}>
            <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '0 8px' }}>
              {Object.entries(groupedPermissions).map(([group, permissions]) => (
                <Card
                  key={group}
                  size="small"
                  title={
                    <Space>
                      <Text strong>{group}</Text>
                      <Checkbox
                        checked={areAllGroupPermissionsSelected(group)}
                        onChange={(e) => toggleGroupPermissions(group, e.target.checked)}
                      >
                        Select All
                      </Checkbox>
                    </Space>
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Row gutter={[16, 12]}>
                    {permissions.map(permission => (
                      <Col span={12} key={permission.key}>
                        <Checkbox value={permission.key}>
                          <Text>{permission.label}</Text>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Card>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleModal; 