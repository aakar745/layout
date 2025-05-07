import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Spin, 
  DatePicker, 
  Select, 
  Divider, 
  Table,
  Tabs,
  Tag,
  Space,
  Empty
} from 'antd';
import { 
  DollarOutlined, 
  ShopOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Line, Pie, Bar } from '@ant-design/charts';
import dayjs from 'dayjs';
import api from '../../services/api';
import { formatCurrency } from '../../utils/format';
import './styles.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// Custom helper to format date for display
const formatDate = (date: string | Date) => {
  return dayjs(date).format('MMM D, YYYY');
};

const AnalyticsPage: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'real' | 'sample'>('real');
  const [hasData, setHasData] = useState(true);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [selectedExhibition, setSelectedExhibition] = useState<string>('all');
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [bookingStats, setBookingStats] = useState<any>({
    totalBookings: 0,
    approvedBookings: 0,
    pendingBookings: 0,
    rejectedBookings: 0,
    totalRevenue: 0,
    totalStallsBooked: 0,
    averageBookingValue: 0
  });
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);
  const [revenueByExhibition, setRevenueByExhibition] = useState<any[]>([]);
  const [bookingsByStatus, setBookingsByStatus] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setHasData(true); // Reset hasData flag

      try {
        // Fetch exhibitions for filter
        const exhibitionsResponse = await api.get('/exhibitions');
        setExhibitions(exhibitionsResponse.data);

        // Get filter parameters for the API requests
        const startDateStr = dateRange[0].format('YYYY-MM-DD');
        const endDateStr = dateRange[1].format('YYYY-MM-DD');
        const exhibitionParam = selectedExhibition !== 'all' ? `&exhibitionId=${selectedExhibition}` : '';
        
        console.log('Fetching data with exhibition param:', exhibitionParam);
        
        // Fetch booking statistics
        const statsResponse = await api.get(
          `/analytics/dashboard?startDate=${startDateStr}&endDate=${endDateStr}${exhibitionParam}`
        );
        setBookingStats(statsResponse.data);
        
        // Check if we're using sample data
        if (statsResponse.data.isSampleData) {
          setDataSource('sample');
        } else {
          setDataSource('real');
          
          // Check if there's any real data (all counts are zero)
          if (statsResponse.data.totalBookings === 0 && selectedExhibition !== 'all') {
            setHasData(false);
          }
        }
        
        console.log('Booking stats:', statsResponse.data);
        
        // Fetch booking trends
        const trendsResponse = await api.get(
          `/analytics/booking-trends?days=30${exhibitionParam}`
        );
        
        // Ensure data is valid for charts - transforms to handle NaN
        const validTrendsData = trendsResponse.data.map((item: any) => ({
          date: item.date || '',
          bookings: typeof item.bookings === 'number' && !isNaN(item.bookings) ? item.bookings : 0,
          revenue: typeof item.revenue === 'number' && !isNaN(item.revenue) ? item.revenue : 0,
          isSampleData: item.isSampleData || false
        }));

        console.log('Valid trends data:', validTrendsData);
        setBookingTrends(validTrendsData);
        
        // Fetch revenue by exhibition
        const revenueByExhibitionResponse = await api.get(
          `/analytics/revenue-by-exhibition?startDate=${startDateStr}&endDate=${endDateStr}${exhibitionParam}`
        );
        
        // Ensure data is valid for charts
        const validExhibitionData = revenueByExhibitionResponse.data.map((item: any) => ({
          exhibition: item.exhibition || 'Unknown',
          revenue: typeof item.revenue === 'number' && !isNaN(item.revenue) ? item.revenue : 0,
          isSampleData: item.isSampleData || false
        }));

        console.log('Valid exhibition data:', validExhibitionData);
        setRevenueByExhibition(validExhibitionData);
        
        // Fetch bookings by status
        const bookingsByStatusResponse = await api.get(
          `/analytics/bookings-by-status?startDate=${startDateStr}&endDate=${endDateStr}${exhibitionParam}`
        );
        
        // Ensure data is valid for charts
        const validStatusData = bookingsByStatusResponse.data.map((item: any) => ({
          status: item.status || 'Unknown',
          value: typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0,
          isSampleData: item.isSampleData || false
        }));

        console.log('Valid status data:', validStatusData);
        setBookingsByStatus(validStatusData);
        
        // Fetch recent bookings
        const recentBookingsResponse = await api.get(
          `/analytics/recent-bookings?limit=5${exhibitionParam}`
        );
        setRecentBookings(recentBookingsResponse.data);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedExhibition]);

  // Configure chart options - simplify configurations to isolate the issue
  const bookingTrendsConfig = {
    data: bookingTrends.filter(item => 
      item.date && 
      typeof item.bookings === 'number' && 
      !isNaN(item.bookings)
    ),
    xField: 'date',
    yField: 'bookings',
    smooth: true,
    color: '#7C3AED',
    // Remove point configuration which might be causing issues
  };

  const revenueTrendsConfig = {
    data: bookingTrends.filter(item => 
      item.date && 
      typeof item.revenue === 'number' && 
      !isNaN(item.revenue)
    ),
    xField: 'date',
    yField: 'revenue',
    smooth: true,
    color: '#059669',
  };

  const revenueByExhibitionConfig = {
    data: revenueByExhibition.filter(item => 
      item.exhibition && 
      typeof item.revenue === 'number' && 
      !isNaN(item.revenue)
    ),
    xField: 'exhibition',
    yField: 'revenue',
    color: '#2563EB',
  };

  const bookingsByStatusConfig = {
    data: bookingsByStatus.filter(item => 
      item.status && 
      typeof item.value === 'number' && 
      !isNaN(item.value)
    ).length > 0 ? 
      bookingsByStatus.filter(item => 
        item.status && 
        typeof item.value === 'number' && 
        !isNaN(item.value)
      ) : 
      [{ status: 'No Data', value: 1 }],
    angleField: 'value',
    colorField: 'status',
    radius: 0.8,
    // Remove label config completely as it might be causing problems
    interactions: [{ type: 'element-active' }],
    color: ['#10B981', '#F59E0B', '#EF4444'],
  };

  // Table columns for recent bookings
  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Exhibition',
      dataIndex: 'exhibitionName',
      key: 'exhibitionName',
    },
    {
      title: 'Exhibitor',
      dataIndex: 'exhibitorName',
      key: 'exhibitorName',
    },
    {
      title: 'Stalls',
      dataIndex: 'stallCount',
      key: 'stallCount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'approved') color = 'green';
        if (status === 'rejected') color = 'red';
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
  ];

  // Handle filter changes
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const handleExhibitionChange = (value: string) => {
    setSelectedExhibition(value);
  };

  // Add a component to display data source notice
  const DataSourceNotice = () => {
    if (dataSource === 'sample') {
      return (
        <div style={{ 
          padding: '8px 16px', 
          background: '#fffbe6', 
          border: '1px solid #ffe58f', 
          borderRadius: '4px',
          marginBottom: '16px' 
        }}>
          <Text type="warning">
            <InfoCircleOutlined style={{ marginRight: '8px' }} />
            Showing sample data. Select a specific exhibition with booking data to see real analytics.
          </Text>
        </div>
      );
    } else if (!hasData && selectedExhibition !== 'all') {
      return (
        <div style={{ 
          padding: '8px 16px', 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f', 
          borderRadius: '4px',
          marginBottom: '16px' 
        }}>
          <Text type="success">
            <InfoCircleOutlined style={{ marginRight: '8px' }} />
            No booking data found for this exhibition. Create bookings to see analytics.
          </Text>
        </div>
      );
    }
    return null;
  };

  // Render method
  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <Title level={4}>Analytics Dashboard</Title>
        <div className="analytics-filters">
          <Space size="middle">
            <Select
              style={{ width: 200 }}
              placeholder="Select Exhibition"
              value={selectedExhibition}
              onChange={handleExhibitionChange}
            >
              <Option value="all">All Exhibitions</Option>
              {exhibitions.map((exhibition: any) => (
                <Option key={exhibition._id} value={exhibition._id}>
                  {exhibition.name}
                </Option>
              ))}
            </Select>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="MMM D, YYYY"
            />
          </Space>
        </div>
      </div>

      <Spin spinning={loading} tip="Loading analytics...">
        <div className="analytics-content">
          {/* Add the data source notice */}
          <DataSourceNotice />
          
          {/* Key metrics section */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="metric-card">
                <Statistic
                  title="Total Bookings"
                  value={bookingStats?.totalBookings || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#7C3AED' }}
                />
                <div className="metric-trend">
                  <ArrowUpOutlined style={{ color: '#10B981' }} />
                  <Text type="secondary">8% from last month</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="metric-card">
                <Statistic
                  title="Total Revenue"
                  value={formatCurrency(bookingStats?.totalRevenue || 0)}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#10B981' }}
                />
                <div className="metric-trend">
                  <ArrowUpOutlined style={{ color: '#10B981' }} />
                  <Text type="secondary">12% from last month</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="metric-card">
                <Statistic
                  title="Stalls Booked"
                  value={bookingStats?.totalStallsBooked || 0}
                  prefix={<ShopOutlined />}
                  valueStyle={{ color: '#2563EB' }}
                />
                <div className="metric-trend">
                  <ArrowUpOutlined style={{ color: '#10B981' }} />
                  <Text type="secondary">5% from last month</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="metric-card">
                <Statistic
                  title="Avg. Booking Value"
                  value={formatCurrency(bookingStats?.averageBookingValue || 0)}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#F59E0B' }}
                />
                <div className="metric-trend">
                  <ArrowDownOutlined style={{ color: '#EF4444' }} />
                  <Text type="secondary">3% from last month</Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Restore charts with proper data validation */}
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <CalendarOutlined /> Booking Trends
                    <Text type="secondary" style={{ fontSize: '14px', marginLeft: '8px' }}>
                      Last 30 days
                    </Text>
                  </span>
                }
                className="chart-card"
              >
                {bookingTrends && bookingTrends.length > 0 ? (
                  <Line 
                    data={bookingTrends.filter(item => 
                      item.date && 
                      typeof item.bookings === 'number' && 
                      !isNaN(item.bookings)
                    )}
                    xField="date"
                    yField="bookings"
                    smooth={true}
                    color="#7C3AED"
                    tooltip={{
                      formatter: (datum: any) => ({
                        name: 'Bookings',
                        value: datum.bookings != null ? datum.bookings : 0
                      })
                    }}
                    height={300}
                  />
                ) : (
                  <Empty description="No booking trend data available" />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <DollarOutlined /> Revenue Trends
                    <Text type="secondary" style={{ fontSize: '14px', marginLeft: '8px' }}>
                      Last 30 days
                    </Text>
                  </span>
                }
                className="chart-card"
              >
                {bookingTrends && bookingTrends.length > 0 ? (
                  <Line 
                    data={bookingTrends.filter(item => 
                      item.date && 
                      typeof item.revenue === 'number' && 
                      !isNaN(item.revenue)
                    )}
                    xField="date"
                    yField="revenue"
                    smooth={true}
                    color="#059669"
                    tooltip={{
                      formatter: (datum: any) => ({
                        name: 'Revenue',
                        value: formatCurrency(datum.revenue != null ? datum.revenue : 0)
                      })
                    }}
                    height={300}
                  />
                ) : (
                  <Empty description="No revenue trend data available" />
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <ShopOutlined /> Revenue by Exhibition
                  </span>
                }
                className="chart-card"
              >
                {revenueByExhibition && revenueByExhibition.length > 0 ? (
                  <Bar 
                    data={revenueByExhibition.filter(item => 
                      item.exhibition && 
                      typeof item.revenue === 'number' && 
                      !isNaN(item.revenue)
                    )}
                    xField="exhibition"
                    yField="revenue"
                    color="#2563EB"
                    label={{
                      position: 'top',
                      formatter: (datum: any) => {
                        if (datum && typeof datum.revenue === 'number') {
                          return `₹${(datum.revenue / 1000).toFixed(0)}K`;
                        }
                        return '₹0K';
                      }
                    }}
                    tooltip={{
                      formatter: (datum: any) => ({
                        name: 'Revenue',
                        value: formatCurrency(datum?.revenue ?? 0)
                      })
                    }}
                    height={300}
                  />
                ) : (
                  <Empty description="No exhibition revenue data available" />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <CheckCircleOutlined /> Bookings by Status
                  </span>
                }
                className="chart-card"
              >
                {bookingsByStatus && bookingsByStatus.length > 0 ? (
                  <Pie 
                    data={bookingsByStatus.filter(item => 
                      item.status && 
                      typeof item.value === 'number' && 
                      !isNaN(item.value)
                    )}
                    angleField="value"
                    colorField="status"
                    radius={0.8}
                    innerRadius={0.6}
                    legend={{
                      position: 'bottom'
                    }}
                    statistic={{
                      title: false,
                      content: {
                        content: 'Bookings'
                      }
                    }}
                    color={['#10B981', '#F59E0B', '#EF4444']}
                    height={300}
                  />
                ) : (
                  <Empty description="No booking status data available" />
                )}
              </Card>
            </Col>
          </Row>

          {/* Recent bookings section */}
          <Card 
            title="Recent Bookings" 
            className="table-card"
            style={{ marginTop: '24px' }}
          >
            <Table 
              dataSource={recentBookings} 
              columns={columns} 
              rowKey="id"
              pagination={{ pageSize: 5 }} 
            />
          </Card>

          {/* Additional analytics tabs */}
          <Card style={{ marginTop: '24px' }}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Booking Analysis" key="1">
                <div className="tab-content">
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                      <Card className="status-card approved">
                        <Statistic
                          title="Approved Bookings"
                          value={bookingStats?.approvedBookings || 0}
                          valueStyle={{ color: '#fff' }}
                        />
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {bookingStats?.totalBookings > 0 
                            ? Math.round((bookingStats.approvedBookings / bookingStats.totalBookings) * 100) 
                            : 0}% of total
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card className="status-card pending">
                        <Statistic
                          title="Pending Bookings"
                          value={bookingStats?.pendingBookings || 0}
                          valueStyle={{ color: '#fff' }}
                        />
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {bookingStats?.totalBookings > 0 
                            ? Math.round((bookingStats.pendingBookings / bookingStats.totalBookings) * 100) 
                            : 0}% of total
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card className="status-card rejected">
                        <Statistic
                          title="Rejected Bookings"
                          value={bookingStats?.rejectedBookings || 0}
                          valueStyle={{ color: '#fff' }}
                        />
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {bookingStats?.totalBookings > 0 
                            ? Math.round((bookingStats.rejectedBookings / bookingStats.totalBookings) * 100) 
                            : 0}% of total
                        </Text>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </TabPane>
              <TabPane tab="Exhibitor Analytics" key="2">
                <div className="tab-content">
                  <Empty 
                    description="Exhibitor analytics coming soon" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                </div>
              </TabPane>
              <TabPane tab="Revenue Analytics" key="3">
                <div className="tab-content">
                  <Empty 
                    description="Detailed revenue analytics coming soon" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </Spin>
    </div>
  );
};

export default AnalyticsPage; 