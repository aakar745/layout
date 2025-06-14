import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { 
  LayoutOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ShopOutlined,
  DashboardOutlined,
  SafetyOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';

const { Title, Paragraph } = Typography;

// Styled Components
const FeaturesSection = styled.div`
  padding: 100px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const FeaturesContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const SectionTitle = styled(Title)`
  text-align: center;
  margin-bottom: 20px !important;
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  color: #333 !important;
  
  @media (max-width: 768px) {
    font-size: 2rem !important;
  }
`;

const SectionSubtitle = styled(Paragraph)`
  text-align: center;
  font-size: 1.2rem !important;
  color: #666 !important;
  max-width: 700px;
  margin: 0 auto 60px !important;
  line-height: 1.6 !important;
  
  @media (max-width: 768px) {
    font-size: 1.1rem !important;
    margin-bottom: 40px !important;
  }
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 20px !important;
  overflow: hidden !important;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08) !important;
  border: none !important;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px) !important;
  
  &:hover {
    transform: translateY(-12px) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  }
  
  .ant-card-body {
    padding: 40px 30px !important;
    text-align: center;
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 24px;
  font-size: 32px;
  color: white;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.3));
    z-index: -1;
  }
`;

const FeatureTitle = styled(Title)`
  margin-bottom: 16px !important;
  font-size: 1.3rem !important;
  font-weight: 600 !important;
  color: #333 !important;
`;

const FeatureDescription = styled(Paragraph)`
  font-size: 15px !important;
  line-height: 1.6 !important;
  color: #666 !important;
  margin: 0 !important;
`;

const features = [
  {
    icon: <LayoutOutlined />,
    title: 'Interactive Layout Builder',
    description: 'Visualize and design your exhibition space with our intuitive drag-and-drop layout builder. See exactly where your stall will be positioned.',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadowColor: 'rgba(102, 126, 234, 0.3)'
  },
  {
    icon: <ShopOutlined />,
    title: 'Smart Stall Selection',
    description: 'Choose from available stalls with real-time pricing, amenities, and location details. Book multiple stalls with ease.',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    shadowColor: 'rgba(255, 107, 107, 0.3)'
  },
  {
    icon: <DashboardOutlined />,
    title: 'Exhibitor Dashboard',
    description: 'Manage all your bookings, payments, and exhibition details through our comprehensive exhibitor dashboard.',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    shadowColor: 'rgba(82, 196, 26, 0.3)'
  },
  {
    icon: <CalendarOutlined />,
    title: 'Schedule Management',
    description: 'Keep track of important dates, setup times, and exhibition schedules all in one organized place.',
    gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
    shadowColor: 'rgba(250, 140, 22, 0.3)'
  },
  {
    icon: <SafetyOutlined />,
    title: 'Secure Payments',
    description: 'Process payments securely with multiple payment options and get instant booking confirmations.',
    gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
    shadowColor: 'rgba(114, 46, 209, 0.3)'
  },
  {
    icon: <TeamOutlined />,
    title: 'Multi-User Access',
    description: 'Collaborate with your team members and manage multiple exhibitions from a single account.',
    gradient: 'linear-gradient(135deg, #13c2c2 0%, #08979c 100%)',
    shadowColor: 'rgba(19, 194, 194, 0.3)'
  },
  {
    icon: <CheckCircleOutlined />,
    title: 'Real-time Updates',
    description: 'Get instant notifications about booking status, payment confirmations, and important exhibition updates.',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    shadowColor: 'rgba(24, 144, 255, 0.3)'
  },
  {
    icon: <CustomerServiceOutlined />,
    title: '24/7 Support',
    description: 'Get expert assistance throughout the booking process and during exhibitions with our dedicated support team.',
    gradient: 'linear-gradient(135deg, #eb2f96 0%, #c41d7f 100%)',
    shadowColor: 'rgba(235, 47, 150, 0.3)'
  }
];

const Features: React.FC = () => {
  return (
    <FeaturesSection>
      <FeaturesContent>
        <SectionTitle level={2}>Why Choose Our Platform?</SectionTitle>
        <SectionSubtitle>
          Discover the powerful features that make exhibition booking simple, efficient, and enjoyable for exhibitors worldwide.
        </SectionSubtitle>
        
        <Row gutter={[30, 30]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <FeatureCard>
                <FeatureIcon 
                  style={{ 
                    background: feature.gradient,
                    boxShadow: `0 8px 25px ${feature.shadowColor}`
                  }}
                >
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle level={4}>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            </Col>
          ))}
        </Row>
      </FeaturesContent>
    </FeaturesSection>
  );
};

export default Features; 