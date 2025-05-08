import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Spin } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileOutlined,
} from '@ant-design/icons';
import './Dashboard.css';
import dashboardService from '../../services/dashboard';

const { Title, Text } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  loading?: boolean;
}

// Interface for recent activity item
interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  color: string;
  text: React.ReactNode;
  timestamp: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, gradient, loading }) => (
  <Card 
    className="stat-card"
    styles={{ body: { padding: '24px' } }}
    style={{
      background: gradient,
      border: 'none',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    <div className="stat-card-background" />
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        <Text style={{ 
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.85)',
          marginBottom: '8px'
        }}>
          {title}
        </Text>
        <Text style={{ 
          fontSize: '28px',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '0'
        }}>
          {loading ? <Spin size="small" /> : value}
        </Text>
      </div>
      <div className="stat-card-icon" style={{ color: 'white' }}>
        {icon}
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
  const [systemStatus, setSystemStatus] = useState({
    server: 'Online',
    database: 'Connected',
    lastBackup: '2 hours ago',
    systemLoad: 'Normal'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Use the dashboard service to get all stats in one call
        const stats = await dashboardService.getDashboardStats();
        
        setUserCount(stats.userCount);
        setBookingCount(stats.bookingCount);
        setRevenue(stats.totalRevenue);
        setExhibitionCount(stats.exhibitionCount);
        
        // Process recent activities
        const activities: ActivityItem[] = [];
        
        // Add recent bookings
        stats.recentBookings.slice(0, 3).forEach(booking => {
          activities.push({
            id: booking._id,
            icon: <ShoppingCartOutlined />,
            color: '#2563EB',
            text: <Text>New booking <Text strong>#{booking._id.substring(0, 8)}</Text> received</Text>,
            timestamp: new Date(booking.createdAt).toLocaleString()
          });
        });
        
        // Add recent users
        stats.recentUsers.slice(0, 2).forEach(user => {
          activities.push({
            id: user._id,
            icon: <UserOutlined />,
            color: '#7C3AED',
            text: <Text>User <Text strong>'{user.username}'</Text> {user.createdAt ? 'registered' : 'active'}</Text>,
            timestamp: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Recently'
          });
        });
        
        // Sort by timestamp
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
    },
    {
      title: 'Total Orders',
      value: bookingCount,
      icon: <ShoppingCartOutlined />,
      color: '#2563EB',
      gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    },
    {
      title: 'Revenue',
      value: `₹${revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarOutlined />,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    },
    {
      title: 'Exhibitions',
      value: exhibitionCount,
      icon: <FileOutlined />,
      color: '#DC2626',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
    },
  ];

  return (
    <div className="dashboard-container">
      <Title level={4} style={{ marginBottom: '24px' }}>Dashboard</Title>
      
      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard {...stat} loading={loading} />
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Activity" 
            className="info-card"
            styles={{ body: { padding: '20px' } }}
            loading={loading}
          >
            {recentActivity.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivity.map(activity => (
                  <div className="activity-item" key={activity.id}>
                    {React.cloneElement(activity.icon as React.ReactElement, { style: { color: activity.color } })}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {activity.text}
                      <Text type="secondary" style={{ fontSize: '12px' }}>{activity.timestamp}</Text>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">No recent activity found</Text>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="System Status" 
            className="info-card"
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="status-item">
                <div className="status-indicator online" />
                <Text>Server Status: <Text strong type="success">{systemStatus.server}</Text></Text>
              </div>
              <div className="status-item">
                <div className="status-indicator connected" />
                <Text>Database Status: <Text strong type="success">{systemStatus.database}</Text></Text>
              </div>
              <div className="status-item">
                <div className="status-indicator backup" />
                <Text>Last Backup: <Text strong>{systemStatus.lastBackup}</Text></Text>
              </div>
              <div className="status-item">
                <div className="status-indicator normal" />
                <Text>System Load: <Text strong>{systemStatus.systemLoad}</Text></Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 