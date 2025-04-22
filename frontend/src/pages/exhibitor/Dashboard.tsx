import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Typography, Divider, Alert, Button } from 'antd';
import { ShopOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

// Mock data - Replace with actual API calls in production
const mockBookings = [
  {
    id: '1',
    exhibitionName: 'Tech Expo 2023',
    stallNumber: 'A12',
    status: 'approved',
    bookingDate: '2023-03-15',
    exhibitionDate: '2023-05-20',
  },
  {
    id: '2',
    exhibitionName: 'Digital Summit',
    stallNumber: 'B45',
    status: 'pending',
    bookingDate: '2023-04-05',
    exhibitionDate: '2023-06-10',
  },
  {
    id: '3',
    exhibitionName: 'Innovation Fair',
    stallNumber: 'C33',
    status: 'rejected',
    bookingDate: '2023-04-12',
    exhibitionDate: '2023-07-15',
  },
];

const ExhibitorDashboard: React.FC = () => {
  const [recentBookings, setRecentBookings] = useState(mockBookings);
  const [loading, setLoading] = useState(false);
  const exhibitor = useSelector((state: RootState) => state.exhibitorAuth.exhibitor);

  useEffect(() => {
    // In a real implementation, this would fetch data from API
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setRecentBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  // Count bookings by status
  const approvedCount = recentBookings.filter(b => b.status === 'approved').length;
  const pendingCount = recentBookings.filter(b => b.status === 'pending').length;
  const rejectedCount = recentBookings.filter(b => b.status === 'rejected').length;

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'approved':
        return <Tag color="success"><CheckCircleOutlined /> Approved</Tag>;
      case 'pending':
        return <Tag color="warning"><ClockCircleOutlined /> Pending</Tag>;
      case 'rejected':
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  return (
    <div>
      <Title level={2}>Welcome, {exhibitor?.companyName || 'Exhibitor'}</Title>
      <Text type="secondary">Here's an overview of your exhibition activities</Text>
      
      {pendingCount > 0 && (
        <Alert 
          message="Pending Approvals" 
          description={`You have ${pendingCount} booking(s) waiting for approval.`} 
          type="info" 
          showIcon 
          style={{ marginTop: 24, marginBottom: 24 }}
          action={
            <Button size="small" type="primary">
              View Details
            </Button>
          }
        />
      )}
      
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Total Bookings" 
              value={recentBookings.length} 
              prefix={<ShopOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Approved Bookings" 
              value={approvedCount} 
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Pending Approvals" 
              value={pendingCount} 
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      <Card 
        title="Recent Bookings" 
        extra={<Link to="/exhibitor/bookings">View All</Link>}
        style={{ marginTop: 24 }}
        loading={loading}
      >
        <List
          dataSource={recentBookings}
          renderItem={booking => (
            <List.Item
              actions={[
                <Link to={`/exhibitor/bookings/${booking.id}`} key="view">View Details</Link>
              ]}
            >
              <List.Item.Meta
                title={
                  <div>
                    <Text strong>{booking.exhibitionName}</Text>
                    <Text type="secondary" style={{ marginLeft: 12 }}>Stall: {booking.stallNumber}</Text>
                  </div>
                }
                description={
                  <div>
                    <Text>Booked on: {booking.bookingDate}</Text>
                    <Divider type="vertical" />
                    <Text>Exhibition date: {booking.exhibitionDate}</Text>
                  </div>
                }
              />
              {getStatusTag(booking.status)}
            </List.Item>
          )}
        />
      </Card>
      
      <Card
        title="Upcoming Exhibitions"
        style={{ marginTop: 24 }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <FileTextOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <div>
            <Text>Explore available exhibitions and book your stall</Text>
            <div style={{ marginTop: 16 }}>
              <Link to="/exhibitions">
                <Button type="primary">Browse Exhibitions</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExhibitorDashboard; 