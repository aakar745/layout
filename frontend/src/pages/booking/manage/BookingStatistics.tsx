import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { 
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { BookingType } from '../../../pages/booking/manage/types';

interface BookingStatisticsProps {
  bookings: BookingType[];
}

const BookingStatistics: React.FC<BookingStatisticsProps> = ({ bookings }) => {
  /**
   * Calculates booking statistics
   * - Total bookings
   * - Bookings by status
   * - Total revenue
   * @returns Statistics for dashboard display
   */
  const calculateStatistics = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookings
        .filter(b => b.status === 'confirmed' || b.status === 'approved')
        .reduce((sum, b) => sum + b.amount, 0),
      totalActiveBookings: bookings
        .filter(b => b.status === 'confirmed' || b.status === 'approved')
        .length,
      totalDeclinedBookings: bookings
        .filter(b => b.status === 'cancelled' || b.status === 'rejected')
        .length
    };
    return stats;
  };

  const stats = calculateStatistics();

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={stats.total}
              prefix={<FilterOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Bookings"
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Approved Bookings"
              value={stats.approved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Confirmed Bookings"
              value={stats.confirmed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Rejected Bookings"
              value={stats.rejected}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Cancelled Bookings"
              value={stats.cancelled}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}></Col>
      </Row>
    </>
  );
};

export default BookingStatistics; 