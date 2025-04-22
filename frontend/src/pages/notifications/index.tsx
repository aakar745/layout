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
  notification,
  Tooltip
} from 'antd';
import { 
  BellOutlined, 
  MailOutlined, 
  SettingOutlined, 
  CheckOutlined, 
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

// Import components and utilities
import NotificationItem from './components/NotificationItem';
import EmailSettings from './components/EmailSettings';
import { getNotifications, getDefaultNotificationPreferences } from './mockData';
import { 
  Notification, 
  NotificationStatus, 
  NotificationType, 
  NotificationSource, 
  EmailNotificationSettings
} from './types';
import { getUnreadCount, getNotificationRoute } from '../../utils/notificationUtil';

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
  const [emailSettings, setEmailSettings] = useState(getDefaultNotificationPreferences().email);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchText, typeFilter, sourceFilter, activeTab]);

  const fetchNotifications = () => {
    setLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setNotifications(getNotifications());
      setLoading(false);
    }, 500);
  };

  const filterNotifications = () => {
    let results = notifications;
    
    // Filter by tab
    if (activeTab === 'unread') {
      results = results.filter(n => n.status === NotificationStatus.UNREAD);
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
    
    // Filter by source
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
    
    notification.success({
      message: 'All notifications marked as read',
      description: 'All notifications have been marked as read successfully.',
    });
  };

  const handleSaveEmailSettings = (settings: EmailNotificationSettings) => {
    setSettingsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setEmailSettings(settings);
      setSettingsLoading(false);
      
      notification.success({
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
                    Notifications
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
                    disabled={getUnreadCount(notifications) === 0}
                  >
                    Mark All as Read
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
              renderItem={item => (
                <NotificationItem
                  notification={item}
                  onView={handleViewNotification}
                  onMarkAsRead={handleMarkAsRead}
                />
              )}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} notifications`,
              }}
              rowKey="id"
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