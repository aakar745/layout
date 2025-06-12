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

  // Helper function to check if user is admin
  const isAdminUser = (user: User): boolean => {
    const roleName = getRoleName(user.role);
    return roleName.toLowerCase().includes('admin');
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
        <Descriptions.Item label="Assigned Exhibitions">
          {isAdminUser(user) ? (
            <div style={{ 
              padding: '6px 10px', 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              borderRadius: '4px',
              color: '#52c41a',
              fontSize: '14px'
            }}>
              ✅ <strong>Admin - Access to all exhibitions</strong>
            </div>
          ) : user.assignedExhibitions && user.assignedExhibitions.length > 0 ? (
            <Space wrap>
              {user.assignedExhibitions.map((exhibition: any, index: number) => {
                // Handle both populated exhibition objects and plain IDs
                const exhibitionName = typeof exhibition === 'string' 
                  ? `Exhibition ${exhibition.slice(-4)}...`
                  : exhibition?.name 
                    ? `${exhibition.name}`
                    : `Exhibition ${(exhibition?._id || exhibition).toString().slice(-4)}...`;
                
                return (
                  <Tag key={index} color="blue">
                    {exhibitionName}
                  </Tag>
                );
              })}
            </Space>
          ) : (
            <Text type="secondary">No exhibitions assigned</Text>
          )}
        </Descriptions.Item>
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