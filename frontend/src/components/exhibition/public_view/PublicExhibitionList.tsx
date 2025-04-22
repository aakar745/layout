import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Empty, Spin, Result, Button, Typography, Layout, Tag, Badge, Tooltip, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CalendarOutlined, EnvironmentOutlined, ArrowRightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import publicExhibitionService, { PublicExhibition } from '../../../services/publicExhibition';
import GlobalHeader from '../../../components/layout/GlobalHeader';
import GlobalFooter from '../../../components/layout/GlobalFooter';
import { getExhibitionUrl, getPublicExhibitionUrl } from '../../../utils/url';
import api from '../../../services/api';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

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
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calculate days remaining until exhibition starts
const getDaysRemaining = (startDate: string): number => {
  const now = new Date();
  const start = new Date(startDate);
  const diffTime = start.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Generate optimized image URL with authentication token
const getOptimizedImageUrl = (logoPath: string | undefined): string => {
  if (!logoPath) return '/exhibition-placeholder.jpg';
  
  // For placeholder images, return as is
  if (logoPath.startsWith('/')) {
    return logoPath;
  }
  
  // Check if the path is an absolute URL
  if (logoPath.startsWith('http')) {
    return logoPath;
  }
  
  // Clean any leading slashes
  const normalizedPath = logoPath.startsWith('/') ? logoPath.substring(1) : logoPath;
  
  // Check if the path already includes the 'logos/' prefix
  const imagePath = normalizedPath.includes('logos/') 
    ? normalizedPath
    : `logos/${normalizedPath}`;
    
  // Use public endpoint for accessing logo images without authentication
  return `${api.defaults.baseURL}/public/images/${imagePath}`;
};

const PublicExhibitionList: React.FC = () => {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<PublicExhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await publicExhibitionService.getExhibitions();
        setExhibitions(response.data);
        
        // Preload images after setting exhibitions
        const imagePreloadMap: Record<string, boolean> = {};
        response.data.forEach(exhibition => {
          if (exhibition.headerLogo) {
            const imageUrl = getOptimizedImageUrl(exhibition.headerLogo);
            
            // Preload image with authentication if needed
            const imgElement = new (window as any).Image();
            
            // Set up load and error handlers
            imgElement.onload = () => {
              imagePreloadMap[exhibition._id] = true;
              setPreloadedImages(prev => ({...prev, [exhibition._id]: true}));
            };
            
            imgElement.onerror = () => {
              console.warn(`Failed to preload image: ${imageUrl}`);
              // Still mark as attempted to avoid repeated failures
              imagePreloadMap[exhibition._id] = false;
              setPreloadedImages(prev => ({...prev, [exhibition._id]: false}));
            };
            
            // Start loading the image
            imgElement.src = imageUrl;
          }
        });
      } catch (error: any) {
        setError(error.message || 'Failed to fetch exhibitions');
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  if (loading) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Loading exhibitions...</p>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <Result
            status="error"
            title="Failed to load exhibitions"
            subTitle={error}
            extra={[
              <Button type="primary" key="retry" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            ]}
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <GlobalHeader />
      <Content style={{ paddingTop: '64px', background: '#f5f5f5' }}>
        <div style={{ padding: '80px 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Title level={2} style={{ marginBottom: 12, fontSize: 36 }}>Upcoming & Current Exhibitions</Title>
            <Paragraph type="secondary" style={{ fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
              Discover and explore our exhibitions. Click on any card to view details and book stalls.
            </Paragraph>
          </div>
          
          {exhibitions.length > 0 ? (
            <Row gutter={[24, 24]}>
              {exhibitions.map(exhibition => {
                const { status, color } = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
                const daysRemaining = getDaysRemaining(exhibition.startDate);
                const imageUrl = exhibition.headerLogo ? getOptimizedImageUrl(exhibition.headerLogo) : undefined;
                
                return (
                  <Col xs={24} sm={12} lg={8} key={exhibition._id}>
                    <Card
                      hoverable
                      onClick={() => navigate(getPublicExhibitionUrl(exhibition))}
                      className="exhibition-card"
                      styles={{ 
                        body: { 
                          padding: '0',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        } 
                      }}
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '100%',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <Badge.Ribbon text={status} color={color} style={{ right: '-1px', top: '10px', zIndex: 2 }} />
                      
                      <div className="exhibition-card-container">
                        {/* Logo Section */}
                        <div className="exhibition-card-logo-container">
                          {imageUrl && (
                            <div className="exhibition-logo">
                              <Image
                                src={imageUrl}
                                alt={`${exhibition.name} logo`}
                                preview={false}
                                fallback="/exhibition-placeholder.jpg"
                                placeholder={
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    width: '100%', 
                                    height: '100%',
                                    backgroundColor: '#f0f0f0'
                                  }}>
                                    <Spin size="small" />
                                  </div>
                                }
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Details Section */}
                        <div className="exhibition-card-content">
                          <div className="exhibition-title">
                            <Title level={4} ellipsis={{ rows: 2 }} style={{ marginBottom: 8, fontSize: 20, lineHeight: '28px' }}>
                              {exhibition.name}
                            </Title>
                          </div>
                          
                          <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 16, fontSize: 14 }}>
                            {exhibition.description}
                          </Paragraph>
                          
                          <div className="exhibition-card-details">
                            <div className="exhibition-card-detail-item">
                              <CalendarOutlined style={{ color: '#722ED1' }} />
                              <Tooltip title="Exhibition Date Range">
                                <Text style={{ fontSize: 14 }}>
                                  {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                                </Text>
                              </Tooltip>
                            </div>
                            
                            {exhibition.venue && (
                              <div className="exhibition-card-detail-item">
                                <EnvironmentOutlined style={{ color: '#F5222D' }} />
                                <Tooltip title="Venue">
                                  <Text style={{ fontSize: 14 }} ellipsis>
                                    {exhibition.venue}
                                  </Text>
                                </Tooltip>
                              </div>
                            )}
                            
                            {status === 'Upcoming' && daysRemaining > 0 && (
                              <div className="exhibition-card-detail-item">
                                <ClockCircleOutlined style={{ color: '#1890FF' }} />
                                <Tooltip title="Time Remaining">
                                  <Text style={{ fontSize: 14 }}>
                                    Starts in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                                  </Text>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                          
                          <div className="exhibition-card-footer">
                            <Button 
                              type="link" 
                              className="view-details-btn"
                              style={{ 
                                padding: 0,
                                height: 'auto',
                                fontSize: 14, 
                                fontWeight: 500
                              }}
                            >
                              View Details <ArrowRightOutlined />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty 
              description="No exhibitions currently available" 
              style={{ 
                background: '#fff',
                padding: '48px',
                borderRadius: '12px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)'
              }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      </Content>
      <GlobalFooter />
      
      <style>
        {`
        .exhibition-card {
          transition: all 0.3s ease;
        }
        
        .exhibition-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.06) !important;
        }
        
        .exhibition-card-container {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 100%;
        }
        
        .exhibition-card-logo-container {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background-color: #f9f9f9;
          border-right: 1px solid #eaeaea;
        }
        
        .exhibition-logo {
          position: relative;
          flex-shrink: 0;
          width: 100%;
          height: 172px;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border: 1px solid #e8e8e8;
        }
        
        .exhibition-card-content {
          width: 50%;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        
        .exhibition-title {
          margin-right: 36px;
        }
        
        .exhibition-card-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }
        
        .exhibition-card-detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .exhibition-card-footer {
          margin-top: auto;
        }
        
        .view-details-btn {
          color: #722ED1;
        }
        
        .view-details-btn:hover {
          color: #9254DE;
        }
        
        .view-details-btn .anticon {
          transition: transform 0.3s ease;
        }
        
        .view-details-btn:hover .anticon {
          transform: translateX(4px);
        }
        
        @media (max-width: 575px) {
          .exhibition-card-container {
            flex-direction: column;
          }
          
          .exhibition-card-logo-container {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #eaeaea;
            padding: 20px;
          }
          
          .exhibition-logo {
            height: 140px;
          }
          
          .exhibition-card-content {
            width: 100%;
            padding: 20px;
          }
        }
        `}
      </style>
    </Layout>
  );
};

export default PublicExhibitionList; 