import React from 'react';
import { Layout, Typography, Row, Col, Card, Timeline, Divider } from 'antd';
import { 
  TrophyOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  RocketOutlined,
  HeartOutlined,
  StarOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';
import GlobalHeader from '../../components/layout/GlobalHeader';
import GlobalFooter from '../../components/layout/GlobalFooter';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const StyledContent = styled(Content)`
  padding: 80px 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 80px;
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
`;

const StyledCard = styled(Card)`
  height: 100%;
  border-radius: 16px !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 24px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const AboutUs: React.FC = () => {
  return (
    <Layout>
      <GlobalHeader />
      <StyledContent>
        <PageContainer>
          {/* Hero Section */}
          <HeroSection>
            <SectionTitle level={1}>About Aakar Exhibition</SectionTitle>
            <Paragraph style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
              Transforming the exhibition industry through innovation, expertise, and unwavering commitment to excellence since 1998.
            </Paragraph>
          </HeroSection>

          {/* Company Story */}
          <Row gutter={[40, 40]} style={{ marginBottom: '80px' }}>
            <Col xs={24} lg={12}>
              <StyledCard>
                <IconWrapper>
                  <RocketOutlined />
                </IconWrapper>
                <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
                  Our Mission
                </Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', textAlign: 'center' }}>
                  Aakar is about Knowledge, Ideas, Evaluations and Implementation in creating world class exhibitions - 
                  a marketplace where we bring together end users, traders & manufacturers under one roof to do business and get inspiration.
                </Paragraph>
              </StyledCard>
            </Col>
            <Col xs={24} lg={12}>
              <StyledCard>
                <IconWrapper>
                  <HeartOutlined />
                </IconWrapper>
                <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
                  Our Vision
                </Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', textAlign: 'center' }}>
                  To be the leading platform that connects businesses, fosters innovation, and drives growth in the exhibition industry 
                  by providing world-class facilities and services that exceed expectations.
                </Paragraph>
              </StyledCard>
            </Col>
          </Row>

          {/* Values */}
          <div style={{ marginBottom: '80px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '50px' }}>
              Our Values
            </Title>
            <Row gutter={[30, 30]}>
              <Col xs={24} sm={12} lg={8}>
                <StyledCard>
                  <IconWrapper>
                    <StarOutlined />
                  </IconWrapper>
                  <Title level={4} style={{ textAlign: 'center', marginBottom: '15px' }}>
                    Excellence
                  </Title>
                  <Paragraph style={{ textAlign: 'center' }}>
                    We strive for excellence in every aspect of our service, ensuring the highest quality standards in all our exhibitions.
                  </Paragraph>
                </StyledCard>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <StyledCard>
                  <IconWrapper>
                    <TeamOutlined />
                  </IconWrapper>
                  <Title level={4} style={{ textAlign: 'center', marginBottom: '15px' }}>
                    Collaboration
                  </Title>
                  <Paragraph style={{ textAlign: 'center' }}>
                    We believe in the power of partnerships and work closely with our clients to achieve mutual success.
                  </Paragraph>
                </StyledCard>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <StyledCard>
                  <IconWrapper>
                    <TrophyOutlined />
                  </IconWrapper>
                  <Title level={4} style={{ textAlign: 'center', marginBottom: '15px' }}>
                    Innovation
                  </Title>
                  <Paragraph style={{ textAlign: 'center' }}>
                    We continuously innovate to provide cutting-edge solutions that meet the evolving needs of the industry.
                  </Paragraph>
                </StyledCard>
              </Col>
            </Row>
          </div>

          {/* Journey Timeline */}
          <div style={{ marginBottom: '80px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '50px' }}>
              Our Journey
            </Title>
            <StyledCard>
              <Timeline mode="left">
                <Timeline.Item dot={<CalendarOutlined style={{ fontSize: '16px' }} />}>
                  <div>
                    <Title level={4}>1998 - Foundation</Title>
                    <Paragraph>
                      Aakar Exhibition was founded with a vision to revolutionize the exhibition industry in India.
                    </Paragraph>
                  </div>
                </Timeline.Item>
                <Timeline.Item dot={<TrophyOutlined style={{ fontSize: '16px' }} />}>
                  <div>
                    <Title level={4}>2005 - Expansion</Title>
                    <Paragraph>
                      Expanded operations to multiple cities and established ourselves as a trusted exhibition organizer.
                    </Paragraph>
                  </div>
                </Timeline.Item>
                <Timeline.Item dot={<StarOutlined style={{ fontSize: '16px' }} />}>
                  <div>
                    <Title level={4}>2015 - Digital Transformation</Title>
                    <Paragraph>
                      Embraced digital technologies to enhance the exhibition experience for both organizers and participants.
                    </Paragraph>
                  </div>
                </Timeline.Item>
                <Timeline.Item dot={<RocketOutlined style={{ fontSize: '16px' }} />}>
                  <div>
                    <Title level={4}>2024 - Innovation Era</Title>
                    <Paragraph>
                      Launched our advanced exhibition management platform, setting new standards in the industry.
                    </Paragraph>
                  </div>
                </Timeline.Item>
              </Timeline>
            </StyledCard>
          </div>

          <Divider />

          {/* Contact Information */}
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={3}>Get in Touch</Title>
            <Paragraph style={{ fontSize: '16px', color: '#666' }}>
              Ready to create exceptional exhibitions together? Contact us today.
            </Paragraph>
            <div style={{ marginTop: '20px' }}>
              <Text strong>Email: </Text>
              <Text>support@aakarexhibition.com</Text>
              <br />
              <Text strong>Phone: </Text>
              <Text>7016727956</Text>
            </div>
          </div>
        </PageContainer>
      </StyledContent>
      <GlobalFooter />
    </Layout>
  );
};

export default AboutUs; 