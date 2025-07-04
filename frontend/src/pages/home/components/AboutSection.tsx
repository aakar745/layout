import React from 'react';
import { Typography, Row, Col, Card, Statistic, Timeline } from 'antd';
import { 
  TrophyOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  HeartOutlined,
  StarOutlined,
  BankOutlined,
  ShopOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';

const { Title, Paragraph, Text } = Typography;

// Styled Components
const AboutSection = styled.div`
  padding: 100px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23667eea' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E");
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const AboutContent = styled.div`
  position: relative;
  z-index: 2;
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
  text-align: center;
  font-size: 1.2rem !important;
  color: #666 !important;
  max-width: 800px;
  margin: 0 auto 60px !important;
  line-height: 1.6 !important;
  
  @media (max-width: 768px) {
    font-size: 1.1rem !important;
    margin-bottom: 40px !important;
  }
`;

const StoryCard = styled(Card)`
  height: 100%;
  border-radius: 20px !important;
  border: none !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1) !important;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px) !important;
  
  &:hover {
    transform: translateY(-10px) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  }
  
  .ant-card-body {
    padding: 40px !important;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  height: 100%;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 32px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
`;

const ValueCard = styled.div`
  text-align: center;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const TimelineWrapper = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  .ant-timeline-item-content {
    margin-left: 20px;
  }
  
  .ant-timeline-item-tail {
    border-left: 2px solid #667eea;
  }
  
  .ant-timeline-item-head {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    width: 16px;
    height: 16px;
  }
`;

const About: React.FC = () => {
  return (
    <AboutSection>
      <AboutContent>
        {/* Header */}
        <div style={{ marginBottom: '80px' }}>
          <SectionTitle level={2}>About Aakar</SectionTitle>
          <SectionSubtitle>
            Transforming the exhibition industry through innovation, expertise, and unwavering commitment to excellence since 1998.
          </SectionSubtitle>
        </div>

        {/* Company Story */}
        <Row gutter={[40, 40]} style={{ marginBottom: '100px' }}>
          <Col xs={24} lg={12}>
            <StoryCard>
              <IconWrapper>
                <RocketOutlined />
              </IconWrapper>
              <Title level={3} style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
                Our Mission
              </Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', textAlign: 'center' }}>
                Aakar Exhibition is about Knowledge, Ideas, Evaluations and Implementation in creating world class exhibitions - 
                a marketplace where we bring together end users, traders & manufacturers under one roof to do business and get inspiration.
              </Paragraph>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', textAlign: 'center' }}>
                Our industry insight, coupled with our innovative and entrepreneurial approach provides the opportunity for business advantage.
              </Paragraph>
            </StoryCard>
          </Col>
          
          <Col xs={24} lg={12}>
            <StoryCard>
              <IconWrapper>
                <HeartOutlined />
              </IconWrapper>
              <Title level={3} style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
                Our Values
              </Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', textAlign: 'center' }}>
                Everything we do is driven by our customers' needs. We are their indispensable partner and have a passion 
                for understanding our client, reaching and fulfilling our customers expectations.
              </Paragraph>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', textAlign: 'center' }}>
                We are committed to providing demonstrably superior products and services with the highest level of quality and excellence.
              </Paragraph>
            </StoryCard>
          </Col>
        </Row>

        {/* Statistics */}
        <div style={{ marginBottom: '100px' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '50px', color: '#333' }}>
            Our Impact Since 1998
          </Title>
          <Row gutter={[30, 30]}>
            <Col xs={12} sm={6}>
              <StatCard>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  <CalendarOutlined />
                </div>
                <Statistic 
                  value={50} 
                  suffix="+" 
                  valueStyle={{ color: '#333', fontWeight: 'bold', fontSize: '2rem' }} 
                />
                <Text style={{ color: '#666', fontSize: '14px' }}>Exhibitions Organized</Text>
              </StatCard>
            </Col>
            
            <Col xs={12} sm={6}>
              <StatCard>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  <ShopOutlined />
                </div>
                <Statistic 
                  value={10000} 
                  suffix="+" 
                  valueStyle={{ color: '#333', fontWeight: 'bold', fontSize: '2rem' }} 
                />
                <Text style={{ color: '#666', fontSize: '14px' }}>Exhibitors Served</Text>
              </StatCard>
            </Col>
            
            <Col xs={12} sm={6}>
              <StatCard>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  <BankOutlined />
                </div>
                <Statistic 
                  value={20} 
                  suffix="+" 
                  valueStyle={{ color: '#333', fontWeight: 'bold', fontSize: '2rem' }} 
                />
                <Text style={{ color: '#666', fontSize: '14px' }}>Trade Associations</Text>
              </StatCard>
            </Col>
            
            <Col xs={12} sm={6}>
              <StatCard>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  <TeamOutlined />
                </div>
                <Statistic 
                  value={1000000} 
                  suffix="+" 
                  valueStyle={{ color: '#333', fontWeight: 'bold', fontSize: '1.8rem' }} 
                />
                <Text style={{ color: '#666', fontSize: '14px' }}>Trade Visitors</Text>
              </StatCard>
            </Col>
          </Row>
        </div>

        {/* Core Values */}
        <div style={{ marginBottom: '100px' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '50px', color: '#333' }}>
            What Drives Us
          </Title>
          <Row gutter={[30, 30]}>
            <Col xs={24} sm={12} lg={8}>
              <ValueCard>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white',
                  fontSize: '20px'
                }}>
                  <StarOutlined />
                </div>
                <Title level={5} style={{ marginBottom: '16px', color: '#333' }}>Excellence</Title>
                <Paragraph style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  We strive to be professional in all our client dealings and are highly valued and respected by our clients.
                </Paragraph>
              </ValueCard>
            </Col>
            
            <Col xs={24} sm={12} lg={8}>
              <ValueCard>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white',
                  fontSize: '20px'
                }}>
                  <HeartOutlined />
                </div>
                <Title level={5} style={{ marginBottom: '16px', color: '#333' }}>Customer Focus</Title>
                <Paragraph style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  Everything we do is driven by our customers' needs. We are their indispensable partner.
                </Paragraph>
              </ValueCard>
            </Col>
            
            <Col xs={24} sm={12} lg={8}>
              <ValueCard>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white',
                  fontSize: '20px'
                }}>
                  <RocketOutlined />
                </div>
                <Title level={5} style={{ marginBottom: '16px', color: '#333' }}>Innovation</Title>
                <Paragraph style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  Our innovative and entrepreneurial approach provides opportunities for business advantage.
                </Paragraph>
              </ValueCard>
            </Col>
          </Row>
        </div>

        {/* Journey Timeline */}
        <Row gutter={[40, 40]}>
          <Col xs={24} lg={12}>
            <TimelineWrapper>
              <Title level={4} style={{ marginBottom: '30px', color: '#333', textAlign: 'center' }}>
                Our Journey
              </Title>
              <Timeline>
                <Timeline.Item>
                  <div>
                    <Text strong style={{ color: '#667eea' }}>1998</Text>
                    <br />
                    <Text>Founded with a vision to revolutionize the exhibition industry</Text>
                  </div>
                </Timeline.Item>
                <Timeline.Item>
                  <div>
                    <Text strong style={{ color: '#667eea' }}>2005</Text>
                    <br />
                    <Text>Expanded to serve multiple trade associations</Text>
                  </div>
                </Timeline.Item>
                <Timeline.Item>
                  <div>
                    <Text strong style={{ color: '#667eea' }}>2010</Text>
                    <br />
                    <Text>Reached milestone of 25 successful exhibitions</Text>
                  </div>
                </Timeline.Item>
                <Timeline.Item>
                  <div>
                    <Text strong style={{ color: '#667eea' }}>2015</Text>
                    <br />
                    <Text>Served over 5,000 exhibitors across various industries</Text>
                  </div>
                </Timeline.Item>
                <Timeline.Item>
                  <div>
                    <Text strong style={{ color: '#667eea' }}>2020</Text>
                    <br />
                    <Text>Launched digital platform for seamless exhibition management</Text>
                  </div>
                </Timeline.Item>
                <Timeline.Item>
                  <div>
                    <Text strong style={{ color: '#667eea' }}>Today</Text>
                    <br />
                    <Text>Leading the industry with 50+ exhibitions and 10,000+ satisfied exhibitors</Text>
                  </div>
                </Timeline.Item>
              </Timeline>
            </TimelineWrapper>
          </Col>
          
          <Col xs={24} lg={12}>
            <StoryCard>
              <IconWrapper>
                <TrophyOutlined />
              </IconWrapper>
              <Title level={3} style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
                Why Choose Aakar?
              </Title>
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '12px', fontSize: '16px' }} />
                  <Text>25+ years of industry expertise</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '12px', fontSize: '16px' }} />
                  <Text>Proven track record with 50+ successful exhibitions</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '12px', fontSize: '16px' }} />
                  <Text>Strong network of 20+ trade associations</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '12px', fontSize: '16px' }} />
                  <Text>Customer-centric approach with personalized service</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '12px', fontSize: '16px' }} />
                  <Text>Innovative digital platform for seamless booking</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '12px', fontSize: '16px' }} />
                  <Text>Commitment to quality and excellence</Text>
                </div>
              </div>
            </StoryCard>
          </Col>
        </Row>
      </AboutContent>
    </AboutSection>
  );
};

export default About; 