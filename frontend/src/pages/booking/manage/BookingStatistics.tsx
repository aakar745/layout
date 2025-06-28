import React from 'react';
import { Card, Col, Row, Statistic, Tooltip, Spin } from 'antd';
import { 
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ExpandOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { BookingType } from '../../../pages/booking/manage/types';
import { BookingStats } from '../../../store/slices/bookingSlice';

// Inline utility function to calculate stall area
const calculateStallArea = (dimensions: any) => {
  if (!dimensions) return 0;
  
  const shapeType = dimensions.shapeType || 'rectangle';
  
  if (shapeType === 'rectangle') {
    return dimensions.width * dimensions.height;
  }
  
  if (shapeType === 'l-shape' && dimensions.lShape) {
    const { rect1Width, rect1Height, rect2Width, rect2Height } = dimensions.lShape;
    return (rect1Width * rect1Height) + (rect2Width * rect2Height);
  }
  
  // Fallback to rectangle
  return dimensions.width * dimensions.height;
};

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
    
    // Calculate booked SQM from confirmed and approved bookings only
    const bookedSQM = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'approved')
      .reduce((sum, booking) => {
        const stallArea = booking.stallIds?.reduce((stallSum, stall) => {
          if (stall?.dimensions) {
            return stallSum + calculateStallArea(stall.dimensions);
          }
          return stallSum;
        }, 0) || 0;
        return sum + stallArea;
      }, 0);
    
    // For fallback, just use direct counts from visible data
    return {
      total: totalBookings,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalSQM: 0, // Fallback cannot calculate total SQM correctly
      bookedSQM: Math.round(bookedSQM * 100) / 100
    };
  };

  // Use stats from Redux if available, otherwise calculate locally
  // For totalSQM, always prefer backend stats over fallback calculation
  const displayStats = stats ? {
    ...stats,
    // Override status counts with filtered data if using filtered bookings
    total: paginationTotal !== undefined ? paginationTotal : stats.total,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    // Calculate filtered booked SQM
    bookedSQM: Math.round(bookings
      .filter(b => b.status === 'confirmed' || b.status === 'approved')
      .reduce((sum, booking) => {
        const stallArea = booking.stallIds?.reduce((stallSum, stall) => {
          if (stall?.dimensions) {
            return stallSum + calculateStallArea(stall.dimensions);
          }
          return stallSum;
        }, 0) || 0;
        return sum + stallArea;
      }, 0) * 100) / 100
  } : calculateFallbackStats();

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
                  <Tooltip title="Total area from all stalls in bookings">
                    Total SQM <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.totalSQM}
                precision={1}
                suffix="sqm"
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: '#722ed1' }}
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
                  <Tooltip title="Booked area from confirmed and approved bookings">
                    Booked SQM <InfoCircleOutlined style={{ fontSize: '14px', marginLeft: 4 }} />
                  </Tooltip>
                }
                value={displayStats.bookedSQM}
                precision={1}
                suffix="sqm"
                prefix={<ExpandOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BookingStatistics; 