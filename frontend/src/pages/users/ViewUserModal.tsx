import React from 'react';
import { Modal, Descriptions, Avatar, Tag, Badge, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined, TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { User, getRoleName } from '../../services/user.service';

const { Text } = Typography;

interface ViewUserModalProps {
  user: User | null;
  visible: boolean;
  onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ user, visible, onClose }) => {
  if (!user) return null;

  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Avatar 
          src={user.avatar} 
          icon={!user.avatar && <UserOutlined />} 
          size={64} 
        />
        <div style={{ marginLeft: 16 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>{user.name}</Typography.Title>
          <Text type="secondary">{user.email}</Text>
        </div>
      </div>

      <Divider />

      <Descriptions bordered column={1}>
        <Descriptions.Item label={<><IdcardOutlined /> Role</>}>
          {(() => {
            const roleName = getRoleName(user.role);
            const color = roleName.toLowerCase() === 'admin' ? '#1677ff' : 
                         roleName.toLowerCase() === 'manager' ? '#52c41a' : '#faad14';
            return (
              <Tag color={color}>
                {roleName.toUpperCase()}
              </Tag>
            );
          })()}
        </Descriptions.Item>
        
        <Descriptions.Item label={<><TeamOutlined /> Department</>}>
          {user.department}
        </Descriptions.Item>
        
        <Descriptions.Item label={<><MailOutlined /> Email</>}>
          {user.email}
        </Descriptions.Item>
        
        <Descriptions.Item label="Status">
          {user.status === 'active' ? (
            <Badge status="success" text={<Text style={{ color: '#52c41a' }}>Active</Text>} />
          ) : (
            <Badge status="default" text={<Text type="secondary">Inactive</Text>} />
          )}
        </Descriptions.Item>
        
        <Descriptions.Item label={<><ClockCircleOutlined /> Last Login</>}>
          {user.lastLogin}
        </Descriptions.Item>
        
        <Descriptions.Item label="Created On">
          {user.createdAt || 'Not available'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewUserModal; 