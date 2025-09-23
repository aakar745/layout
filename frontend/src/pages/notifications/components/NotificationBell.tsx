import React, { useState, useEffect, useRef } from 'react';
import { Badge, Dropdown, Button, List, Typography, Empty, Divider, Space, Tabs, Spin } from 'antd';
import { 
  BellOutlined, 
  CheckOutlined, 
  SettingOutlined, 
  CloseCircleOutlined,
  ReloadOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import notification service for real-time updates
import notificationService, { Notification as NotificationData } from '../../../services/notification';
import { NotificationStatus, NotificationType, NotificationPriority, Notification } from '../../notifications/types';
import NotificationItem from './NotificationItem';

// Import styles
import './NotificationBell.css';
import { RootState } from '../../../store/store';

const { Title, Text } = Typography;

// Map service notification types to UI notification types
const mapNotificationType = (type: string): NotificationType => {
  switch (type) {
    case 'NEW_BOOKING':
      return NotificationType.NEW_LEAD;
    case 'BOOKING_CONFIRMED':
    case 'INVOICE_GENERATED':
    case 'PAYMENT_RECEIVED':
      return NotificationType.STATUS_CHANGE;
    case 'EXHIBITOR_MESSAGE':
      return NotificationType.FOLLOWUP_DUE;
    case 'EXHIBITOR_REGISTERED':
      return NotificationType.NEW_LEAD;  // Use NEW_LEAD icon for exhibitor registration
    default:
      return NotificationType.STATUS_CHANGE;
  }
};

// Map service notification priorities to UI priorities
const mapNotificationPriority = (priority: string): NotificationPriority => {
  switch (priority) {
    case 'HIGH':
      return NotificationPriority.HIGH;
    case 'MEDIUM':
      return NotificationPriority.MEDIUM;
    case 'LOW':
      return NotificationPriority.LOW;
    default:
      return NotificationPriority.MEDIUM;
  }
};

interface NotificationBellProps {
  isExhibitor?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ isExhibitor = false }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewAnimation, setHasNewAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const bellRef = useRef<HTMLDivElement>(null);
  
  // Get authentication state
  const { isAuthenticated: adminAuth, user } = useSelector((state: RootState) => state.auth);
  const { isAuthenticated: exhibitorAuth } = useSelector((state: RootState) => state.exhibitorAuth || { isAuthenticated: false });
  const isAuthenticated = isExhibitor ? exhibitorAuth : adminAuth;
  
  // Add socket status management
  const [socketConnected, setSocketConnected] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      // Initialize notification service with the correct token
      const tokenKey = isExhibitor ? 'exhibitor_token' : 'token';
      const token = localStorage.getItem(tokenKey);
      
      if (token) {
        notificationService.init(token, isExhibitor);
        notificationService.subscribeToNotifications();
        
        // Setup event listeners for real-time notifications
        const unreadCountHandler = (count: number) => {
          setUnreadCount(count);
          if (count > 0 && !visible) {
            setHasNewAnimation(true);
            setTimeout(() => {
              setHasNewAnimation(false);
            }, 2000);
          }
        };
        
        const notificationHandler = (notification: NotificationData) => {
          setNotifications(prev => [notification, ...prev]);
        };
        
        const connectedHandler = () => {
          setSocketConnected(true);
          // Refresh notifications when socket connects
          fetchNotifications();
        };
        
        const disconnectedHandler = () => {
          setSocketConnected(false);
        };
        
        notificationService.addEventListener('unreadCount', unreadCountHandler);
        notificationService.addEventListener('notification', notificationHandler);
        notificationService.addEventListener('connected', connectedHandler);
        notificationService.addEventListener('disconnected', disconnectedHandler);
        
        // Fetch initial notifications
        fetchNotifications();
        
        return () => {
          // Clean up listeners
          notificationService.removeEventListener('unreadCount', unreadCountHandler);
          notificationService.removeEventListener('notification', notificationHandler);
          notificationService.removeEventListener('connected', connectedHandler);
          notificationService.removeEventListener('disconnected', disconnectedHandler);
          notificationService.unsubscribeFromNotifications();
        };
      } else {
        console.error(`No ${isExhibitor ? 'exhibitor' : 'admin'} token found in localStorage`);
      }
    }
  }, [isAuthenticated, isExhibitor]);
  
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(1, 10);
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
    if (flag) {
      if (bellRef.current) {
        bellRef.current.classList.remove('bell-animate');
      }
      // Refresh notifications when opening dropdown
      fetchNotifications();
    }
  };
  
  const handleViewNotification = async (notification: NotificationData) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await handleMarkAsRead(notification);
    }
    
    setVisible(false);
    
    // Navigate based on notification type and entity
    if (notification.entityId && notification.entityType) {
      let url = '';
      
      switch (notification.entityType) {
        case 'Booking':
          url = isExhibitor 
            ? `/exhibitor/bookings/${notification.entityId}` 
            : `/bookings`; // Main bookings page for admin users
          break;
        case 'Invoice':
          url = isExhibitor 
            ? `/exhibitor/invoice/${notification.entityId}` 
            : `/invoice/${notification.entityId}`;
          break;
        case 'Exhibition':
          url = `/exhibition/${notification.entityId}`;
          break;
        case 'Exhibitor':
          url = `/exhibitors?id=${notification.entityId}`;
          break;
        default:
          url = '';
      }
      
      if (url) {
        navigate(url);
      } else {
        navigate('/notifications');
      }
    } else {
      navigate('/notifications');
    }
  };
  
  const handleMarkAsRead = async (notification: NotificationData) => {
    try {
      await notificationService.markAsRead(notification._id);
      // Update local notification state
      setNotifications(notifications.map(n => 
        n._id === notification._id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const handleDeleteNotification = async (notification: Notification) => {
    try {
      await notificationService.deleteNotification(notification._id);
      // Update local notification state
      setNotifications(notifications.filter(n => n._id !== notification._id));
      if (!notification.isRead) {
        // Update unread count if the deleted notification was unread
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  const handleViewAll = () => {
    setVisible(false);
    navigate('/notifications');
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Update local notification state
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  const handleDeleteAllNotifications = async () => {
    try {
      await notificationService.deleteAllNotifications();
      // Clear all notifications from local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };
  
  const getFilteredNotifications = () => {
    if (activeTab === 'unread') {
      return notifications.filter(n => !n.isRead);
    } else {
      return notifications.slice(0, 10); // Show first 10 notifications
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  
  // Convert service notification to UI notification format
  const convertToUINotification = (notification: NotificationData): Notification => ({
    _id: notification._id,
    recipient: notification.recipient,
    recipientType: notification.recipientType || 'admin',
    title: notification.title,
    message: notification.message,
    type: mapNotificationType(notification.type),
    priority: mapNotificationPriority(notification.priority),
    isRead: notification.isRead,
    readAt: notification.readAt,
    entityId: notification.entityId,
    entityType: notification.entityType,
    data: notification.data,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt || notification.createdAt,
    // Legacy properties
    id: notification._id,
    userId: notification.recipient,
    source: notification.data?.source,
    status: notification.isRead ? NotificationStatus.READ : NotificationStatus.UNREAD
  });
  
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
            disabled={unreadCount === 0}
            className="header-btn"
            title="Mark all as read"
          />
          <Button 
            type="text" 
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteAllNotifications}
            disabled={notifications.length === 0}
            className="header-btn"
            title="Clear all notifications"
          />
          <Button 
            type="text" 
            size="small" 
            icon={<SettingOutlined />}
            onClick={() => navigate('/notifications')}
            className="header-btn"
            title="Notification Settings"
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
        items={[
          {
            key: 'all',
            label: <span>All</span>
          },
          {
            key: 'unread',
            label: (
            <span className="tab-label">
              Unread
              <Badge 
                count={unreadCount} 
                size="small" 
                offset={[5, -3]}
                style={{ backgroundColor: '#1677ff' }}
              />
            </span>
            )
          }
        ]}
      />
      
      <div className="notification-list">
        <Spin spinning={loading}>
          {getFilteredNotifications().length === 0 ? (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={
                activeTab === 'unread' 
                  ? "No unread notifications" 
                  : "No notifications"
              }
              style={{ padding: '20px 0' }}
            />
          ) : (
          <List
            dataSource={getFilteredNotifications()}
            renderItem={(item) => (
                <NotificationItem
                  notification={convertToUINotification(item)}
                  onView={() => handleViewNotification(item)}
                  onMarkAsRead={() => handleMarkAsRead(item)}
                  onDelete={handleDeleteNotification}
                />
              )}
          />
          )}
        </Spin>
        </div>
      
      <Divider style={{ margin: '0' }} />
      
      <div className="notification-footer">
        <Button type="link" onClick={handleViewAll}>
          View All Notifications
        </Button>
      </div>
    </div>
  );
  
  return (
    <div 
      ref={bellRef}
      className={`bell-container ${hasNewAnimation ? 'bell-animate' : ''}`}
    >
      <Dropdown 
        popupRender={() => dropdownContent}
        trigger={['click']}
        open={visible}
        onOpenChange={handleVisibleChange}
        placement="bottomRight"
        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
        openClassName="notification-dropdown-overlay"
      >
        <div className="bell-trigger">
          <Badge 
            count={unreadCount} 
            className="notification-badge"
            size="default"
            overflowCount={99}
          >
            <BellOutlined className="notification-bell-icon" />
          </Badge>
        </div>
      </Dropdown>
    </div>
  );
};

export default NotificationBell; 