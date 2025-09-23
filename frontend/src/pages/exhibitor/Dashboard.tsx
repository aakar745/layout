import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Typography, Divider, Alert, Button, Skeleton, Empty, Space } from 'antd';
import { ShopOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, FilePdfOutlined, CloseCircleOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../services/api';
import { Booking } from '../../types/booking';

// Extended booking status type to include all possible statuses from the API
type BookingStatus = 'pending' | 'approved' | 'confirmed' | 'cancelled' | 'rejected';

// Extended booking type with the more comprehensive status options
interface ExtendedBooking extends Omit<Booking, 'status'> {
  status: BookingStatus;
}

const { Title, Text, Paragraph } = Typography;

const ExhibitorDashboard: React.FC = () => {
  const [recentBookings, setRecentBookings] = useState<ExtendedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const exhibitor = useSelector((state: RootState) => state.exhibitorAuth.exhibitor);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/exhibitor-bookings/my-bookings');
      // Cast the response data to our extended booking type
      setRecentBookings(response.data as ExtendedBooking[] || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Unable to load your bookings at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  // Count bookings by status
  const approvedCount = recentBookings.filter(b => b.status === 'approved').length;
  const pendingCount = recentBookings.filter(b => b.status === 'pending').length;
  const rejectedCount = recentBookings.filter(b => b.status === 'rejected').length;
  const confirmedCount = recentBookings.filter(b => b.status === 'confirmed').length;

  const getStatusTag = (status: BookingStatus) => {
    switch (status) {
      case 'approved':
        return <Tag color="success"><CheckCircleOutlined /> Approved</Tag>;
      case 'pending':
        return <Tag color="warning"><ClockCircleOutlined /> Pending</Tag>;
      case 'rejected':
        return <Tag color="error"><CloseCircleOutlined /> Rejected</Tag>;
      case 'confirmed':
        return <Tag color="blue"><CheckCircleOutlined /> Confirmed</Tag>;
      case 'cancelled':
        return <Tag color="default"><CloseCircleOutlined /> Cancelled</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const handleViewInvoice = (bookingId: string) => {
    navigate(`/exhibitor/invoice/${bookingId}`);
  };

  // Safe way to check if a status matches
  const hasStatus = (booking: ExtendedBooking, status: BookingStatus) => {
    return booking.status === status;
  };

  return (
    <div>
      <Title level={2}>Welcome, {exhibitor?.companyName || 'Exhibitor'}</Title>
      <Text type="secondary">Here's an overview of your exhibition activities</Text>
      
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: 24, marginBottom: 24 }}
        />
      )}
      
      {pendingCount > 0 && (
        <Alert 
          message="Pending Approvals" 
          description={`You have ${pendingCount} booking(s) waiting for approval.`} 
          type="info" 
          showIcon 
          style={{ marginTop: 24, marginBottom: 24 }}
          action={
            <Button 
              size="small" 
              type="primary"
              onClick={() => navigate('/exhibitor/bookings')}
            >
              View Bookings
            </Button>
          }
        />
      )}
      
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Bookings" 
              value={loading ? '-' : recentBookings.length} 
              prefix={<ShopOutlined />} 
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Confirmed" 
              value={loading ? '-' : confirmedCount} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<CheckCircleOutlined />} 
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Approved" 
              value={loading ? '-' : approvedCount} 
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
              loading={loading} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Pending" 
              value={loading ? '-' : pendingCount} 
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />} 
              loading={loading}
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
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : recentBookings.length > 0 ? (
          <List
            dataSource={recentBookings.slice(0, 5)} // Show only 5 most recent bookings
            renderItem={booking => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    key="view"
                    onClick={() => navigate(`/exhibitor/bookings/${booking._id}`)}
                  >
                    View Details
                  </Button>,
                  (hasStatus(booking, 'approved') || hasStatus(booking, 'confirmed')) ? (
                    <Button 
                      type="link" 
                      key="invoice"
                      icon={<FilePdfOutlined />}
                      onClick={() => handleViewInvoice(booking._id)}
                    >
                      Invoice
                    </Button>
                  ) : null
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  title={
                    <div>
                      <Text strong>{booking.exhibitionId?.name || 'Exhibition'}</Text>
                      <Text type="secondary" style={{ marginLeft: 12 }}>
                        Stall: {booking.stallIds?.map(stall => stall.number).join(', ') || 'N/A'}
                      </Text>
                    </div>
                  }
                  description={
                    <Space direction="vertical" size={1}>
                      <div>
                        <Text>Booked on: {dayjs(booking.createdAt).format('MMM D, YYYY')}</Text>
                        <Divider type="vertical" />
                        <Text>Amount: ₹{booking.amount?.toLocaleString() || 'N/A'}</Text>
                      </div>
                      <div>
                        <Text>Exhibition date: {dayjs(booking.exhibitionId?.startDate).format('MMM D')} - {dayjs(booking.exhibitionId?.endDate).format('MMM D, YYYY')}</Text>
                      </div>
                    </Space>
                  }
                />
                {getStatusTag(booking.status)}
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="No bookings found" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        )}
      </Card>
      

      
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Quick Actions">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Button 
                  type="primary" 
                  icon={<ShopOutlined />} 
                  block
                  onClick={() => navigate('/exhibitions')}
                >
                  Book New Stall
                </Button>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Button 
                  icon={<FileTextOutlined />} 
                  block
                  onClick={() => navigate('/exhibitor/bookings')}
                >
                  View All Bookings
                </Button>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Button 
                  icon={<DollarOutlined />} 
                  block
                  onClick={() => navigate('/exhibitor/bookings?status=approved')}
                >
                  Pending Payments
                </Button>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Button 
                  icon={<UserOutlined />} 
                  block
                  onClick={() => navigate('/exhibitor/profile')}
                >
                  Update Profile
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExhibitorDashboard; 