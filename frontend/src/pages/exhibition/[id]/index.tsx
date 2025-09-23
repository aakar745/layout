import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Row, 
  Col, 
  Statistic, 
  Badge, 
  Divider, 
  Avatar, 
  Skeleton,
  Progress,
  Spin
} from 'antd';
import { 
  ArrowLeftOutlined,
  EditOutlined, 
  LayoutOutlined, 
  CalendarOutlined, 
  UserOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  ShareAltOutlined,
  AppstoreOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  UnorderedListOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchExhibition, fetchHalls, fetchStalls } from '../../../store/slices/exhibitionSlice';
import { getExhibitionUrl, getPublicExhibitionUrl } from '@/utils/url';
import dayjs from 'dayjs';
import exhibitionService, { Exhibition, Hall, Stall, Fixture } from '../../../services/exhibition';

const { Title, Text, Paragraph } = Typography;

// Reusable BackButton component
const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div 
      style={{ 
        marginBottom: '24px',
        position: 'sticky',
        top: '16px',
        zIndex: 10
      }}
    >
      <Button 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/exhibition')}
        type="default"
        size="large"
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          background: 'white',
          borderColor: 'transparent',
          fontWeight: 500,
          padding: '0 16px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}
        className="back-button-hover"
      >
        <span style={{ marginLeft: 8 }}>Back to List</span>
      </Button>
      <style>{`
        .back-button-hover:hover {
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #f0f5ff;
          border-color: #d6e4ff;
        }
      `}</style>
    </div>
  );
};

const ExhibitionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentExhibition, halls, stalls, loading } = useSelector((state: RootState) => state.exhibition);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [exhibitionStats, setExhibitionStats] = useState<{
    hallCount: number;
    stallCount: number;
    bookedStallCount: number;
    progress?: any;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchExhibition(id));
      dispatch(fetchHalls(id));
      dispatch(fetchStalls({ exhibitionId: id }));
      // Fetch real stats data
      fetchExhibitionStats(id);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentExhibition) {
      calculateProgress();
    }
  }, [currentExhibition, exhibitionStats]);

  // Fetch real exhibition statistics
  const fetchExhibitionStats = async (exhibitionId: string) => {
    try {
      setStatsLoading(true);
      const data = await exhibitionService.getExhibitionProgress(exhibitionId);
      setExhibitionStats({
        hallCount: halls?.length || 0,
        stallCount: data.stats.totalStalls,
        bookedStallCount: data.stats.bookedStalls,
        progress: data.progress
      });
    } catch (error) {
      console.error('Failed to fetch exhibition stats:', error);
      // Fallback to calculating from available data
      setExhibitionStats({
        hallCount: halls?.length || 0,
        stallCount: stalls?.length || 0,
        bookedStallCount: stalls?.filter((s: any) => s.status === 'booked').length || 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Calculate stats from available data
  const getExhibitionStats = () => {
    if (exhibitionStats) {
      return exhibitionStats;
    }

    if (!currentExhibition) {
      return { hallCount: 0, stallCount: 0, bookedStallCount: 0 };
    }

    // Use real stats from backend if available
    if (currentExhibition.stats) {
      return {
        hallCount: halls?.length || currentExhibition.hallCount || 0,
        stallCount: currentExhibition.stats.totalStalls,
        bookedStallCount: currentExhibition.stats.bookedStalls
      };
    }

    // Fallback to calculating from Redux state
    return {
      hallCount: halls?.length || 0,
      stallCount: stalls?.length || 0,
      bookedStallCount: stalls?.filter((s: any) => s.status === 'booked').length || 0
    };
  };

  const calculateProgress = () => {
    if (!currentExhibition) return 0;

    // Use real progress data from fetched stats if available
    if (exhibitionStats?.progress?.combinedProgress !== undefined) {
      return setProgressPercent(exhibitionStats.progress.combinedProgress);
    }
    
    // Use real progress data from backend if available
    if (currentExhibition.progress?.combinedProgress !== undefined) {
      return setProgressPercent(currentExhibition.progress.combinedProgress);
    }
    
    // Fallback to stall booking progress if available
    if (exhibitionStats?.progress?.stallBookingProgress !== undefined) {
      return setProgressPercent(exhibitionStats.progress.stallBookingProgress);
    }
    
    if (currentExhibition.progress?.stallBookingProgress !== undefined) {
      return setProgressPercent(currentExhibition.progress.stallBookingProgress);
    }

    // Final fallback to time-based progress (old behavior)
    const now = new Date();
    const start = new Date(currentExhibition.startDate);
    const end = new Date(currentExhibition.endDate);
    
    if (now < start) return setProgressPercent(0);
    if (now > end) return setProgressPercent(100);
    
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    setProgressPercent(Math.round((current / total) * 100));
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'published':
        return '#52c41a'; // Green
      case 'draft':
        return '#faad14'; // Gold
      case 'completed':
        return '#1890ff'; // Blue
      default:
        return '#d9d9d9';
    }
  };

  const getDaysInfo = () => {
    if (!currentExhibition) return { text: '', count: 0, isPast: false };
    
    const now = new Date();
    const start = new Date(currentExhibition.startDate);
    const end = new Date(currentExhibition.endDate);
    
    // Check if exhibition has ended
    if (now > end) {
      const days = Math.ceil((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
      return { text: 'Ended', count: days, isPast: true };
    }
    
    // Check if exhibition is ongoing
    if (now >= start && now <= end) {
      const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { text: 'Days Remaining', count: days, isPast: false };
    }
    
    // Exhibition hasn't started yet
    const days = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { text: 'Days Until Start', count: days, isPast: false };
  };

  const handleNavigation = (path: string) => {
    navigate(getExhibitionUrl(currentExhibition, path));
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <BackButton />
        <Card>
          <Skeleton active avatar paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }
  
  if (!currentExhibition) {
    return (
      <div style={{ padding: '24px' }}>
        <BackButton />
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <InfoCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4}>Exhibition not found</Title>
            <Paragraph type="secondary">The exhibition you are looking for does not exist or has been removed.</Paragraph>
          </div>
        </Card>
      </div>
    );
  }

  const daysInfo = getDaysInfo();

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: 'calc(100vh - 64px)' }}>
      <BackButton />

      {/* Hero Section */}
      <Card
        className="exhibition-header-card"
        style={{ 
          marginBottom: '24px',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        styles={{ body: { padding: '0' } }}
      >
        <div style={{ 
          background: 'linear-gradient(135deg, #1a365d 0%, #44337a 100%)',
          padding: '40px 24px',
          position: 'relative'
        }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <Title 
                level={2} 
                style={{ 
                  color: 'white', 
                  marginBottom: '8px',
                  marginTop: 0
                }}
              >
                {currentExhibition.name}
              </Title>
              <Paragraph 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '16px',
                  marginBottom: '24px'
                }}
              >
                {currentExhibition.description}
              </Paragraph>
              
              <Space split={<Divider type="vertical" style={{ background: 'rgba(255,255,255,0.3)' }} />}>
                <Space>
                  <CalendarOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {dayjs(currentExhibition.startDate).format('MMM D, YYYY')} - {dayjs(currentExhibition.endDate).format('MMM D, YYYY')}
                  </Text>
                </Space>
                {currentExhibition.venue && (
                  <Space>
                    <EnvironmentOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {currentExhibition.venue}
                    </Text>
                  </Space>
                )}
              </Space>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                style={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {/* Status badge on the card */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '-12px', 
                    right: '-12px', 
                    zIndex: 2,
                    background: getStatusColor(currentExhibition.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  {currentExhibition.status.toUpperCase()}
                </div>

                <Statistic
                  title={daysInfo.text}
                  value={daysInfo.count}
                  suffix="days"
                  valueStyle={{ 
                    color: daysInfo.isPast ? '#8c8c8c' : '#1890ff',
                    fontWeight: 600
                  }}
                  prefix={<ClockCircleOutlined />}
                />
                
                <Divider style={{ margin: '16px 0' }} />
                
                <div style={{ marginBottom: '8px' }}>
                  <Text type="secondary">Exhibition Progress</Text>
                </div>
                <Progress 
                  percent={progressPercent} 
                  status={progressPercent === 100 ? 'success' : 'active'}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                
                {/* Show detailed progress breakdown if available */}
                {currentExhibition.progress && (
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#8c8c8c' }}>
                    <div>Stall Booking: {currentExhibition.progress.stallBookingProgress}%</div>
                    <div>Timeline: {currentExhibition.progress.timeProgress}%</div>
                  </div>
                )}
                
                {/* Show stall statistics if available */}
                {currentExhibition.stats && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#595959' }}>
                    {currentExhibition.stats.bookedStalls}/{currentExhibition.stats.totalStalls} stalls booked
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Action Buttons */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Button 
            type="primary"
            icon={<LayoutOutlined />}
            onClick={() => handleNavigation(`${id}/layout`)}
            block
            size="large"
            style={{ height: '48px' }}
          >
            Manage Layout
          </Button>
        </Col>
        <Col xs={24} sm={8}>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleNavigation(`${id}/edit`)}
            block
            size="large"
            style={{ height: '48px' }}
          >
            Edit Exhibition
          </Button>
        </Col>
        <Col xs={24} sm={8}>
          <Button
            icon={<EyeOutlined />}
            onClick={() => window.open(getPublicExhibitionUrl(currentExhibition), '_blank')}
            block
            size="large"
            style={{ height: '48px' }}
            disabled={currentExhibition.status !== 'published'}
          >
            View Public Page
          </Button>
        </Col>
      </Row>

      {/* Details Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title="Exhibition Details" 
            style={{ 
              borderRadius: '12px',
              height: '100%'
            }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '24px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    Start Date
                  </Text>
                  <Text strong style={{ fontSize: '16px' }}>
                    {dayjs(currentExhibition.startDate).format('MMMM D, YYYY')}
                  </Text>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    End Date
                  </Text>
                  <Text strong style={{ fontSize: '16px' }}>
                    {dayjs(currentExhibition.endDate).format('MMMM D, YYYY')}
                  </Text>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    Created At
                  </Text>
                  <Text strong style={{ fontSize: '16px' }}>
                    {dayjs(currentExhibition.createdAt).format('MMMM D, YYYY')}
                  </Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '24px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    Status
                  </Text>
                  <Tag 
                    color={getStatusColor(currentExhibition.status)}
                    style={{ 
                      padding: '4px 12px', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    {currentExhibition.status.toUpperCase()}
                  </Tag>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    Active Status
                  </Text>
                  <Tag 
                    color={currentExhibition.isActive ? '#52c41a' : '#f5222d'}
                    style={{ 
                      padding: '4px 12px', 
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    {currentExhibition.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Tag>
                </div>
                
                {currentExhibition.venue && (
                  <div style={{ marginBottom: '24px' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                      Venue
                    </Text>
                    <Text strong style={{ fontSize: '16px' }}>
                      {currentExhibition.venue}
                    </Text>
                  </div>
                )}
              </Col>
            </Row>
            
            <Divider />
            
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                Description
              </Text>
              <Paragraph>
                {currentExhibition.description || 'No description provided.'}
              </Paragraph>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Exhibition Stats</span>
                <Button 
                  type="text" 
                  size="small"
                  loading={statsLoading}
                  onClick={() => id && fetchExhibitionStats(id)}
                  icon={<ReloadOutlined />}
                  title="Refresh Stats"
                />
              </div>
            }
            style={{ 
              borderRadius: '12px',
              marginBottom: '24px'
            }}
          >
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '12px' }}>
                  <Text type="secondary">Loading real-time statistics...</Text>
                </div>
              </div>
            ) : (
              <Row gutter={[16, 24]}>
                <Col span={12}>
                  <Statistic 
                    title="Halls"
                    value={getExhibitionStats().hallCount}
                    prefix={<AppstoreOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Stalls"
                    value={getExhibitionStats().stallCount}
                    prefix={<ShopOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Booked Stalls"
                    value={getExhibitionStats().bookedStallCount}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Available Stalls"
                    value={getExhibitionStats().stallCount - getExhibitionStats().bookedStallCount}
                    prefix={<UnorderedListOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
              </Row>
            )}
            
            {/* Progress Section */}
            <Divider style={{ margin: '16px 0' }} />
            
            <div style={{ marginBottom: '8px' }}>
              <Text type="secondary">Exhibition Progress</Text>
            </div>
            <Progress 
              percent={progressPercent} 
              status={progressPercent === 100 ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            
            {/* Show detailed progress breakdown if available */}
            {exhibitionStats?.progress && (
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#8c8c8c' }}>
                <div>Stall Booking: {exhibitionStats.progress.stallBookingProgress}%</div>
                <div>Time Progress: {exhibitionStats.progress.timeProgress}%</div>
                <div>Combined: {exhibitionStats.progress.combinedProgress}%</div>
              </div>
            )}
          </Card>
          
          <Card 
            title="Created By" 
            style={{ 
              borderRadius: '12px'
            }}
          >
            {currentExhibition.createdBy ? (
              <Space>
                <Avatar icon={<UserOutlined />} />
                <Text>{currentExhibition.createdByName || 'Administrator'}</Text>
              </Space>
            ) : (
              <Text type="secondary">Information not available</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExhibitionDetails; 