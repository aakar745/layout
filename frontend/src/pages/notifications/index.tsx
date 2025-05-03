import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Tabs, 
  Typography, 
  Button, 
  List, 
  Empty,
  Space, 
  Badge, 
  Divider, 
  Input, 
  notification as antNotification,
  Tooltip
} from 'antd';
import { 
  BellOutlined, 
  MailOutlined, 
  SettingOutlined, 
  CheckOutlined, 
  FilterOutlined,
  ReloadOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

// Import components and utilities
import NotificationItem from './components/NotificationItem';
import EmailSettings from './components/EmailSettings';
import notificationService, { Notification as NotificationData } from '../../services/notification';
import { 
  Notification, 
  NotificationStatus, 
  NotificationType, 
  NotificationSource, 
  EmailNotificationSettings
} from './types';
import { getUnreadCount, getNotificationRoute } from '../../utils/notificationUtil';

// Map notification types from API to UI types
const mapNotificationType = (type: string): NotificationType => {
  switch (type) {
    case 'NEW_BOOKING':
      return NotificationType.NEW_BOOKING;
    case 'BOOKING_CONFIRMED':
      return NotificationType.BOOKING_CONFIRMED;
    case 'BOOKING_CANCELLED':
      return NotificationType.BOOKING_CANCELLED;
    case 'PAYMENT_RECEIVED':
      return NotificationType.PAYMENT_RECEIVED;
    case 'INVOICE_GENERATED':
      return NotificationType.INVOICE_GENERATED;
    case 'EXHIBITION_UPDATE':
      return NotificationType.EXHIBITION_UPDATE;
    case 'SYSTEM_MESSAGE':
      return NotificationType.SYSTEM_MESSAGE;
    case 'EXHIBITOR_MESSAGE':
      return NotificationType.EXHIBITOR_MESSAGE;
    case 'EXHIBITOR_REGISTERED':
      return NotificationType.EXHIBITOR_REGISTERED;
    default:
      return NotificationType.SYSTEM_MESSAGE;
  }
};

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'ALL'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<NotificationSource | 'ALL'>('ALL');
  const [emailSettings, setEmailSettings] = useState<EmailNotificationSettings>({
    newLeads: true,
    followUpReminders: true,
    statusChanges: false,
    leadAssignments: true,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Initialize notification socket if not already connected
    const tokenKey = 'token'; // For admin notifications
    const token = localStorage.getItem(tokenKey);
    if (token) {
      notificationService.init(token, false);
    }
    
    // Fetch notifications
    fetchNotifications();
    
    // Subscribe to real-time notifications
    notificationService.subscribeToNotifications();
    
    // Set up event listeners for new notifications
    const notificationHandler = (newNotification: NotificationData) => {
      // Process the notification to ensure types are consistent
      const processedNotification = {
        ...newNotification,
        type: mapNotificationType(newNotification.type)
      };
      // Add the new notification to the list
      setNotifications(prevNotifications => {
        // Check if notification already exists to avoid duplicates
        if (prevNotifications.some(n => n._id === newNotification._id)) {
          return prevNotifications;
        }
        return [processedNotification, ...prevNotifications];
      });
    };
    
    const notificationUpdateHandler = (data: {unreadCount: number, newNotifications?: NotificationData[]}) => {
      // If we have new notifications, add them
      if (data.newNotifications && data.newNotifications.length > 0) {
        const processedNotifications = data.newNotifications.map((notification: NotificationData) => ({
          ...notification,
          type: mapNotificationType(notification.type)
        }));
        
        setNotifications(prevNotifications => {
          // Filter out duplicates before merging
          const newItems = processedNotifications.filter(
            newN => !prevNotifications.some(n => n._id === newN._id)
          );
          
          return [...newItems, ...prevNotifications];
        });
      }
    };
    
    // Register event listeners
    notificationService.addEventListener('notification', notificationHandler);
    notificationService.addEventListener('notification_update', notificationUpdateHandler);
    
    // Cleanup on unmount
    return () => {
      notificationService.removeEventListener('notification', notificationHandler);
      notificationService.removeEventListener('notification_update', notificationUpdateHandler);
    };
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchText, typeFilter, sourceFilter, activeTab]);

  // Add navigation detection to refresh data when page becomes active
  useEffect(() => {
    // Refresh when component mounts or route changes
    fetchNotifications();
    
    // Listen for focus events to refresh data when tab becomes active
    const handleFocus = () => {
      // Only fetch if there are no notifications already
      if (notifications.length === 0) {
        fetchNotifications();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [notifications.length]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Use the EXACT same approach as the NotificationBell component
      const response = await notificationService.getNotifications(1, 50);
      if (response.success) {
        // Map API notification types to UI types
        const processedNotifications = response.data.notifications.map(notification => {
          return {
            ...notification,
            type: mapNotificationType(notification.type)
          };
        });
        setNotifications(processedNotifications);
      } else {
        // Don't clear notifications on API error - keep existing ones
        // setNotifications([]);
      }
    } catch (error) {
      antNotification.error({
        message: 'Failed to fetch notifications',
        description: 'There was an error loading your notifications. Please try again later.',
      });
      // Don't clear notifications on API error - keep existing ones
      // setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let results = notifications;
    
    // Filter by tab
    if (activeTab === 'unread') {
      results = results.filter(n => n.isRead === false);
    }
    
    // Filter by search text
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      results = results.filter(
        n => 
          n.title.toLowerCase().includes(lowerSearchText) || 
          n.message.toLowerCase().includes(lowerSearchText)
      );
    }
    
    // Filter by type
    if (typeFilter !== 'ALL') {
      results = results.filter(n => n.type === typeFilter);
    }
    
    // Filter by source (if exists in the notification)
    if (sourceFilter !== 'ALL') {
      results = results.filter(n => n.source === sourceFilter);
    }
    
    setFilteredNotifications(results);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const resetFilters = () => {
    setSearchText('');
    setTypeFilter('ALL');
    setSourceFilter('ALL');
    setActiveTab('all');
  };

  const handleViewNotification = (notification: Notification) => {
    const route = getNotificationRoute(notification);
    navigate(route);
  };

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      // Use the notification service to mark as read
      await notificationService.markAsRead(notification._id);
      
      // Update local state
      const updatedNotifications = notifications.map(n => {
        if (n._id === notification._id) {
          return {
            ...n,
            isRead: true,
            readAt: new Date().toISOString(),
          };
        }
        return n;
      });
      setNotifications(updatedNotifications);
    } catch (error) {
      antNotification.error({
        message: 'Failed to mark notification as read',
        description: 'There was an error updating the notification status. Please try again later.',
      });
    }
  };

  const handleDeleteNotification = async (notification: Notification) => {
    try {
      // Use the notification service to delete
      await notificationService.deleteNotification(notification._id);
      
      // Update local state
      const updatedNotifications = notifications.filter(n => n._id !== notification._id);
      setNotifications(updatedNotifications);
      
      antNotification.success({
        message: 'Notification deleted',
        description: 'The notification has been deleted successfully.',
      });
    } catch (error) {
      antNotification.error({
        message: 'Failed to delete notification',
        description: 'There was an error deleting the notification. Please try again later.',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Use the notification service to mark all as read
      await notificationService.markAllAsRead();
      
      // Update local state
      const updatedNotifications = notifications.map(n => ({
        ...n,
        isRead: true,
        readAt: new Date().toISOString(),
      }));
      setNotifications(updatedNotifications);
      
      antNotification.success({
        message: 'All notifications marked as read',
        description: 'All notifications have been marked as read successfully.',
      });
    } catch (error) {
      antNotification.error({
        message: 'Failed to mark all notifications as read',
        description: 'There was an error updating the notification status. Please try again later.',
      });
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      // Use the notification service to delete all notifications
      await notificationService.deleteAllNotifications();
      
      // Clear local state
      setNotifications([]);
      
      antNotification.success({
        message: 'All notifications cleared',
        description: 'All notifications have been deleted successfully.',
      });
    } catch (error) {
      antNotification.error({
        message: 'Failed to clear notifications',
        description: 'There was an error deleting the notifications. Please try again later.',
      });
    }
  };

  const handleSaveEmailSettings = (settings: EmailNotificationSettings) => {
    setSettingsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setEmailSettings(settings);
      setSettingsLoading(false);
      
      antNotification.success({
        message: 'Settings saved',
        description: 'Your email notification settings have been updated successfully.',
      });
    }, 1000);
  };

  return (
    <div className="notifications-page">
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={4}>
                  <Space>
                    <BellOutlined />
                    Notifications {notifications.length > 0 ? `(${notifications.length})` : ''}
                  </Space>
                </Title>
                <Paragraph>
                  Stay updated with all your lead activities and follow-ups
                </Paragraph>
              </Col>
              <Col>
                <Space>
                  <Tooltip title="Refresh notifications">
                    <Button 
                      icon={<ReloadOutlined />} 
                      onClick={fetchNotifications}
                      loading={loading}
                    >
                      Refresh
                    </Button>
                  </Tooltip>
                  <Button 
                    type="primary" 
                    icon={<CheckOutlined />} 
                    onClick={handleMarkAllAsRead}
                    disabled={notifications.filter(n => !n.isRead).length === 0}
                  >
                    Mark All as Read
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteAllNotifications}
                    disabled={notifications.length === 0}
                  >
                    Clear All
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            className="notifications-list-card"
            style={{
              marginBottom: 24,
            }}
          >
            <Tabs 
              activeKey={activeTab} 
              onChange={handleTabChange}
              tabBarExtraContent={
                <Space>
                  <Badge count={getUnreadCount(notifications)} offset={[-5, 0]}>
                    <span style={{ padding: '0 8px' }}>Unread</span>
                  </Badge>
                </Space>
              }
            >
              <TabPane tab="All Notifications" key="all" />
              <TabPane tab="Unread" key="unread" />
            </Tabs>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Search
                placeholder="Search notifications..."
                onSearch={handleSearch}
                style={{ width: 300 }}
                allowClear
              />
              <Space>
                <Button 
                  icon={<FilterOutlined />} 
                  onClick={resetFilters}
                  disabled={searchText === '' && typeFilter === 'ALL' && sourceFilter === 'ALL'}
                >
                  Reset Filters
                </Button>
              </Space>
            </div>

            <List
              dataSource={filteredNotifications}
              renderItem={(notification) => (
                <NotificationItem
                  notification={notification}
                  onView={handleViewNotification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              )}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} notifications`,
              }}
              rowKey="_id"
              loading={loading}
              locale={{
                emptyText: (
                  <Empty
                    description={
                      <span>
                        No notifications found
                      </span>
                    }
                  />
                ),
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <EmailSettings 
            settings={emailSettings} 
            onSave={handleSaveEmailSettings} 
            loading={settingsLoading} 
          />
          
          <Card
            title={
              <Space>
                <SettingOutlined />
                <span>Notification Tips</span>
              </Space>
            }
          >
            <Paragraph>
              <ul>
                <li>Notifications help you stay informed about important lead activities</li>
                <li>Use email notifications for critical updates when you're away</li>
                <li>Click on a notification to see more details or take action</li>
                <li>Mark notifications as read to keep your inbox organized</li>
              </ul>
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationsPage; 