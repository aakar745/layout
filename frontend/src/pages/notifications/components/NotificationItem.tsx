import React from 'react';
import { List, Typography, Space, Tag, Avatar, Badge, Tooltip, Button } from 'antd';
import { 
  UserAddOutlined, 
  ClockCircleOutlined, 
  SwapOutlined, 
  UserOutlined,
  BellOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { Notification, NotificationType } from '../types';
import { formatRelativeTime, formatDate, getPriorityColor } from '../../../utils/notificationUtil';

const { Text, Paragraph } = Typography;

interface NotificationItemProps {
  notification: Notification;
  onView: (notification: Notification) => void;
  onMarkAsRead: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onView,
  onMarkAsRead,
  onDelete,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.NEW_LEAD:
        return <UserAddOutlined style={{ color: '#1677ff' }} />;
      case NotificationType.FOLLOWUP_DUE:
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case NotificationType.STATUS_CHANGE:
        return <SwapOutlined style={{ color: '#722ed1' }} />;
      case NotificationType.ASSIGNMENT:
        return <UserOutlined style={{ color: '#52c41a' }} />;
      default:
        return <BellOutlined style={{ color: '#1677ff' }} />;
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification);
    }
    onView(notification);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification);
  };

  return (
    <List.Item
      onClick={handleClick}
      className={!notification.isRead ? 'notification-unread' : ''}
      style={{
        cursor: 'pointer',
        backgroundColor: !notification.isRead ? '#f0f5ff' : 'transparent',
        padding: '16px',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
      }}
      actions={[
        <Tooltip title="Delete notification">
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={handleDelete}
            aria-label="Delete notification"
          />
        </Tooltip>
      ]}
    >
      <List.Item.Meta
        avatar={
          <Badge dot={!notification.isRead} color={getPriorityColor(notification.priority)}>
            <Avatar 
              icon={getIcon()} 
              size="large"
              style={{ 
                backgroundColor: 'white', 
                border: `1px solid ${getPriorityColor(notification.priority)}`
              }} 
            />
          </Badge>
        }
        title={
          <Space>
            <Text strong>{notification.title}</Text>
            {!notification.isRead && (
              <Tag color="blue">New</Tag>
            )}
          </Space>
        }
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 4 }}>
              {notification.message}
            </Paragraph>
            <Tooltip title={formatDate(notification.createdAt)}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatRelativeTime(notification.createdAt)}
              </Text>
            </Tooltip>
          </div>
        }
      />
    </List.Item>
  );
};

export default NotificationItem; 