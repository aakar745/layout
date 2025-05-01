import React from 'react';
import { Modal, Descriptions, Avatar, Tag, Divider, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '../../services/user.service';

const { Text } = Typography;

interface ViewUserModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ visible, user, onClose }) => {
  if (!user) return null;
  
  const getRoleName = (role: any): string => {
    return typeof role === 'string' ? role : 
           (role && typeof role === 'object' && role.name) ? role.name : 'Unknown';
  };

  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Avatar 
          size={64} 
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1677ff' }}
        />
        <div style={{ marginLeft: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user.name || user.username}</Text>
          <div>
            <Tag color={user.isActive ? 'success' : 'default'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Tag>
            <Tag color="blue">{getRoleName(user.role)}</Tag>
          </div>
        </div>
      </div>
      
      <Divider />
      
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Role">{getRoleName(user.role)}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={user.isActive ? 'success' : 'default'}>
            {user.isActive ? 'Active' : 'Inactive'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(user.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {new Date(user.updatedAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewUserModal; 