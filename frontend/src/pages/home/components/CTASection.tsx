import React from 'react';
import { Typography, Button, Space } from 'antd';
import { ShopOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const { Title, Paragraph } = Typography;

// Styled Components
const CTASection = styled.div`
  padding: 100px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const CTAContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  color: white;
  text-align: center;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 40px 16px;
    border-radius: 20px;
  }
`;

const CTATitle = styled(Title)`
  color: white !important;
  margin-bottom: 20px !important;
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2rem !important;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem !important;
  }
`;

const CTASubtitle = styled(Paragraph)`
  font-size: 1.3rem !important;
  margin-bottom: 40px !important;
  color: rgba(255, 255, 255, 0.9) !important;
  line-height: 1.6 !important;
  max-width: 600px;
  margin-left: auto !important;
  margin-right: auto !important;
  
  @media (max-width: 768px) {
    font-size: 1.1rem !important;
    margin-bottom: 32px !important;
  }
`;

const CTAButtonGroup = styled(Space)`
  @media (max-width: 768px) {
    width: 100%;
    
    .ant-space-item {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
`;

const PrimaryCTAButton = styled(Button)`
  height: 56px !important;
  padding: 0 40px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  border: none !important;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%) !important;
  box-shadow: 
    0 8px 25px rgba(255, 107, 107, 0.3),
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
      0 12px 35px rgba(255, 107, 107, 0.4),
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
    max-width: 300px;
  }
`;

const SecondaryCTAButton = styled(Button)`
  height: 56px !important;
  padding: 0 40px !important;
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
    max-width: 300px;
  }
`;

const FloatingShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  
  .shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 8s ease-in-out infinite;
    
    &:nth-of-type(1) {
      width: 100px;
      height: 100px;
      top: 10%;
      left: 5%;
      animation-delay: 0s;
    }
    
    &:nth-of-type(2) {
      width: 150px;
      height: 150px;
      top: 70%;
      right: 10%;
      animation-delay: 3s;
    }
    
    &:nth-of-type(3) {
      width: 80px;
      height: 80px;
      top: 30%;
      right: 20%;
      animation-delay: 6s;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.5;
    }
    50% {
      transform: translateY(-30px) rotate(180deg);
      opacity: 0.8;
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

interface CTASectionProps {
  onRegisterClick: () => void;
  isAuthenticated?: boolean;
}

const CTA: React.FC<CTASectionProps> = ({ onRegisterClick, isAuthenticated = false }) => {
  const navigate = useNavigate();

  return (
    <CTASection>
      <FloatingShapes>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </FloatingShapes>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <CTAContent>
          <CTATitle level={2}>Ready to Showcase Your Business?</CTATitle>
          <CTASubtitle>
            Join thousands of successful exhibitors and book your perfect stall today. 
            Experience the future of exhibition management with our innovative platform.
          </CTASubtitle>
          <CTAButtonGroup size={20} wrap direction="vertical">
            <PrimaryCTAButton 
              onClick={() => navigate('/exhibitions')}
              icon={<ShopOutlined />}
            >
              Browse Exhibitions
            </PrimaryCTAButton>
            <SecondaryCTAButton 
              onClick={onRegisterClick}
              icon={<UserOutlined />}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Register as Exhibitor'}
            </SecondaryCTAButton>
          </CTAButtonGroup>
        </CTAContent>
      </div>
    </CTASection>
  );
};

export default CTA; 