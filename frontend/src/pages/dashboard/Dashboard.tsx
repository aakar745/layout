import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Spin, 
  Button, 
  Space, 
  Empty,
  Timeline,
  notification
} from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  BankOutlined,
  DatabaseOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import dashboardService from '../../services/dashboard';

const { Title, Text, Paragraph } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  color: string;
  text: React.ReactNode;
  timestamp: string;
  type: 'booking' | 'user' | 'exhibition';
}



const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  gradient, 
  loading, 
  trend,
  subtitle 
}) => (
  <Card 
    className="modern-stat-card"
    styles={{ body: { padding: 0 } }}
    style={{
      background: gradient,
      border: 'none',
      overflow: 'hidden',
      position: 'relative',
      height: '140px'
    }}
    hoverable
  >
    <div className="stat-card-overlay" />
    <div className="stat-card-content">
      <div className="stat-card-main">
        <div className="stat-card-info">
          <Text className="stat-card-title">{title}</Text>
          <div className="stat-card-value">
            {loading ? <Spin size="small" /> : value}
          </div>
          {subtitle && (
            <Text className="stat-card-subtitle">{subtitle}</Text>
          )}
          {trend && (
            <div className="stat-card-trend">
              {trend.isPositive ? (
                <RiseOutlined style={{ color: '#52c41a' }} />
              ) : (
                <FallOutlined style={{ color: '#ff4d4f' }} />
              )}
              <span style={{ 
                color: trend.isPositive ? '#52c41a' : '#ff4d4f',
                fontSize: '12px',
                marginLeft: '4px'
              }}>
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        <div className="stat-card-icon">
          {icon}
        </div>
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [exhibitionCount, setExhibitionCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const stats = await dashboardService.getDashboardStats();
        
        setUserCount(stats.userCount);
        setBookingCount(stats.bookingCount);
        setRevenue(stats.totalRevenue);
        setExhibitionCount(stats.exhibitionCount);
        
        // Process recent activities with more variety
        const activities: ActivityItem[] = [];
        
        // Add recent bookings with more details
        stats.recentBookings.forEach(booking => {
          const statusColor = booking.status === 'confirmed' ? '#52c41a' : 
                            booking.status === 'approved' ? '#1890ff' : 
                            booking.status === 'pending' ? '#faad14' : '#ff4d4f';
          
          activities.push({
            id: `booking-${booking._id}`,
            icon: <ShoppingCartOutlined />,
            color: statusColor,
            text: (
              <div>
                <Text strong>{booking.customerName || 'New Customer'}</Text> {booking.status === 'confirmed' ? 'confirmed' : 'made'} a booking
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {booking.companyName || 'Company'} • Status: {booking.status?.toUpperCase()} 
                  {booking.amount && ` • ₹${booking.amount.toLocaleString()}`}
                </Text>
              </div>
            ),
            timestamp: new Date(booking.createdAt).toLocaleString(),
            type: 'booking'
          });
        });
        
        // Add recent users with role information
        stats.recentUsers.forEach(user => {
          activities.push({
            id: `user-${user._id}`,
            icon: <UserOutlined />,
            color: '#7C3AED',
            text: (
              <div>
                <Text strong>{user.username || user.firstName || 'New User'}</Text> joined the system
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {user.email} {user.role && `• Role: ${user.role}`}
                </Text>
              </div>
            ),
            timestamp: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Recently',
            type: 'user'
          });
        });

        // Add recent exhibitions
        stats.recentExhibitions.forEach(exhibition => {
          activities.push({
            id: `exhibition-${exhibition._id}`,
            icon: <FileOutlined />,
            color: '#059669',
            text: (
              <div>
                <Text strong>Exhibition "{exhibition.name}"</Text> was created
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {exhibition.location || 'Location TBD'} • {exhibition.startDate ? new Date(exhibition.startDate).toLocaleDateString() : 'Date TBD'}
                </Text>
              </div>
            ),
            timestamp: new Date(exhibition.createdAt).toLocaleString(),
            type: 'exhibition'
          });
        });
        
        // Sort by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        notification.error({
          message: 'Error Loading Dashboard',
          description: 'Failed to load dashboard data. Please refresh the page.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



  const stats = [
    {
      title: 'Total Users',
      value: userCount,
      icon: <UserOutlined />,
      color: '#7C3AED',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
      trend: { value: 12, isPositive: true },
      subtitle: '+3 this week'
    },
    {
      title: 'Active Bookings',
      value: bookingCount,
      icon: <ShoppingCartOutlined />,
      color: '#2563EB',
      gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      trend: { value: 8, isPositive: true },
      subtitle: '5 pending approval'
    },
    {
      title: 'Total Revenue',
      value: `₹${revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarOutlined />,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      trend: { value: 15, isPositive: true },
      subtitle: 'This month'
    },
    {
      title: 'Exhibitions',
      value: exhibitionCount,
      icon: <FileOutlined />,
      color: '#DC2626',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      trend: { value: 5, isPositive: false },
      subtitle: '2 upcoming'
    },
  ];

  return (
    <div className="modern-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
              Welcome back! 👋
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '16px' }}>
              Here's what's happening with your exhibition management system today.
            </Paragraph>
          </div>

        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} loading={loading} />
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                Recent Activity
              </Space>
            }
            className="dashboard-card"
            extra={<Button type="link" size="small">View All</Button>}
            loading={loading}
          >
            {recentActivity.length > 0 ? (
              <Timeline
                items={recentActivity.slice(0, 5).map(activity => ({
                  dot: React.cloneElement(activity.icon as React.ReactElement, { 
                    style: { color: activity.color } 
                  }),
                  children: (
                    <div className="activity-item">
                      <div style={{ marginBottom: '4px' }}>
                        {activity.text}
                      </div>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {activity.timestamp}
                      </Text>
                    </div>
                  )
                }))}
              />
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No recent activity"
                style={{ margin: '20px 0' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 