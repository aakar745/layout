import React, { useEffect, useState } from 'react';
import { 
  Card, Button, Space, Layout, Spin, Result, Typography, Row, Col, 
  Divider, Tag, Statistic, Avatar, Badge, Tooltip, Breadcrumb, Progress
} from 'antd';
import { 
  CalendarOutlined, EnvironmentOutlined, InfoCircleOutlined,
  ClockCircleOutlined, ArrowLeftOutlined, LayoutOutlined, 
  TeamOutlined, ShopOutlined, HomeOutlined, ShareAltOutlined,
  StarOutlined, CalendarOutlined as CalendarAddOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import publicExhibitionService, { PublicExhibition } from '../../../services/publicExhibition';
import GlobalHeader from '../../../components/layout/GlobalHeader';
import { getExhibitionUrl } from '../../../utils/url';
import api from '../../../services/api';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// Helper to get optimized image URL
const getOptimizedImageUrl = (path: string | undefined): string => {
  if (!path) return '';
  
  // Check if the path is a relative path to the API or an absolute URL
  if (path.startsWith('http')) {
    return path;
  }
  
  // Clean any leading slashes
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Check if the path includes logos or sponsors directory - use public endpoint with no auth
  if (normalizedPath.includes('logos/') || normalizedPath.includes('sponsors/')) {
    return `${api.defaults.baseURL}/public/images/${normalizedPath}`;
  }
  
  // For non-logo/sponsor images, use the regular authenticated endpoint
  // Get auth token from localStorage if available
  const token = localStorage.getItem('token');
  
  // Create the full path for non-logo images
  const imagePath = `uploads/${normalizedPath}`;
    
  // For authenticated images, include the token
  if (token) {
    return `${api.defaults.baseURL}/${imagePath}?token=${token}`;
  } else {
    return `${api.defaults.baseURL}/${imagePath}`;
  }
};

// Get the status of an exhibition (upcoming, active, or completed)
const getExhibitionStatus = (startDate: string, endDate: string): {status: string, color: string} => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) {
    return { status: 'Upcoming', color: '#722ED1' }; // Purple
  } else if (now > end) {
    return { status: 'Completed', color: '#8C8C8C' }; // Gray
  } else {
    return { status: 'Active', color: '#52C41A' }; // Green
  }
};

// Format date to be more readable
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calculate days remaining or days passed
const getDaysInfo = (startDate: string, endDate: string): {text: string, count: number, isPast: boolean} => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) {
    // Upcoming exhibition
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      text: `Day${diffDays !== 1 ? 's' : ''} until start`,
      count: diffDays,
      isPast: false
    };
  } else if (now > end) {
    // Past exhibition
    const diffTime = now.getTime() - end.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      text: `Day${diffDays !== 1 ? 's' : ''} since end`,
      count: diffDays,
      isPast: true
    };
  } else {
    // Active exhibition
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      text: `Day${diffDays !== 1 ? 's' : ''} remaining`,
      count: diffDays,
      isPast: false
    };
  }
};

const PublicExhibitionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState<PublicExhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string>('https://images.unsplash.com/photo-1567419099214-0dd03b43e8de?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  const [stallStats, setStallStats] = useState({
    total: 0,
    available: 0,
    booked: 0,
    percentage: 0
  });

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        if (!id) {
          setError('Exhibition ID is missing');
          return;
        }
        setLoading(true);
        setError(null);
        
        // Fetch both exhibition details and layout data for stall statistics
        const [exhibitionResponse, layoutResponse] = await Promise.all([
          publicExhibitionService.getExhibition(id),
          publicExhibitionService.getLayout(id).catch(() => null) // Layout might not exist
        ]);
        
        setExhibition(exhibitionResponse.data);
        
        // Calculate stall statistics from layout data
        if (layoutResponse?.data?.layout) {
          const allStalls = layoutResponse.data.layout.flatMap(hall => hall.stalls || []);
          const total = allStalls.length;
          const available = allStalls.filter(stall => stall.status === 'available').length;
          const booked = allStalls.filter(stall => stall.status === 'booked').length;
          const percentage = total > 0 ? Math.round((available / total) * 100) : 0;
          
          setStallStats({ total, available, booked, percentage });
        }
        
        // Set background image if available
        if ((exhibitionResponse.data as any).headerBackground) {
          const imageUrl = getOptimizedImageUrl((exhibitionResponse.data as any).headerBackground);
          setBgImage(imageUrl);
          
          // Preload background image
          const imgElement = new (window as any).Image();
          imgElement.src = imageUrl;
        } else if (exhibitionResponse.data.headerLogo) {
          // If no header image is available, we can try to use the logo
          const logoUrl = getOptimizedImageUrl(exhibitionResponse.data.headerLogo);
          // Just preload the logo, but don't set it as background
          const imgElement = new (window as any).Image();
          imgElement.src = logoUrl;
        }
      } catch (error: any) {
        console.error('Error fetching exhibition:', error);
        setError(error.message || 'Error fetching exhibition');
      } finally {
        setLoading(false);
      }
    };

    fetchExhibition();
  }, [id]);

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: exhibition?.name || 'Exhibition',
      text: exhibition?.description || 'Check out this exhibition',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Add to calendar functionality
  const handleAddToCalendar = () => {
    if (!exhibition) return;
    
    const startDate = new Date(exhibition.startDate);
    const endDate = new Date(exhibition.endDate);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(exhibition.name)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(exhibition.description)}&location=${encodeURIComponent(exhibition.venue || '')}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  if (loading) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Loading exhibition details...</p>
          </div>
        </Content>
      </Layout>
    );
  }
  
  if (error || !exhibition) {
    // Check if the error is about exhibition not being available
    const isNotAvailable = error && (
      error.includes('not found') || 
      error.includes('no longer available') ||
      error.includes('404')
    );
    
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <Result
            status="404"
            title={isNotAvailable ? "Exhibition No Longer Available" : "Exhibition Not Found"}
            subTitle={
              isNotAvailable 
                ? "This exhibition is no longer available or has been deactivated. It may have been removed by the organizer."
                : (error || "The exhibition you're looking for doesn't exist or has been removed.")
            }
            extra={
              <Button type="primary" onClick={() => navigate('/exhibitions')}>
                Back to Exhibitions
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  const { status, color } = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
  const daysInfo = getDaysInfo(exhibition.startDate, exhibition.endDate);

  return (
    <Layout className="exhibition-details-layout">
      <GlobalHeader />
      <Content className="exhibition-content">
        {/* Breadcrumb */}
        <div className="breadcrumb-container">
          <Breadcrumb 
            items={[
              { title: <Link to="/"><HomeOutlined /></Link> },
              { title: <Link to="/exhibitions">Exhibitions</Link> },
              { title: exhibition.name }
            ]}
          />
        </div>
        
        {/* Hero Section */}
        <div className="exhibition-hero" style={{
          backgroundImage: `url('${bgImage}')`
        }}>
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="hero-main">
                <Title level={1} className="exhibition-title">
                  {exhibition.name}
                </Title>
                
                <Space size={24} className="exhibition-meta">
                  <div className="meta-item">
                    <CalendarOutlined />
                    <Text>
                      {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                    </Text>
                  </div>
                  
                  {exhibition.venue && (
                    <div className="meta-item">
                      <EnvironmentOutlined />
                      <Text>{exhibition.venue}</Text>
                    </div>
                  )}
                  
                  <div className="meta-item">
                    <ClockCircleOutlined />
                    <Text>{daysInfo.text}: <strong>{daysInfo.count}</strong></Text>
                  </div>
                </Space>
              </div>
              
              <div className="hero-actions">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<LayoutOutlined />}
                  onClick={() => navigate(`/exhibitions/${id}/layout`)}
                  className="action-button layout-button"
                >
                  View Exhibition Layout
                </Button>
                
                <Button
                  size="large"
                  icon={<ShopOutlined />}
                  onClick={() => navigate(`/exhibitions/${id}/layout`)}
                  className="action-button book-button"
                >
                  Book a Stall
                </Button>
                
                {daysInfo.isPast ? null : (
                  <Button
                    size="large"
                    icon={<TeamOutlined />}
                    onClick={() => navigate('/exhibitor/login')}
                    className="action-button exhibitor-button"
                  >
                    Exhibitor Access
                  </Button>
                )}
                
                {/* New action buttons */}
                <Button
                  size="large"
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                  className="action-button share-button"
                >
                  Share
                </Button>
                
                <Button
                  size="large"
                  icon={<CalendarAddOutlined />}
                  onClick={handleAddToCalendar}
                  className="action-button calendar-button"
                >
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Section */}
        <div className="stats-container">
          <Row gutter={[16, 16]} className="stats-row">
            <Col xs={24} sm={6}>
              <div className="stat-card">
                <div className="stat-icon duration-icon">
                  <CalendarOutlined />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{Math.ceil((new Date(exhibition.endDate).getTime() - new Date(exhibition.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}</div>
                  <div className="stat-label">Days Duration</div>
                </div>
              </div>
            </Col>
            
            <Col xs={24} sm={6}>
              <div className="stat-card">
                <div className="stat-icon countdown-icon">
                  <ClockCircleOutlined />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{daysInfo.count}</div>
                  <div className="stat-label">{daysInfo.text}</div>
                </div>
              </div>
            </Col>
            
            <Col xs={24} sm={6}>
              <div className="stat-card">
                <div className="stat-icon status-icon" style={{ backgroundColor: color + '20', color: color }}>
                  <InfoCircleOutlined />
                </div>
                <div className="stat-content">
                  <div className="stat-value status-value" style={{ color }}>{status}</div>
                  <div className="stat-label">Status</div>
                </div>
              </div>
            </Col>
            
            {/* New stall availability stat */}
            <Col xs={24} sm={6}>
              <div className="stat-card">
                <div className="stat-icon availability-icon">
                  <ShopOutlined />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stallStats.available}</div>
                  <div className="stat-label">Available Stalls</div>
                  {stallStats.total > 0 && (
                    <Progress 
                      percent={stallStats.percentage} 
                      size="small" 
                      strokeColor="#52c41a"
                      style={{ marginTop: 4 }}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* Sponsor Logos Section */}
        {exhibition.sponsorLogos && exhibition.sponsorLogos.length > 0 && (
          <div className="sponsors-section">
            <div className="sponsors-header">
              <Text type="secondary">PROUDLY SPONSORED BY</Text>
            </div>
            <div className="sponsors-container">
              {exhibition.sponsorLogos.map((logo, index) => (
                <div key={index} className="sponsor-logo-wrapper">
                  <div className="sponsor-logo">
                    <img 
                      src={getOptimizedImageUrl(logo)} 
                      alt={`Sponsor ${index + 1}`} 
                      className="sponsor-logo-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-logo.png';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="exhibition-details-container">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card className="details-card about-card" bordered={false}>
                <Title level={3} className="section-title">About This Exhibition</Title>
                
                <Paragraph className="main-description">
                  {exhibition.description}
                </Paragraph>
                
                {exhibition.headerDescription && (
                  <Paragraph className="extended-description">
                    {exhibition.headerDescription}
                  </Paragraph>
                )}

                {exhibition.headerSubtitle && (
                  <div className="subtitle-section">
                    <Title level={4}>{exhibition.headerSubtitle}</Title>
                    <Divider />
                  </div>
                )}
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: '100%' }} size={24}>
                <Card title="Key Information" className="details-card info-card" bordered={false}>
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-icon start-icon">
                        <CalendarOutlined />
                      </div>
                      <div className="info-content">
                        <Text type="secondary" className="info-label">Start Date</Text>
                        <div className="info-value">{formatDate(exhibition.startDate)}</div>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-icon end-icon">
                        <CalendarOutlined />
                      </div>
                      <div className="info-content">
                        <Text type="secondary" className="info-label">End Date</Text>
                        <div className="info-value">{formatDate(exhibition.endDate)}</div>
                      </div>
                    </div>
                    
                    {exhibition.venue && (
                      <div className="info-item">
                        <div className="info-icon venue-icon">
                          <EnvironmentOutlined />
                        </div>
                        <div className="info-content">
                          <Text type="secondary" className="info-label">Venue</Text>
                          <div className="info-value">{exhibition.venue}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* New stall information */}
                    {stallStats.total > 0 && (
                      <div className="info-item">
                        <div className="info-icon stall-info-icon">
                          <ShopOutlined />
                        </div>
                        <div className="info-content">
                          <Text type="secondary" className="info-label">Stall Availability</Text>
                          <div className="info-value">
                            {stallStats.available} of {stallStats.total} available
                          </div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {stallStats.booked} already booked
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Space>
            </Col>
          </Row>
        </div>
      </Content>
      
      <style>
        {`
        .exhibition-details-layout {
          background-color: #f9fafc;
        }
        
        .exhibition-content {
          padding-top: 64px;
          min-height: calc(100vh - 64px);
        }
        
        .breadcrumb-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 16px 24px;
        }
        
        /* Hero Section */
        .exhibition-hero {
          height: 500px;
          background-size: cover;
          background-position: center;
          position: relative;
          color: white;
          margin-bottom: 0;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(20, 20, 40, 0.7), rgba(20, 20, 40, 0.9));
          display: flex;
          align-items: center;
        }
        
        .hero-content {
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .hero-main {
          max-width: 800px;
        }
        
        .exhibition-title {
          color: #fff !important;
          margin-bottom: 32px !important;
          font-size: 3.5rem !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .exhibition-meta {
          margin-bottom: 24px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .meta-item .anticon {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .meta-item span {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
        }
        
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .action-button {
          padding: 0 24px;
          height: 48px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .layout-button {
          background: #4361ee;
          border-color: #4361ee;
        }
        
        .layout-button:hover {
          background: #3a56d4;
          border-color: #3a56d4;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(67, 97, 238, 0.25);
        }
        
        .book-button {
          background: white;
          color: #111;
          border-color: transparent;
        }
        
        .book-button:hover {
          background: #f8f9fa;
          color: #4361ee;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        }
        
        .exhibitor-button {
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
          background: transparent;
        }
        
        .exhibitor-button:hover {
          border-color: white;
          color: white;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .share-button {
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
          background: transparent;
        }
        
        .share-button:hover {
          border-color: white;
          color: white;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .calendar-button {
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
          background: transparent;
        }
        
        .calendar-button:hover {
          border-color: white;
          color: white;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        /* Stats Section */
        .stats-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          margin-top: -50px;
          margin-bottom: 40px;
          position: relative;
          z-index: 5;
        }
        
        .stats-row {
          margin: 0;
        }
        
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          display: flex;
          gap: 20px;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .duration-icon {
          background-color: #4361ee20;
          color: #4361ee;
        }
        
        .countdown-icon {
          background-color: #f7257520;
          color: #f72575;
        }
        
        .availability-icon {
          background-color: #52c41a20;
          color: #52c41a;
        }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          color: #111827;
        }
        
        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }
        
        /* Sponsor Logos Styles */
        .sponsors-section {
          max-width: 1280px;
          margin: 0 auto 40px;
          padding: 36px 24px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }
        
        .sponsors-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .sponsors-header .ant-typography {
          font-size: 14px;
          letter-spacing: 2px;
          font-weight: 600;
          color: #6b7280;
          position: relative;
          display: inline-block;
        }
        
        .sponsors-header .ant-typography:before,
        .sponsors-header .ant-typography:after {
          content: "";
          position: absolute;
          top: 50%;
          width: 40px;
          height: 1px;
          background: #e5e7eb;
        }
        
        .sponsors-header .ant-typography:before {
          right: 100%;
          margin-right: 15px;
        }
        
        .sponsors-header .ant-typography:after {
          left: 100%;
          margin-left: 15px;
        }
        
        .sponsors-container {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          justify-content: center;
          align-items: center;
        }
        
        .sponsor-logo-wrapper {
          display: inline-flex;
          transition: transform 0.3s ease;
        }
        
        .sponsor-logo-wrapper:hover {
          transform: translateY(-5px);
        }
        
        .sponsor-logo {
          width: 190px;
          height: auto;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 20px;
          transition: box-shadow 0.3s ease;
        }
        
        .sponsor-logo:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }
        
        .sponsor-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        /* Details Section */
        .exhibition-details-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 60px;
        }
        
        .details-card {
          border-radius: 16px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          height: 100%;
        }
        
        .about-card .ant-card-body {
          padding: 32px;
        }
        
        .section-title {
          margin-bottom: 24px !important;
          font-weight: 700 !important;
          color: #111827 !important;
          font-size: 28px !important;
          position: relative;
        }
        
        .section-title:after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -12px;
          width: 60px;
          height: 4px;
          background: #4361ee;
          border-radius: 2px;
        }
        
        .main-description {
          font-size: 16px !important;
          line-height: 1.7 !important;
          margin-bottom: 24px !important;
          color: #374151 !important;
        }
        
        .extended-description {
          font-size: 16px !important;
          line-height: 1.7 !important;
          margin-bottom: 24px !important;
          color: #6b7280 !important;
        }
        
        .subtitle-section {
          margin: 24px 0;
        }
        
        .subtitle-section .ant-typography {
          color: #111827;
          font-weight: 600;
        }
        
        .info-card .ant-card-head {
          border-bottom: none;
          padding: 20px 24px 0;
        }
        
        .info-card .ant-card-head-title {
          font-weight: 600;
          font-size: 18px;
          color: #111827;
        }
        
        .info-card .ant-card-body {
          padding: 16px 24px 24px;
        }
        
        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        
        .info-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        
        .start-icon {
          background-color: #4361ee20;
          color: #4361ee;
        }
        
        .end-icon {
          background-color: #f7257520;
          color: #f72575;
        }
        
        .venue-icon {
          background-color: #0ea5e920;
          color: #0ea5e9;
        }
        
        .stall-info-icon {
          background-color: #52c41a20;
          color: #52c41a;
        }
        
        .info-content {
          flex: 1;
        }
        
        .info-label {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .info-value {
          font-size: 16px;
          font-weight: 500;
          color: #111827;
        }
        
        @media (max-width: 991px) {
          .exhibition-hero {
            height: auto;
            min-height: 350px;
          }
          
          .hero-overlay {
            position: relative;
            padding: 50px 0;
          }
          
          .exhibition-title {
            font-size: 2.5rem !important;
          }
          
          .stats-container {
            margin-top: 0;
          }
          
          .stat-card {
            margin-bottom: 16px;
          }
        }
        
        @media (max-width: 768px) {
          .exhibition-title {
            font-size: 2rem !important;
            margin-bottom: 24px !important;
          }
          
          .hero-content {
            padding: 40px 20px;
          }
          
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          
          .hero-actions button {
            width: 100%;
          }
          
          .sponsors-container {
            gap: 20px;
          }
          
          .sponsor-logo {
            width: 150px;
          }
          
          .stats-container {
            padding: 0 16px;
          }
          
          .stat-card {
            padding: 16px;
          }
          
          .stat-icon {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
          
          .stat-value {
            font-size: 22px;
          }
          
          .exhibition-details-container {
            padding: 0 16px 40px;
          }
          
          .about-card .ant-card-body {
            padding: 24px;
          }
          
          .section-title {
            font-size: 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          .exhibition-title {
            font-size: 1.75rem !important;
          }
          
          .meta-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
        `}
      </style>
    </Layout>
  );
};

export default PublicExhibitionDetails; 