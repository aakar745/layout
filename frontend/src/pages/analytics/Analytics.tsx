import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  Spin,
  Typography,
  Space,
  Statistic,
  Progress,
  Tag,
  Divider,
  Empty,
  Alert,
  Tooltip,
  Result,
  Button
} from 'antd';
import {
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  DatabaseOutlined,
  PercentageOutlined,
  TrophyOutlined,
  BankOutlined,
  BuildOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import analyticsService, { AnalyticsData, ExhibitionOverview } from '../../services/analytics';
import { usePermission } from '../../hooks/reduxHooks';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import './Analytics.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Styled components for modern design
const AnalyticsContainer = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 64px);
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const StatsCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const SectionCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.08);
  border: none;
  margin-bottom: 24px;
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
    
    .ant-card-head-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  font-size: 20px;
`;

const ProgressCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
`;

const Analytics: React.FC = () => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  
  // Check if user has permission to view analytics
  if (!hasPermission('analytics_view')) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>}
      />
    );
  }
  
  const [loading, setLoading] = useState(true);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [selectedExhibition, setSelectedExhibition] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [exhibitionOverview, setExhibitionOverview] = useState<ExhibitionOverview[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load exhibitions overview on component mount
  useEffect(() => {
    loadExhibitionsOverview();
  }, []);

  // Load analytics data when exhibition is selected
  useEffect(() => {
    if (selectedExhibition) {
      loadAnalyticsData(selectedExhibition);
    }
  }, [selectedExhibition]);

  const loadExhibitionsOverview = async () => {
    try {
      setOverviewLoading(true);
      const data = await analyticsService.getAnalyticsOverview();
      setExhibitionOverview(data);
      
      // Auto-select first active exhibition
      const activeExhibition = data.find(e => e.exhibition.isActive && e.exhibition.status === 'published');
      if (activeExhibition && !selectedExhibition) {
        setSelectedExhibition(activeExhibition.exhibition.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load exhibitions');
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadAnalyticsData = async (exhibitionId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getExhibitionAnalytics(exhibitionId);
      setAnalyticsData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data');
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: '#faad14',
      confirmed: '#52c41a',
      approved: '#1890ff',
      cancelled: '#ff4d4f',
      rejected: '#ff4d4f',
      active: '#52c41a',
      inactive: '#d9d9d9',
      published: '#52c41a',
      draft: '#faad14'
    };
    return colors[status as keyof typeof colors] || '#d9d9d9';
  };

  const renderStallTypeBreakdown = () => {
    if (!analyticsData?.stalls.typeBreakdown) return null;

    return Object.entries(analyticsData.stalls.typeBreakdown).map(([type, data]) => (
      <Col xs={24} sm={12} lg={8} key={type}>
        <StatsCard>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: '16px' }}>{type}</Text>
              <Tag color="blue">{data.total} stalls</Tag>
            </div>
            
            {/* Rate per SQM */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '12px 16px',
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center'
            }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Rate per SQM</Text>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>
                {formatCurrency(data.ratePerSqm)}
              </div>
            </div>
            
            <Row gutter={16}>
              <Col span={12}>
                <Statistic 
                  title="Booked" 
                  value={data.booked} 
                  valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Available" 
                  value={data.available} 
                  valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                />
              </Col>
            </Row>
            <div>
              <Text type="secondary">Area: {data.bookedArea.toFixed(1)} / {data.totalArea.toFixed(1)} sqm</Text>
              <Progress 
                percent={data.totalArea > 0 ? Math.round((data.bookedArea / data.totalArea) * 100) : 0}
                strokeColor="#52c41a"
                size="small"
                style={{ marginTop: 8 }}
              />
            </div>
            
            {/* Additional metrics with rate */}
            <div style={{ marginTop: '8px', padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Total Value: {formatCurrency(data.totalArea * data.ratePerSqm)}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Booked Value: {formatCurrency(data.bookedArea * data.ratePerSqm)}
              </Text>
            </div>
          </Space>
        </StatsCard>
      </Col>
    ));
  };

  if (overviewLoading) {
    return (
      <AnalyticsContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" tip="Loading exhibitions...">
            <div style={{ minHeight: '50px' }} />
          </Spin>
        </div>
      </AnalyticsContainer>
    );
  }

  return (
    <AnalyticsContainer>
      <HeaderSection>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <BarChartOutlined style={{ marginRight: 12 }} />
              Analytics Dashboard
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', margin: '8px 0 0 0' }}>
              Comprehensive insights and analytics for your exhibitions
            </Paragraph>
          </Col>
        </Row>
      </HeaderSection>

      {/* Exhibition Selector */}
      <SectionCard>
        <Row align="middle" gutter={16}>
          <Col>
            <Text strong style={{ fontSize: '16px' }}>Select Exhibition:</Text>
          </Col>
          <Col flex="auto">
            <Select
              style={{ width: '100%', maxWidth: 400 }}
              placeholder="Choose an exhibition to view analytics"
              value={selectedExhibition}
              onChange={setSelectedExhibition}
              size="large"
            >
              {exhibitionOverview.map(item => (
                <Option key={item.exhibition.id} value={item.exhibition.id}>
                  <Space>
                    <Tag color={getStatusColor(item.exhibition.status)}>
                      {item.exhibition.status.toUpperCase()}
                    </Tag>
                    {item.exhibition.name}
                    <Text type="secondary">
                      ({item.stats.bookedStalls}/{item.stats.totalStalls} stalls)
                    </Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </SectionCard>

      {error && (
        <Alert
          message="Error Loading Data"
          description={error}
          type="error"
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {!selectedExhibition && !loading && (
        <Empty
          description="Please select an exhibition to view analytics"
          style={{ padding: '60px 0' }}
        />
      )}

      {selectedExhibition && loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="Loading analytics data...">
            <div style={{ minHeight: '50px' }} />
          </Spin>
        </div>
      )}

      {selectedExhibition && !loading && analyticsData && (
        <>
          {/* Exhibition Info */}
          <SectionCard>
            <Row gutter={24}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="small">
                  <Title level={3} style={{ margin: 0 }}>
                    {analyticsData.exhibition.name}
                  </Title>
                  <Space wrap>
                    <Tag 
                      color={getStatusColor(analyticsData.exhibition.status)} 
                      style={{ fontSize: '14px', padding: '4px 12px' }}
                    >
                      {analyticsData.exhibition.status.toUpperCase()}
                    </Tag>
                    <Tag 
                      color={analyticsData.exhibition.isActive ? 'green' : 'red'}
                      style={{ fontSize: '14px', padding: '4px 12px' }}
                    >
                      {analyticsData.exhibition.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Tag>
                  </Space>
                  <Space wrap>
                    <Text><EnvironmentOutlined /> {analyticsData.exhibition.venue}</Text>
                    <Text><CalendarOutlined /> {dayjs(analyticsData.exhibition.startDate).format('MMM DD, YYYY')} - {dayjs(analyticsData.exhibition.endDate).format('MMM DD, YYYY')}</Text>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={8}>
                <ProgressCard>
                  <Statistic
                    title="Space Utilization"
                    value={analyticsData.area.utilizationRate}
                    suffix="%"
                    valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
                  />
                  <Progress 
                    percent={analyticsData.area.utilizationRate} 
                    strokeColor="white"
                    trailColor="rgba(255,255,255,0.3)"
                    showInfo={false}
                    style={{ marginTop: 12 }}
                  />
                </ProgressCard>
              </Col>
            </Row>
          </SectionCard>

          {/* Key Metrics */}
          <SectionCard title="Key Performance Metrics">
            <Row gutter={[24, 24]}>
              <Col xs={12} sm={8} lg={6}>
                <StatsCard>
                  <Space>
                    <IconWrapper color="#1890ff">
                      <ShopOutlined />
                    </IconWrapper>
                    <div>
                      <Statistic
                        title="Total Stalls"
                        value={analyticsData.stalls.total}
                        valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                      />
                      <Text type="secondary">{analyticsData.stalls.booked} booked</Text>
                    </div>
                  </Space>
                </StatsCard>
              </Col>
              <Col xs={12} sm={8} lg={6}>
                <StatsCard>
                  <Space>
                    <IconWrapper color="#52c41a">
                      <DatabaseOutlined />
                    </IconWrapper>
                    <div>
                      <Statistic
                        title="Total Area"
                        value={analyticsData.area.totalSQM}
                        suffix="sqm"
                        valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                      />
                      <Text type="secondary">{analyticsData.area.bookedSQM} booked</Text>
                    </div>
                  </Space>
                </StatsCard>
              </Col>
              <Col xs={12} sm={8} lg={6}>
                <StatsCard>
                  <Space>
                    <IconWrapper color="#faad14">
                      <TeamOutlined />
                    </IconWrapper>
                    <div>
                      <Statistic
                        title="Exhibitors"
                        value={analyticsData.exhibitors.uniqueExhibitorsInExhibition}
                        valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                      />
                      <Text type="secondary">in this exhibition</Text>
                    </div>
                  </Space>
                </StatsCard>
              </Col>
              <Col xs={12} sm={8} lg={6}>
                <StatsCard>
                  <Space>
                    <IconWrapper color="#f5222d">
                      <DollarOutlined />
                    </IconWrapper>
                    <div>
                      <Statistic
                        title="Total Revenue"
                        value={formatCurrency(analyticsData.financial.totalRevenue)}
                        valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                      />
                      <Text type="secondary">confirmed bookings</Text>
                    </div>
                  </Space>
                </StatsCard>
              </Col>
            </Row>
          </SectionCard>

          {/* Stall Analytics */}
          <SectionCard title="Stall Analytics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <Space>
                      <span>Occupancy Overview</span>
                      <Tooltip 
                        title={
                          <div>
                            <div><strong>How it works:</strong></div>
                            <div>• <strong>Occupancy Rate:</strong> (Booked Stalls ÷ Total Stalls) × 100</div>
                            <div>• <strong>Green (≥70%):</strong> Excellent occupancy</div>
                            <div>• <strong>Yellow (40-69%):</strong> Moderate occupancy</div>
                            <div>• <strong>Red (&lt;40%):</strong> Low occupancy - needs attention</div>
                            <br/>
                            <div><strong>Status Types:</strong></div>
                            <div>• <strong>Booked:</strong> Confirmed stall bookings</div>
                            <div>• <strong>Available:</strong> Ready for booking</div>
                            <div>• <strong>Reserved:</strong> Temporarily held</div>
                          </div>
                        }
                        placement="topLeft"
                        overlayStyle={{ maxWidth: '300px' }}
                      >
                        <ExclamationCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
                      </Tooltip>
                    </Space>
                  } 
                  bordered={false}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title={
                          <Space>
                            <span>Occupancy Rate</span>
                            <Tooltip title={`${analyticsData.stalls.booked} out of ${analyticsData.stalls.total} stalls are booked`}>
                              <ExclamationCircleOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} />
                            </Tooltip>
                          </Space>
                        }
                        value={analyticsData.stalls.occupancyRate}
                        suffix="%"
                        valueStyle={{ color: analyticsData.stalls.occupancyRate >= 70 ? '#52c41a' : analyticsData.stalls.occupancyRate >= 40 ? '#faad14' : '#ff4d4f' }}
                      />
                      <Progress 
                        percent={analyticsData.stalls.occupancyRate} 
                        strokeColor={analyticsData.stalls.occupancyRate >= 70 ? '#52c41a' : analyticsData.stalls.occupancyRate >= 40 ? '#faad14' : '#ff4d4f'}
                        style={{ marginTop: 8 }}
                      />
                      <div style={{ marginTop: 8, fontSize: '12px', color: '#8c8c8c' }}>
                        {analyticsData.stalls.occupancyRate >= 70 && '🟢 Excellent - Strong demand'}
                        {analyticsData.stalls.occupancyRate >= 40 && analyticsData.stalls.occupancyRate < 70 && '🟡 Moderate - Monitor trends'}
                        {analyticsData.stalls.occupancyRate < 40 && '🔴 Low - Needs attention'}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <MetricItem>
                          <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Booked</Text>
                          <Text strong>{analyticsData.stalls.booked}</Text>
                        </MetricItem>
                        <MetricItem>
                          <Text><ClockCircleOutlined style={{ color: '#1890ff' }} /> Available</Text>
                          <Text strong>{analyticsData.stalls.available}</Text>
                        </MetricItem>
                        <MetricItem>
                          <Text><ExclamationCircleOutlined style={{ color: '#faad14' }} /> Reserved</Text>
                          <Text strong>{analyticsData.stalls.reserved}</Text>
                        </MetricItem>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Area Utilization" bordered={false}>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <MetricItem>
                      <Text>Total Area</Text>
                      <Text strong>{analyticsData.area.totalSQM} sqm</Text>
                    </MetricItem>
                    <MetricItem>
                      <Text>Booked Area</Text>
                      <Text strong style={{ color: '#52c41a' }}>{analyticsData.area.bookedSQM} sqm</Text>
                    </MetricItem>
                    <MetricItem>
                      <Text>Available Area</Text>
                      <Text strong style={{ color: '#1890ff' }}>{analyticsData.area.availableSQM} sqm</Text>
                    </MetricItem>
                    <div>
                      <Text>Utilization Rate</Text>
                      <Progress 
                        percent={analyticsData.area.utilizationRate} 
                        strokeColor="#722ed1"
                        style={{ marginTop: 8 }}
                      />
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
            
            {/* Hall Analytics */}
            <Divider orientation="left">Hall Analytics</Divider>
            <Row gutter={[16, 16]}>
              {Object.values(analyticsData.halls || {}).map((hall) => (
                <Col xs={24} lg={12} xl={8} key={hall.hallId}>
                  <StatsCard>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: '16px' }}>{hall.name}</Text>
                        <Tag color="blue">{hall.stalls.total} stalls</Tag>
                      </div>
                      
                      {/* Hall dimensions and area */}
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Hall Area</Text>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>
                          {hall.dimensions.width}m × {hall.dimensions.height}m
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '2px' }}>
                          {hall.area.hallArea} SQM
                        </div>
                      </div>
                      
                      <Row gutter={16}>
                        <Col span={12}>
                          <Statistic 
                            title="Occupied" 
                            value={hall.stalls.booked} 
                            valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic 
                            title="Available" 
                            value={hall.stalls.available} 
                            valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                          />
                        </Col>
                      </Row>
                      
                      <div>
                        <Text type="secondary">Used Area: {hall.area.bookedSQM} / {hall.area.totalSQM} sqm</Text>
                        <Progress 
                          percent={hall.area.utilizationRate}
                          strokeColor={
                            hall.area.utilizationRate >= 70 ? '#52c41a' : 
                            hall.area.utilizationRate >= 40 ? '#faad14' : '#ff4d4f'
                          }
                          size="small"
                          style={{ marginTop: 8 }}
                        />
                      </div>
                      
                      <div>
                        <Text type="secondary">Stall Occupancy: {hall.stalls.occupancyRate}%</Text>
                        <Progress 
                          percent={hall.stalls.occupancyRate}
                          strokeColor={
                            hall.stalls.occupancyRate >= 70 ? '#52c41a' : 
                            hall.stalls.occupancyRate >= 40 ? '#faad14' : '#ff4d4f'
                          }
                          size="small"
                          style={{ marginTop: 4 }}
                        />
                      </div>
                      
                      {/* Hall metrics */}
                      <div style={{ marginTop: '8px', padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Row gutter={8}>
                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Revenue: {formatCurrency(hall.revenue)}
                            </Text>
                          </Col>
                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Avg Rate: ₹{hall.averageRate}/sqm
                            </Text>
                          </Col>
                        </Row>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Bookings: {hall.bookings}
                        </Text>
                      </div>
                    </Space>
                  </StatsCard>
                </Col>
              ))}
              
              {Object.keys(analyticsData.halls || {}).length === 0 && (
                <Col span={24}>
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <BuildOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                    <p>No halls configured for this exhibition</p>
                  </div>
                </Col>
              )}
            </Row>
            
            {/* Stall Type Breakdown */}
            <Divider orientation="left">Stall Type Breakdown</Divider>
            <Row gutter={[16, 16]}>
              {renderStallTypeBreakdown()}
            </Row>
          </SectionCard>

          {/* Booking Analytics */}
          <SectionCard title="Booking Analytics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Booking Status Distribution" bordered={false}>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <MetricItem>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Text>Confirmed</Text>
                      </Space>
                      <Text strong style={{ color: '#52c41a' }}>{analyticsData.bookings.statusBreakdown.confirmed}</Text>
                    </MetricItem>
                    <MetricItem>
                      <Space>
                        <TrophyOutlined style={{ color: '#1890ff' }} />
                        <Text>Approved</Text>
                      </Space>
                      <Text strong style={{ color: '#1890ff' }}>{analyticsData.bookings.statusBreakdown.approved}</Text>
                    </MetricItem>
                    <MetricItem>
                      <Space>
                        <ClockCircleOutlined style={{ color: '#faad14' }} />
                        <Text>Pending</Text>
                      </Space>
                      <Text strong style={{ color: '#faad14' }}>{analyticsData.bookings.statusBreakdown.pending}</Text>
                    </MetricItem>
                    <MetricItem>
                      <Space>
                        <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                        <Text>Cancelled/Rejected</Text>
                      </Space>
                      <Text strong style={{ color: '#ff4d4f' }}>
                        {analyticsData.bookings.statusBreakdown.cancelled + analyticsData.bookings.statusBreakdown.rejected}
                      </Text>
                    </MetricItem>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Financial Overview" bordered={false}>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <MetricItem>
                      <Text>Total Base Amount</Text>
                      <Text strong>{formatCurrency(analyticsData.financial.totalBaseAmount)}</Text>
                    </MetricItem>
                    <MetricItem>
                      <Text>Total Discounts</Text>
                      <Text strong style={{ color: '#52c41a' }}>-{formatCurrency(analyticsData.financial.totalDiscountAmount)}</Text>
                    </MetricItem>
                    <MetricItem>
                      <Text>Total Taxes</Text>
                      <Text strong style={{ color: '#faad14' }}>+{formatCurrency(analyticsData.financial.totalTaxAmount)}</Text>
                    </MetricItem>
                    <MetricItem>
                      <Text>Average Booking Value</Text>
                      <Text strong style={{ color: '#1890ff' }}>{formatCurrency(analyticsData.financial.averageBookingValue)}</Text>
                    </MetricItem>
                  </Space>
                </Card>
              </Col>
            </Row>
          </SectionCard>

          {/* User & Exhibitor Analytics */}
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <SectionCard title="System Users">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Total Users"
                        value={analyticsData.users.total}
                        prefix={<UserOutlined />}
                        valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Active Users"
                        value={analyticsData.users.statusBreakdown.active}
                        valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                      />
                    </Col>
                  </Row>
                  <MetricItem>
                    <Text>Admin Users</Text>
                    <Tag color="purple">{analyticsData.users.statusBreakdown.admin}</Tag>
                  </MetricItem>
                  <MetricItem>
                    <Text>Regular Users</Text>
                    <Tag color="blue">{analyticsData.users.statusBreakdown.regular}</Tag>
                  </MetricItem>
                  <MetricItem>
                    <Text>Inactive Users</Text>
                    <Tag color="red">{analyticsData.users.statusBreakdown.inactive}</Tag>
                  </MetricItem>
                </Space>
              </SectionCard>
            </Col>
            <Col xs={24} lg={12}>
              <SectionCard title="Exhibitor Management">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Total Exhibitors"
                        value={analyticsData.exhibitors.total}
                        prefix={<TeamOutlined />}
                        valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Active Exhibitors"
                        value={analyticsData.exhibitors.statusBreakdown.active}
                        valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                      />
                    </Col>
                  </Row>
                  <MetricItem>
                    <Text>Approved</Text>
                    <Tag color="green">{analyticsData.exhibitors.statusBreakdown.approved}</Tag>
                  </MetricItem>
                  <MetricItem>
                    <Text>Pending Approval</Text>
                    <Tag color="orange">{analyticsData.exhibitors.statusBreakdown.pending}</Tag>
                  </MetricItem>
                  <MetricItem>
                    <Text>Rejected</Text>
                    <Tag color="red">{analyticsData.exhibitors.statusBreakdown.rejected}</Tag>
                  </MetricItem>
                </Space>
              </SectionCard>
            </Col>
          </Row>
        </>
      )}
    </AnalyticsContainer>
  );
};

export default Analytics; 