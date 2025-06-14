import React from 'react';
import { Typography, Button, Row, Col, Space } from 'antd';
import { ShopOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const { Title, Paragraph } = Typography;

// Styled Components
const HeroSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 0 100px;
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 1;
  }
  
  @media (max-width: 1200px) {
    padding: 100px 0 80px;
    min-height: 70vh;
  }
  
  @media (max-width: 768px) {
    padding: 80px 0 60px;
    min-height: 60vh;
  }
  
  @media (max-width: 480px) {
    padding: 60px 0 40px;
    min-height: 50vh;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const HeroImageContainer = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  
  &:hover {
    transform: perspective(1000px) rotateY(-2deg) rotateX(2deg) translateY(-10px);
    box-shadow: 
      0 35px 70px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    z-index: 1;
    pointer-events: none;
  }
  
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    transform: none;
    border-radius: 16px;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    img {
      height: 280px;
    }
  }
`;

const HeroTitle = styled(Title)`
  font-size: 4rem !important;
  font-weight: 800 !important;
  line-height: 1.1 !important;
  margin-bottom: 24px !important;
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 1200px) {
    font-size: 3.5rem !important;
  }
  
  @media (max-width: 768px) {
    font-size: 2.8rem !important;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem !important;
  }
`;

const HeroSubtitle = styled(Paragraph)`
  font-size: 1.3rem !important;
  line-height: 1.6 !important;
  margin-bottom: 40px !important;
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 400 !important;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1.1rem !important;
    text-align: center;
    margin: 0 auto 32px !important;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem !important;
  }
`;

const HeroButtonGroup = styled(Space)`
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    
    .ant-space-item {
      display: flex;
      justify-content: center;
    }
  }
`;

const PrimaryCTAButton = styled(Button)`
  height: 56px !important;
  padding: 0 32px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  border: none !important;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%) !important;
  box-shadow: 
    0 8px 25px rgba(238, 90, 36, 0.3),
    0 3px 10px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1) !important;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-3px) !important;
    box-shadow: 
      0 12px 35px rgba(238, 90, 36, 0.4),
      0 5px 15px rgba(0, 0, 0, 0.3) !important;
    background: linear-gradient(135deg, #ff5252 0%, #d63031 100%) !important;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) !important;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 280px;
  }
`;

const SecondaryCTAButton = styled(Button)`
  height: 56px !important;
  padding: 0 32px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1) !important;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    color: white !important;
    transform: translateY(-3px) !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }
  
  &:active {
    transform: translateY(-1px) !important;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 280px;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  
  .floating-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;
    
    &:nth-of-type(1) {
      width: 80px;
      height: 80px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }
    
    &:nth-of-type(2) {
      width: 120px;
      height: 120px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }
    
    &:nth-of-type(3) {
      width: 60px;
      height: 60px;
      top: 80%;
      left: 20%;
      animation-delay: 4s;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.7;
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

interface HeroSectionProps {
  onRegisterClick: () => void;
  isAuthenticated?: boolean;
}

const Hero: React.FC<HeroSectionProps> = ({ onRegisterClick, isAuthenticated = false }) => {
  const navigate = useNavigate();

  return (
    <HeroSection>
      <FloatingElements>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </FloatingElements>
      <HeroOverlay />
      <HeroContent>
        <Row gutter={[48, 48]} align="middle" style={{ minHeight: '60vh' }}>
          <Col xs={24} lg={13} xl={12}>
            <div style={{ 
              animation: 'fadeInUp 1s ease-out',
              animationFillMode: 'both'
            }}>
              <HeroTitle level={1}>
                Transform Your Exhibition Experience
              </HeroTitle>
              <HeroSubtitle>
                Discover premium exhibition spaces, visualize your perfect stall placement, and book with confidence. Join thousands of successful exhibitors who trust our platform for their business growth.
              </HeroSubtitle>
              <HeroButtonGroup size={16} wrap direction="vertical">
                <PrimaryCTAButton 
                  onClick={() => navigate('/exhibitions')}
                  icon={<ShopOutlined />}
                >
                  Explore Exhibitions
                </PrimaryCTAButton>
                <SecondaryCTAButton 
                  onClick={onRegisterClick}
                  icon={<UserOutlined />}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Your Journey'}
                </SecondaryCTAButton>
              </HeroButtonGroup>
            </div>
          </Col>
          <Col xs={24} lg={11} xl={12}>
            <div style={{ 
              animation: 'fadeInRight 1s ease-out 0.3s',
              animationFillMode: 'both',
              opacity: 0
            }}>
              <HeroImageContainer>
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3" 
                  alt="Modern Exhibition Hall" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1559223607-a43f990c43d5?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3";
                    
                    target.onerror = () => {
                      target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3";
                      target.onerror = null;
                    };
                  }}
                />
              </HeroImageContainer>
              
              {/* Floating Stats Cards */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                animation: 'fadeInDown 1s ease-out 0.8s',
                animationFillMode: 'both',
                opacity: 0,
                zIndex: 2
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px'
                  }}>
                    <ShopOutlined />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333', fontSize: '18px' }}>10,000+</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>Happy Exhibitors</div>
                  </div>
                </div>
              </div>
              
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                animation: 'fadeInUp 1s ease-out 1s',
                animationFillMode: 'both',
                opacity: 0,
                zIndex: 2
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px'
                  }}>
                    <CalendarOutlined />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333', fontSize: '18px' }}>50+</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>Exhibitions</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </HeroContent>
      
      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .hero-stats-card {
            position: static !important;
            margin: 16px 0 !important;
            transform: none !important;
          }
        }
      `}</style>
    </HeroSection>
  );
};

export default Hero; 