import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tag, Button, Skeleton } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, ArrowRightOutlined, RightCircleOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import publicExhibitionService from '../../../services/publicExhibition';
import { getPublicExhibitionUrl } from '../../../utils/url';
import api from '../../../services/api';

const { Title, Paragraph, Text } = Typography;

// Helper to get optimized image URL with fallback
const getOptimizedImageUrl = (logoPath: string | undefined): string => {
  if (!logoPath) {
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400&h=200';
  }
  
  // If it's already a full URL, return as is
  if (logoPath.startsWith('http')) {
    return logoPath;
  }
  
  // If it starts with /, it's a relative path from root
  if (logoPath.startsWith('/')) {
    return `${api.defaults.baseURL}${logoPath}`;
  }
  
  // Otherwise, construct the full URL
  return `${api.defaults.baseURL}/public/images/${logoPath}`;
};

// Styled Components
const FeaturedSection = styled.div`
  padding: 120px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const SectionContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const SectionTitle = styled(Title)`
  margin-bottom: 20px !important;
  font-size: 3rem !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem !important;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem !important;
  }
`;

const SectionSubtitle = styled(Paragraph)`
  font-size: 1.2rem !important;
  color: #666 !important;
  max-width: 600px;
  margin: 0 auto !important;
  line-height: 1.6 !important;
  
  @media (max-width: 768px) {
    font-size: 1.1rem !important;
  }
`;

const ExhibitionCard = styled(Card)`
  height: 100%;
  border-radius: 24px !important;
  overflow: hidden !important;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
  border: none !important;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px) !important;
  position: relative;
  
  &:hover {
    transform: translateY(-15px) !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
  }
  
  .ant-card-cover {
    overflow: hidden;
    position: relative;
  }
  
  .ant-card-cover img {
    transition: transform 0.6s ease !important;
    filter: brightness(0.95);
  }
  
  &:hover .ant-card-cover img {
    transform: scale(1.08) !important;
    filter: brightness(1);
  }
  
  .ant-card-body {
    padding: 30px !important;
    position: relative;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 1;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const StatusBadge = styled.div<{ status: string }>`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  
  ${props => {
    switch (props.status) {
      case 'Active':
        return `
          background: rgba(82, 196, 26, 0.9);
          color: white;
          box-shadow: 0 4px 15px rgba(82, 196, 26, 0.3);
        `;
      case 'Upcoming':
        return `
          background: rgba(114, 46, 209, 0.9);
          color: white;
          box-shadow: 0 4px 15px rgba(114, 46, 209, 0.3);
        `;
      default:
        return `
          background: rgba(140, 140, 140, 0.9);
          color: white;
          box-shadow: 0 4px 15px rgba(140, 140, 140, 0.3);
        `;
    }
  }}
`;

const ExhibitionTitle = styled(Title)`
  margin-bottom: 16px !important;
  font-size: 1.4rem !important;
  font-weight: 600 !important;
  color: #333 !important;
  line-height: 1.3 !important;
  min-height: 56px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ExhibitionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
  
  .anticon {
    color: #667eea;
    font-size: 16px;
  }
`;

const ExhibitionDescription = styled(Paragraph)`
  color: #666 !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  margin-bottom: 20px !important;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const ViewButton = styled(Button)`
  border: none !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  height: 36px !important;
  padding: 0 16px !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
  }
`;

const ViewAllSection = styled.div`
  text-align: center;
  margin-top: 80px;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    margin-top: 60px;
    padding: 40px 20px;
  }
`;

const ViewAllButton = styled(Button)`
  height: 56px !important;
  padding: 0 40px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1) !important;
  
  &:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
`;

interface Exhibition {
  _id: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  headerLogo?: string;
}

const FeaturedExhibitions: React.FC = () => {
  const navigate = useNavigate();
  const [featuredExhibitions, setFeaturedExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setLoading(true);
        const response = await publicExhibitionService.getExhibitions();
        const exhibitions = response.data || [];
        setFeaturedExhibitions(exhibitions.slice(0, 4)); // Show first 4 exhibitions
      } catch (error) {
        console.error('Failed to fetch exhibitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getExhibitionStatus = (startDate: string, endDate: string): {status: string, color: string} => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return { status: 'Upcoming', color: '#722ED1' };
    } else if (now > end) {
      return { status: 'Completed', color: '#8C8C8C' };
    } else {
      return { status: 'Active', color: '#52C41A' };
    }
  };

  return (
    <FeaturedSection>
      <SectionContent>
        <SectionHeader>
          <SectionTitle level={2}>Featured Exhibitions</SectionTitle>
          <SectionSubtitle>
            Discover premium exhibition opportunities and secure your perfect space at industry-leading events
          </SectionSubtitle>
        </SectionHeader>
        
        {loading ? (
          <Row gutter={[32, 32]}>
            {[1, 2, 3, 4].map(i => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <Card 
                  style={{ 
                    borderRadius: '24px', 
                    height: '400px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : featuredExhibitions.length > 0 ? (
          <Row gutter={[32, 32]}>
            {featuredExhibitions.map((exhibition, index) => {
              const { status } = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
              return (
                <Col xs={24} sm={12} lg={6} key={exhibition._id}>
                  <ExhibitionCard
                    onClick={() => navigate(getPublicExhibitionUrl(exhibition))}
                    cover={
                      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                        <img 
                          alt={exhibition.name} 
                          src={getOptimizedImageUrl(exhibition.headerLogo)}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain'
                          }} 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Fallback to a different exhibition-themed image
                            target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400&h=200';
                          }}
                        />
                        <ImageOverlay />
                        <StatusBadge status={status}>{status}</StatusBadge>
                        {index === 0 && (
                          <FeaturedBadge>Featured</FeaturedBadge>
                        )}
                      </div>
                    }
                    hoverable
                  >
                    <ExhibitionTitle level={5}>
                      {exhibition.name}
                    </ExhibitionTitle>
                    
                    <ExhibitionMeta>
                      <CalendarOutlined />
                      <Text>
                        {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                      </Text>
                    </ExhibitionMeta>
                    
                    {exhibition.venue && (
                      <ExhibitionMeta>
                        <EnvironmentOutlined />
                        <Text ellipsis style={{ flex: 1 }}>
                          {exhibition.venue}
                        </Text>
                      </ExhibitionMeta>
                    )}
                    
                    <ExhibitionDescription>
                      {exhibition.description || 'Join us for an exciting exhibition experience with industry leaders and innovative solutions.'}
                    </ExhibitionDescription>
                    
                    <CardFooter>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#666', fontSize: '12px' }}>
                        <UserOutlined style={{ fontSize: '14px' }} />
                        <span>Open for booking</span>
                      </div>
                      <ViewButton icon={<EyeOutlined />}>
                        View Details
                      </ViewButton>
                    </CardFooter>
                  </ExhibitionCard>
                </Col>
              );
            })}
          </Row>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <CalendarOutlined />
            </EmptyIcon>
            <Title level={4} style={{ color: '#666', marginBottom: '16px' }}>
              No Exhibitions Available
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
              We're working on bringing you exciting exhibition opportunities. Check back soon!
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/exhibitions')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              Browse All Exhibitions
            </Button>
          </EmptyState>
        )}
        
        {featuredExhibitions.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <ViewAllButton 
              onClick={() => navigate('/exhibitions')}
              icon={<RightCircleOutlined />}
            >
              View All Exhibitions
            </ViewAllButton>
          </div>
        )}
      </SectionContent>
    </FeaturedSection>
  );
};

export default FeaturedExhibitions; 