import React from 'react';
import { Card, Col, Row, Statistic, Tooltip, Spin } from 'antd';
import { 
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { BookingType } from '../../../pages/booking/manage/types';
import { BookingStats } from '../../../store/slices/bookingSlice';

interface BookingStatisticsProps {
  bookings: BookingType[];
  paginationTotal?: number;
  stats?: BookingStats;
  statsLoading?: boolean;
}

const BookingStatistics: React.FC<BookingStatisticsProps> = ({ 
  bookings, 
  paginationTotal,
  stats,
  statsLoading = false
}) => {
  /**
   * Calculates booking statistics when Redux stats are not available
   * @returns Statistics for dashboard display
   */
  const calculateFallbackStats = () => {
    // Use the pagination total for the total count if available
    const totalBookings = paginationTotal !== undefined ? paginationTotal : bookings.length;
    
    // For fallback, just use direct counts from visible data
    return {
      total: totalBookings,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookings
        .filter(b => b.status === 'confirmed' || b.status === 'approved')
        .reduce((sum, b) => sum + b.amount, 0),
      totalBaseAmount: bookings.reduce((sum, b) => sum + (b.calculations?.totalBaseAmount || 0), 0)
    };
  };

  // Use stats from Redux if available, otherwise calculate locally
  const displayStats = stats || calculateFallbackStats();

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin />
              </div>
            ) : (
              <Statistic
                title={
                  <Tooltip title="Total count across all pages">
                    Total Bookings <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.total}
                prefix={<FilterOutlined />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin />
              </div>
            ) : (
              <Statistic
                title={
                  <Tooltip title="Count of all pending bookings">
                    Pending Bookings <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.pending}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin />
              </div>
            ) : (
              <Statistic
                title={
                  <Tooltip title="Count of all approved bookings">
                    Approved Bookings <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.approved}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin />
              </div>
            ) : (
              <Statistic
                title={
                  <Tooltip title="Count of all confirmed bookings">
                    Confirmed Bookings <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.confirmed}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin />
              </div>
            ) : (
              <Statistic
                title={
                  <Tooltip title="Count of all rejected bookings">
                    Rejected Bookings <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.rejected}
                prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin />
              </div>
            ) : (
              <Statistic
                title={
                  <Tooltip title="Count of all cancelled bookings">
                    Cancelled Bookings <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.cancelled}
                prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin />
              </div>
            ) : (
              <Statistic
                title={
                  <Tooltip title="Total revenue from all bookings">
                    Total Revenue <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.totalRevenue}
                precision={0}
                prefix="₹"
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin />
              </div>
            ) : (
              <Statistic
                title={
                  <Tooltip title="Total base amount before taxes and discounts">
                    Total Base Amount <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.totalBaseAmount}
                precision={0}
                prefix="₹"
                valueStyle={{ color: '#1890ff' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BookingStatistics; 