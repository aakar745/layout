import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Row, Col, Card, Divider, Space, Carousel, Statistic, Avatar, Tag, Skeleton } from "antd";
import { 
  ArrowRightOutlined, 
  CalendarOutlined, 
  ShopOutlined, 
  TeamOutlined, 
  EnvironmentOutlined, 
  CheckCircleOutlined,
  LayoutOutlined,
  UserOutlined,
  BankOutlined,
  RightCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import GlobalHeader from "../../components/layout/GlobalHeader";
import GlobalFooter from "../../components/layout/GlobalFooter";
import publicExhibitionService from "../../services/publicExhibition";
import { getPublicExhibitionUrl } from "../../utils/url";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { showLoginModal } from "../../store/slices/exhibitorAuthSlice";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

// Helper to get optimized image URL with public access
const getOptimizedImageUrl = (logoPath: string | undefined): string => {
  if (!logoPath) return '/exhibition-placeholder.jpg';
  
  if (logoPath.startsWith('/') || logoPath.startsWith('http')) {
    return logoPath;
  }
  
  const normalizedPath = logoPath.startsWith('/') ? logoPath.substring(1) : logoPath;
  
  // Check if the path includes logos or sponsors directory
  if (normalizedPath.includes('logos/') || normalizedPath.includes('sponsors/')) {
    return `${api.defaults.baseURL}/public/images/${normalizedPath}`;
  }
  
  return '/exhibition-placeholder.jpg';
};

// Styled components
const StyledContent = styled(Content)`
  padding-top: 64px;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  padding: 80px 0;
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const ExhibitionCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const SectionTitle = styled(Title)`
  position: relative;
  display: inline-block;
  margin-bottom: 48px !important;
  
  &:after {
    content: "";
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 60px;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, #4158D0, #C850C0);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 24px;
  font-size: 24px;
  
  & svg {
    font-size: 28px;
  }
`;

const StatisticCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const TestimonialCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const FeaturedTag = styled(Tag)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 50px;
`;

const CTAButton = styled(Button)`
  height: 50px;
  font-weight: 500;
  border-radius: 8px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &.ant-btn-primary {
    background: linear-gradient(90deg, #4158D0, #C850C0);
    border: none;
    
    &:hover {
      background: linear-gradient(90deg, #3a4ec0, #b745af);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  }
  
  &.secondary-btn {
    background: rgba(255, 255, 255, 0.9);
    color: #4158D0;
    border: none;
    
    &:hover {
      background: white;
      color: #C850C0;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  }
`;

const Section = styled.div`
  padding: 80px 0;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
  
  &.gray-bg {
    background: #f9fafb;
  }
  
  &.how-it-works {
    background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%);
  }
`;

const CircleNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4158D0, #C850C0);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
  font-size: 18px;
  flex-shrink: 0;
`;

interface HomeProps {
  exhibitorLoginMode?: boolean;
}

const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [featuredExhibitions, setFeaturedExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured/upcoming exhibitions
    const fetchExhibitions = async () => {
      try {
        setLoading(true);
        const response = await publicExhibitionService.getExhibitions();
        setFeaturedExhibitions(response.data.slice(0, 4)); // Take first 4 exhibitions
      } catch (error) {
        console.error("Failed to fetch exhibitions:", error);
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

  // Get exhibition status
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

  // Function to show the registration modal
  const showRegisterModal = () => {
    // Dispatch redux action to show login modal, then it will have a link to register
    dispatch(showLoginModal(undefined));
  };

  return (
    <Layout>
      <GlobalHeader />
      <StyledContent>
        {/* Hero Section */}
        <HeroSection>
          <HeroOverlay />
          <HeroContent>
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={14}>
                <Title level={1} style={{ fontSize: '3.5rem', marginBottom: 24, color: 'white', fontWeight: 700 }}>
                  Book Your Exhibition Space with Ease
                </Title>
                <Paragraph style={{ fontSize: '1.2rem', marginBottom: 40, color: 'rgba(255, 255, 255, 0.9)' }}>
                  Explore upcoming exhibitions, select your perfect stall, and secure your spot all in one place. Manage your exhibition presence effortlessly.
                </Paragraph>
                <Space size={16} wrap>
                  <CTAButton 
                    type="primary" 
                    size="large" 
                    onClick={() => navigate('/exhibitions')}
                    icon={<ArrowRightOutlined />}
                  >
                    Explore Exhibitions
                  </CTAButton>
                  <CTAButton 
                    className="secondary-btn" 
                    size="large" 
                    onClick={() => navigate('/exhibitor/login')}
                    icon={<UserOutlined />}
                  >
                    Exhibitor Portal
                  </CTAButton>
                </Space>
              </Col>
              <Col xs={24} lg={10}>
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3" 
                  alt="Exhibition Space" 
                  style={{ 
                    width: '100%', 
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    border: '4px solid rgba(255, 255, 255, 0.2)',
                    objectFit: 'cover',
                    height: '300px'
                  }} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Fallback to another image or gradient if the primary one fails
                    target.src = "https://images.unsplash.com/photo-1559223607-a43f990c43d5?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3";
                    
                    // If second image also fails
                    target.onerror = () => {
                      target.style.height = '300px';
                      target.style.background = 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)';
                      target.onerror = null; // Prevent infinite loop
                      
                      // Add a message
                      const parent = target.parentElement;
                      if (parent) {
                        const textDiv = document.createElement('div');
                        textDiv.style.position = 'absolute';
                        textDiv.style.top = '50%';
                        textDiv.style.left = '50%';
                        textDiv.style.transform = 'translate(-50%, -50%)';
                        textDiv.style.color = 'white';
                        textDiv.style.fontSize = '18px';
                        textDiv.style.fontWeight = 'bold';
                        textDiv.style.textAlign = 'center';
                        textDiv.textContent = 'Exhibition Venue';
                        parent.appendChild(textDiv);
                      }
                    };
                  }}
                />
              </Col>
            </Row>
          </HeroContent>
        </HeroSection>

        {/* Featured Exhibitions Section */}
        <Section>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <SectionTitle level={2}>Featured Exhibitions</SectionTitle>
            
            {loading ? (
              <Row gutter={[24, 24]}>
                {[1, 2, 3, 4].map(i => (
                  <Col xs={24} sm={12} lg={6} key={i}>
                    <Card style={{ borderRadius: '12px' }}>
                      <Skeleton active avatar paragraph={{ rows: 3 }} />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : featuredExhibitions.length > 0 ? (
              <Row gutter={[24, 24]}>
                {featuredExhibitions.map((exhibition, index) => {
                  const { status, color } = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
                  return (
                    <Col xs={24} sm={12} lg={6} key={exhibition._id}>
                      <ExhibitionCard
                        onClick={() => navigate(getPublicExhibitionUrl(exhibition))}
                        cover={
                          <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                            <img 
                              alt={exhibition.name} 
                              src={exhibition.headerLogo ? getOptimizedImageUrl(exhibition.headerLogo) : '/exhibition-placeholder.jpg'}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                filter: 'brightness(0.95)'
                              }} 
                            />
                            <Tag color={color} style={{ position: 'absolute', top: 12, left: 12, borderRadius: '50px', padding: '2px 12px' }}>
                              {status}
                            </Tag>
                            {index === 0 && (
                              <FeaturedTag color="#f50">Featured</FeaturedTag>
                            )}
                          </div>
                        }
                        hoverable
                      >
                        <Title level={5} ellipsis={{ rows: 1 }} style={{ marginBottom: 8 }}>
                          {exhibition.name}
                        </Title>
                        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CalendarOutlined style={{ color: '#4158D0' }} />
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                          </Text>
                        </div>
                        {exhibition.venue && (
                          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <EnvironmentOutlined style={{ color: '#C850C0' }} />
                            <Text type="secondary" style={{ fontSize: 13 }} ellipsis>
                              {exhibition.venue}
                            </Text>
                          </div>
                        )}
                        <Button type="link" style={{ padding: 0, height: 'auto' }} icon={<ArrowRightOutlined />}>
                          View Details
                        </Button>
                      </ExhibitionCard>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Paragraph>No exhibitions available at the moment. Check back soon!</Paragraph>
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={() => navigate('/exhibitions')}
                icon={<RightCircleOutlined />}
              >
                View All Exhibitions
              </Button>
            </div>
          </div>
        </Section>

        {/* How to Book Stall Section */}
        <Section className="how-it-works">
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <SectionTitle level={2}>How to Book Stall</SectionTitle>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
              <Paragraph style={{ fontSize: '18px', color: '#666', fontWeight: 500 }}>
                Secure your exhibition space in just a few simple steps. Our streamlined booking process makes it easy to showcase your business at premier events.
              </Paragraph>
            </div>
            
            <div className="booking-steps">
              {/* Process indicator at the top showing 7 steps */}
              <div className="step-indicator">
                <div className="step-dots">
                  {[1, 2, 3, 4, 5, 6, 7].map(step => (
                    <div key={step} className="step-dot-container">
                      <div className="step-dot">{step}</div>
                      <div className="step-label">{`Step ${step}`}</div>
                    </div>
                  ))}
                  <div className="step-progress-line"></div>
                </div>
              </div>
              
              {/* Step Cards */}
              <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <div className="step-card">
                    <div className="step-card-header">
                      <div className="step-number">1</div>
                      <div className="step-icon">
                        <UserOutlined />
                      </div>
                    </div>
                    <div className="step-card-body">
                      <Title level={5}>Register</Title>
                      <Paragraph>
                        The exhibitor must first register on the platform with company details and contact information.
                      </Paragraph>
                    </div>
                  </div>
                </Col>
                
                <Col xs={24} md={12} lg={8} xl={6}>
                  <div className="step-card">
                    <div className="step-card-header">
                      <div className="step-number">2</div>
                      <div className="step-icon">
                        <CheckCircleOutlined />
                      </div>
                    </div>
                    <div className="step-card-body">
                      <Title level={5}>Admin Approval</Title>
                      <Paragraph>
                        After registration, the admin will review and approve your account. You'll receive a notification.
                      </Paragraph>
                    </div>
                  </div>
                </Col>
                
                <Col xs={24} md={12} lg={8} xl={6}>
                  <div className="step-card">
                    <div className="step-card-header">
                      <div className="step-number">3</div>
                      <div className="step-icon">
                        <ShopOutlined />
                      </div>
                    </div>
                    <div className="step-card-body">
                      <Title level={5}>Login & Book Stall</Title>
                      <Paragraph>
                        Once approved, log in and select a stall from the interactive layout map.
                      </Paragraph>
                    </div>
                  </div>
                </Col>
                
                <Col xs={24} md={12} lg={8} xl={6}>
                  <div className="step-card">
                    <div className="step-card-header">
                      <div className="step-number">4</div>
                      <div className="step-icon">
                        <ClockCircleOutlined />
                      </div>
                    </div>
                    <div className="step-card-body">
                      <Title level={5}>Stall Goes to Reserved</Title>
                      <Paragraph>
                        After booking, the stall status changes to "Reserved" and will be temporarily held for you.
                      </Paragraph>
                    </div>
                  </div>
                </Col>
                
                <Col xs={24} md={12} lg={8} xl={6}>
                  <div className="step-card">
                    <div className="step-card-header">
                      <div className="step-number">5</div>
                      <div className="step-icon">
                        <CheckCircleOutlined />
                      </div>
                    </div>
                    <div className="step-card-body">
                      <Title level={5}>Admin Final Approval</Title>
                      <Paragraph>
                        The admin will review your reservation request and approve it based on availability.
                      </Paragraph>
                    </div>
                  </div>
                </Col>
                
                <Col xs={24} md={12} lg={8} xl={6}>
                  <div className="step-card">
                    <div className="step-card-header">
                      <div className="step-number">6</div>
                      <div className="step-icon">
                        <CheckCircleOutlined />
                      </div>
                    </div>
                    <div className="step-card-body">
                      <Title level={5}>Stall Becomes Booked</Title>
                      <Paragraph>
                        After admin approval, the stall status changes to "Booked" and an invoice is generated.
                      </Paragraph>
                    </div>
                  </div>
                </Col>
                
                <Col xs={24} md={12} lg={8} xl={6}>
                  <div className="step-card">
                    <div className="step-card-header">
                      <div className="step-number">7</div>
                      <div className="step-icon">
                        <BankOutlined />
                      </div>
                    </div>
                    <div className="step-card-body">
                      <Title level={5}>Make Payment in 3 Days</Title>
                      <Paragraph>
                        Complete your payment within 3 days of booking to confirm your stall reservation.
                      </Paragraph>
                    </div>
                  </div>
                </Col>
              </Row>
              
              {/* Add custom CSS for styling the steps */}
              <style>
                {`
                  .booking-steps {
                    margin-top: 20px;
                  }
                  
                  .step-indicator {
                    margin-bottom: 30px;
                    padding: 0 40px;
                  }
                  
                  .step-dots {
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    max-width: 800px;
                    margin: 0 auto;
                  }
                  
                  .step-progress-line {
                    position: absolute;
                    top: 25px;
                    left: 50px;
                    right: 50px;
                    height: 3px;
                    background: linear-gradient(90deg, #4158D0, #C850C0);
                    z-index: 0;
                  }
                  
                  .step-dot-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    z-index: 1;
                  }
                  
                  .step-dot {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4158D0, #C850C0);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 20px;
                    margin-bottom: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  }
                  
                  .step-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #666;
                  }
                  
                  .step-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    height: 100%;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #f0f0f0;
                  }
                  
                  .step-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
                  }
                  
                  .step-card-header {
                    background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%);
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    border-bottom: 1px solid #f0f0f0;
                  }
                  
                  .step-number {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4158D0, #C850C0);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 16px;
                  }
                  
                  .step-icon {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    color: #4158D0;
                  }
                  
                  .step-card-body {
                    padding: 16px;
                    flex: 1;
                  }
                  
                  .step-card-body h5 {
                    margin-bottom: 8px;
                  }
                  
                  .step-card-body p {
                    margin-bottom: 0;
                    color: #666;
                  }
                  
                  @media (max-width: 768px) {
                    .step-progress-line {
                      display: none;
                    }
                    
                    .step-dots {
                      display: none;
                    }
                  }
                `}
              </style>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: 60 }}>
              <CTAButton 
                type="primary" 
                size="large" 
                onClick={showRegisterModal}
                icon={<UserOutlined />}
              >
                Register as Exhibitor
              </CTAButton>
            </div>
          </div>
        </Section>

        {/* Features Section */}
        <Section>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <SectionTitle level={2}>Why Choose Us</SectionTitle>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={8}>
                <FeatureCard>
                  <FeatureIcon style={{ background: 'rgba(65, 88, 208, 0.1)', color: '#4158D0' }}>
                    <LayoutOutlined />
                  </FeatureIcon>
                  <Title level={4}>Interactive Layouts</Title>
                  <Paragraph style={{ fontSize: 16 }}>
                    Explore detailed exhibition floor plans with interactive maps to find your perfect spot.
                  </Paragraph>
                </FeatureCard>
              </Col>
              
              <Col xs={24} sm={12} lg={8}>
                <FeatureCard>
                  <FeatureIcon style={{ background: 'rgba(200, 80, 192, 0.1)', color: '#C850C0' }}>
                    <ShopOutlined />
                  </FeatureIcon>
                  <Title level={4}>Real-time Availability</Title>
                  <Paragraph style={{ fontSize: 16 }}>
                    See stall availability in real-time and book instantly without any delays or confusion.
                  </Paragraph>
                </FeatureCard>
              </Col>
              
              <Col xs={24} sm={12} lg={8}>
                <FeatureCard>
                  <FeatureIcon style={{ background: 'rgba(255, 204, 112, 0.1)', color: '#FFCC70' }}>
                    <BankOutlined />
                  </FeatureIcon>
                  <Title level={4}>Secure Payments</Title>
                  <Paragraph style={{ fontSize: 16 }}>
                    Complete your bookings with our secure payment gateway and receive instant confirmation.
                  </Paragraph>
                </FeatureCard>
              </Col>
              
              <Col xs={24} sm={12} lg={8}>
                <FeatureCard>
                  <FeatureIcon style={{ background: 'rgba(82, 196, 26, 0.1)', color: '#52c41a' }}>
                    <TeamOutlined />
                  </FeatureIcon>
                  <Title level={4}>Exhibitor Dashboard</Title>
                  <Paragraph style={{ fontSize: 16 }}>
                    Manage all your bookings, payments, and exhibition details through our user-friendly dashboard.
                  </Paragraph>
                </FeatureCard>
              </Col>
              
              <Col xs={24} sm={12} lg={8}>
                <FeatureCard>
                  <FeatureIcon style={{ background: 'rgba(250, 140, 22, 0.1)', color: '#fa8c16' }}>
                    <CalendarOutlined />
                  </FeatureIcon>
                  <Title level={4}>Schedule Management</Title>
                  <Paragraph style={{ fontSize: 16 }}>
                    Keep track of important dates, setup times, and exhibition schedules all in one place.
                  </Paragraph>
                </FeatureCard>
              </Col>
              
              <Col xs={24} sm={12} lg={8}>
                <FeatureCard>
                  <FeatureIcon style={{ background: 'rgba(24, 144, 255, 0.1)', color: '#1890ff' }}>
                    <CheckCircleOutlined />
                  </FeatureIcon>
                  <Title level={4}>Support & Assistance</Title>
                  <Paragraph style={{ fontSize: 16 }}>
                    Get expert assistance throughout the booking process and during the exhibition.
                  </Paragraph>
                </FeatureCard>
              </Col>
            </Row>
          </div>
        </Section>

        {/* Statistics & Testimonials Section */}
        <Section className="gray-bg">
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <Row gutter={[48, 48]}>
              <Col xs={24} lg={12}>
                <SectionTitle level={2}>Our Impact</SectionTitle>
                
                <Row gutter={[24, 24]}>
                  <Col xs={12}>
                    <StatisticCard>
                      <Statistic 
                        title="Exhibitions" 
                        value={100} 
                        suffix="+" 
                        valueStyle={{ color: '#4158D0', fontWeight: 'bold' }} 
                      />
                    </StatisticCard>
                  </Col>
                  
                  <Col xs={12}>
                    <StatisticCard>
                      <Statistic 
                        title="Exhibitors" 
                        value={5000} 
                        suffix="+" 
                        valueStyle={{ color: '#C850C0', fontWeight: 'bold' }} 
                      />
                    </StatisticCard>
                  </Col>
                  
                  <Col xs={12}>
                    <StatisticCard>
                      <Statistic 
                        title="Stalls Booked" 
                        value={12000} 
                        suffix="+" 
                        valueStyle={{ color: '#FFCC70', fontWeight: 'bold' }} 
                      />
                    </StatisticCard>
                  </Col>
                  
                  <Col xs={12}>
                    <StatisticCard>
                      <Statistic 
                        title="Cities" 
                        value={25} 
                        suffix="+" 
                        valueStyle={{ color: '#52c41a', fontWeight: 'bold' }} 
                      />
                    </StatisticCard>
                  </Col>
                </Row>
              </Col>
              
              <Col xs={24} lg={12}>
                <SectionTitle level={2}>What Exhibitors Say</SectionTitle>
                
                <Carousel autoplay dots={{ className: 'custom-carousel-dots' }}>
                  <div>
                    <TestimonialCard>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                        <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#4158D0' }} />
                        <div>
                          <Title level={5} style={{ margin: 0 }}>Sarah Johnson</Title>
                          <Text type="secondary">Tech Innovations Inc.</Text>
                        </div>
                      </div>
                      <Paragraph style={{ fontSize: 16 }}>
                        "The booking process was seamless! I could view the layout, select my preferred spot, and complete payment all in one go. Will definitely use again for our next exhibition."
                      </Paragraph>
                    </TestimonialCard>
                  </div>
                  
                  <div>
                    <TestimonialCard>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                        <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#C850C0' }} />
                        <div>
                          <Title level={5} style={{ margin: 0 }}>Michael Chen</Title>
                          <Text type="secondary">Global Exhibits Ltd</Text>
                        </div>
                      </div>
                      <Paragraph style={{ fontSize: 16 }}>
                        "As a regular exhibitor, this platform has made my life so much easier. I love how I can see all my bookings and manage everything from one dashboard."
                      </Paragraph>
                    </TestimonialCard>
                  </div>
                </Carousel>
              </Col>
            </Row>
          </div>
        </Section>
        
        {/* CTA Section */}
        <Section style={{ padding: '60px 0' }}>
          <div style={{ 
            maxWidth: '1000px', 
            margin: '0 auto', 
            padding: '40px 24px',
            background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
            borderRadius: '16px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <Title level={2} style={{ color: 'white', marginBottom: 16 }}>Ready to Showcase Your Business?</Title>
            <Paragraph style={{ fontSize: '1.2rem', marginBottom: 32, color: 'rgba(255, 255, 255, 0.9)' }}>
              Join thousands of successful exhibitors and book your perfect stall today
            </Paragraph>
            <Space size={16} wrap style={{ justifyContent: 'center' }}>
              <Button 
                size="large" 
                style={{ 
                  height: '50px',
                  background: 'white',
                  color: '#4158D0',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                  paddingLeft: 24,
                  paddingRight: 24,
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => navigate('/exhibitions')}
                icon={<ShopOutlined />}
              >
                Browse Exhibitions
              </Button>
              <Button 
                size="large" 
                style={{ 
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontWeight: 500,
                  paddingLeft: 24,
                  paddingRight: 24,
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={showRegisterModal}
                icon={<UserOutlined />}
              >
                Register as Exhibitor
              </Button>
            </Space>
          </div>
        </Section>
      </StyledContent>
      <GlobalFooter />
    </Layout>
  );
};

export default Home; 