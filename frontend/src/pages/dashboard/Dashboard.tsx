import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileOutlined,
} from '@ant-design/icons';
import './Dashboard.css';

const { Title, Text } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, gradient }) => (
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
          {value}
        </Text>
      </div>
      <div className="stat-card-icon" style={{ color: 'white' }}>
        {icon}
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,128',
      icon: <UserOutlined />,
      color: '#7C3AED',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
    },
    {
      title: 'Total Orders',
      value: '93',
      icon: <ShoppingCartOutlined />,
      color: '#2563EB',
      gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    },
    {
      title: 'Revenue',
      value: '15,600.00',
      icon: <DollarOutlined />,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    },
    {
      title: 'Reports',
      value: '24',
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
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Activity" 
            className="info-card"
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="activity-item">
                <UserOutlined style={{ color: '#7C3AED' }} />
                <Text>User <Text strong>'john_doe'</Text> logged in</Text>
              </div>
              <div className="activity-item">
                <ShoppingCartOutlined style={{ color: '#2563EB' }} />
                <Text>New order <Text strong>#12345</Text> received</Text>
              </div>
              <div className="activity-item">
                <FileOutlined style={{ color: '#059669' }} />
                <Text>Product <Text strong>'Widget X'</Text> updated</Text>
              </div>
              <div className="activity-item">
                <UserOutlined style={{ color: '#DC2626' }} />
                <Text>New user registration: <Text strong>'jane_smith'</Text></Text>
              </div>
            </div>
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
                <Text>Server Status: <Text strong type="success">Online</Text></Text>
              </div>
              <div className="status-item">
                <div className="status-indicator connected" />
                <Text>Database Status: <Text strong type="success">Connected</Text></Text>
              </div>
              <div className="status-item">
                <div className="status-indicator backup" />
                <Text>Last Backup: <Text strong>2 hours ago</Text></Text>
              </div>
              <div className="status-item">
                <div className="status-indicator normal" />
                <Text>System Load: <Text strong>Normal</Text></Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 