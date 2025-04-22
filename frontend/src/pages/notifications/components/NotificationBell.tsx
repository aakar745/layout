import React, { useState, useEffect, useRef } from 'react';
import { Badge, Dropdown, Button, List, Typography, Empty, Divider, Space, Tabs, Spin } from 'antd';
import { 
  BellOutlined, 
  CheckOutlined, 
  SettingOutlined, 
  CloseCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Import from notifications module
import { getNotifications } from '../../notifications/mockData';
import { Notification, NotificationStatus } from '../../notifications/types';
import { getUnreadCount } from '../../../utils/notificationUtil';
import NotificationItem from './NotificationItem';

// Import styles
import './NotificationBell.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [hasNewAnimation, setHasNewAnimation] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchNotifications();
    
    // Simulate receiving new notifications periodically (for demo purposes)
    const interval = setInterval(() => {
      // Random chance to trigger new notification (25% chance)
      if (Math.random() < 0.25 && !visible) {
        setHasNewNotifications(true);
        // Trigger the animation
        setHasNewAnimation(true);
        setTimeout(() => {
          setHasNewAnimation(false);
        }, 2000);
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [visible]);
  
  const fetchNotifications = () => {
    setLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const allNotifications = getNotifications();
      setNotifications(allNotifications);
      setLoading(false);
      setHasNewNotifications(allNotifications.some(n => n.status === NotificationStatus.UNREAD));
    }, 600);
  };
  
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
    if (flag) {
      setHasNewNotifications(false);
      if (bellRef.current) {
        bellRef.current.classList.remove('bell-animate');
      }
    }
  };
  
  const handleViewNotification = (notification: Notification) => {
    // Mark as read
    handleMarkAsRead(notification);
    setVisible(false);
    
    // Navigate to related entity or notifications page
    if (notification.entityId && notification.entityType) {
      if (notification.entityType === 'lead') {
        navigate(`/leads/${notification.entityId}`);
      } else if (notification.entityType === 'followup') {
        navigate(`/followups/${notification.entityId}`);
      }
    } else {
      navigate('/notifications');
    }
  };
  
  const handleMarkAsRead = (notification: Notification) => {
    // In a real app, this would be an API call
    const updatedNotifications = notifications.map(n => {
      if (n.id === notification.id) {
        return {
          ...n,
          status: NotificationStatus.READ,
          readAt: new Date().toISOString(),
        };
      }
      return n;
    });
    setNotifications(updatedNotifications);
  };
  
  const handleViewAll = () => {
    setVisible(false);
    navigate('/notifications');
  };
  
  const handleMarkAllAsRead = () => {
    // In a real app, this would be an API call
    const updatedNotifications = notifications.map(n => {
      if (n.status === NotificationStatus.UNREAD) {
        return {
          ...n,
          status: NotificationStatus.READ,
          readAt: new Date().toISOString(),
        };
      }
      return n;
    });
    setNotifications(updatedNotifications);
    setHasNewNotifications(false);
  };
  
  const getFilteredNotifications = () => {
    if (activeTab === 'unread') {
      return notifications.filter(n => n.status === NotificationStatus.UNREAD);
    } else {
      return notifications.slice(0, 5); // Only show 5 most recent notifications
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  
  const dropdownContent = (
    <div className="notification-dropdown">
      <div className="notification-header">
        <Title level={5} style={{ margin: 0 }}>Notifications</Title>
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<ReloadOutlined />}
            onClick={fetchNotifications}
            loading={loading}
            className="header-btn"
            title="Refresh notifications"
          />
          <Button 
            type="text" 
            size="small"
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
            disabled={getUnreadCount(notifications) === 0}
            className="header-btn"
            title="Mark all as read"
          />
          <Button 
            type="text" 
            size="small" 
            icon={<SettingOutlined />}
            onClick={() => navigate('/notifications')}
            className="header-btn"
            title="Settings"
          />
          <Button 
            type="text" 
            size="small" 
            icon={<CloseCircleOutlined />}
            onClick={() => setVisible(false)}
            className="header-btn"
            title="Close"
          />
        </Space>
      </div>
      
      <Tabs 
        activeKey={activeTab}
        onChange={handleTabChange}
        size="small"
        className="notification-tabs"
      >
        <TabPane 
          tab={<span>All</span>} 
          key="all" 
        />
        <TabPane 
          tab={
            <span className="tab-label">
              Unread
              <Badge 
                count={getUnreadCount(notifications)} 
                size="small" 
                offset={[5, -3]}
                style={{ backgroundColor: '#1677ff' }}
              />
            </span>
          } 
          key="unread" 
        />
      </Tabs>
      
      {loading ? (
        <div className="notification-loading">
          <Spin size="large" />
          <Text type="secondary">Loading notifications...</Text>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white' }}>
          <List
            className="notification-list"
            dataSource={getFilteredNotifications()}
            renderItem={(item) => (
              <div 
                onClick={() => handleViewNotification(item)} 
                className="notification-item"
              >
                <NotificationItem
                  notification={item}
                  onView={handleViewNotification}
                  onMarkAsRead={handleMarkAsRead}
                />
              </div>
            )}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No notifications"
                  className="notification-empty"
                />
              ),
            }}
          />
        </div>
      )}
      
      <div className="notification-footer">
        <Button 
          type="primary" 
          onClick={handleViewAll} 
          style={{ width: '100%', borderRadius: '4px' }}
        >
          View All Notifications
        </Button>
      </div>
    </div>
  );
  
  return (
    <div 
      className={`notification-bell-container ${hasNewAnimation ? 'has-new-notification' : ''}`}
      ref={bellRef}
    >
      <Dropdown 
        open={visible}
        onOpenChange={handleVisibleChange}
        trigger={['click']}
        dropdownRender={() => dropdownContent}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        overlayStyle={{ 
          zIndex: 1050,
          boxShadow: '0 6px 16px -8px rgba(0,0,0,0.2), 0 9px 28px rgba(0,0,0,0.1)'
        }}
        destroyPopupOnHide
      >
        <Badge 
          count={getUnreadCount(notifications)} 
          overflowCount={99}
          className={hasNewNotifications ? 'badge-pulse' : ''}
          style={{ 
            backgroundColor: hasNewNotifications ? '#f5222d' : '#1677ff',
            transition: 'background-color 0.3s ease'
          }}
          size="small"
          offset={[-2, 2]}
        >
          <Button 
            type="text" 
            icon={<BellOutlined className="bell-icon" />}
            className="notification-bell-btn"
            aria-label="Notifications"
          />
        </Badge>
      </Dropdown>
    </div>
  );
};

export default NotificationBell; 