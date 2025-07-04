import React from 'react';
import { Layout, Typography, Row, Col, Card, Divider } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  UserOutlined,
  ClockCircleOutlined
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

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const ContactIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
`;

const ContactUs: React.FC = () => {
  return (
    <Layout>
      <GlobalHeader />
      <StyledContent>
        <PageContainer>
          {/* Hero Section */}
          <HeroSection>
            <SectionTitle level={1}>Contact Us</SectionTitle>
            <Paragraph style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
              Get in touch with our team. We're here to help you create exceptional exhibitions.
            </Paragraph>
          </HeroSection>

          {/* Contact Information */}
          <Row gutter={[40, 40]} style={{ marginBottom: '80px' }}>
            <Col xs={24} lg={16}>
              <StyledCard title="Primary Contact Information">
                <ContactItem>
                  <ContactIcon>
                    <UserOutlined />
                  </ContactIcon>
                  <div>
                    <Title level={4} style={{ marginBottom: '8px' }}>
                      Tanvir Pathan
                    </Title>
                    <Paragraph style={{ marginBottom: '0', color: '#666' }}>
                      Contact Person
                    </Paragraph>
                  </div>
                </ContactItem>

                <ContactItem>
                  <ContactIcon>
                    <PhoneOutlined />
                  </ContactIcon>
                  <div>
                    <Title level={4} style={{ marginBottom: '8px' }}>
                      Phone
                    </Title>
                    <Paragraph style={{ marginBottom: '0', fontSize: '16px' }}>
                      <a href="tel:+918155001192" style={{ color: '#667eea', textDecoration: 'none' }}>
                        +91 81550 01192
                      </a>
                    </Paragraph>
                  </div>
                </ContactItem>

                <ContactItem>
                  <ContactIcon>
                    <MailOutlined />
                  </ContactIcon>
                  <div>
                    <Title level={4} style={{ marginBottom: '8px' }}>
                      Email
                    </Title>
                    <Paragraph style={{ marginBottom: '0', fontSize: '16px' }}>
                      <a href="mailto:tanvir@aakarexhibition.com" style={{ color: '#667eea', textDecoration: 'none' }}>
                        tanvir@aakarexhibition.com
                      </a>
                    </Paragraph>
                  </div>
                </ContactItem>
              </StyledCard>
            </Col>

            <Col xs={24} lg={8}>
              <StyledCard title="Office Information">
                <ContactItem>
                  <ContactIcon>
                    <EnvironmentOutlined />
                  </ContactIcon>
                  <div>
                    <Title level={4} style={{ marginBottom: '8px' }}>
                      Address
                    </Title>
                    <Paragraph style={{ marginBottom: '0', fontSize: '16px', lineHeight: '1.6' }}>
                      B-2, Wall Street 2, opp. Orient Club,<br />
                      Ellisbridge, Ahmedabad,<br />
                      Gujarat 380006
                    </Paragraph>
                  </div>
                </ContactItem>

                <ContactItem>
                  <ContactIcon>
                    <PhoneOutlined />
                  </ContactIcon>
                  <div>
                    <Title level={4} style={{ marginBottom: '8px' }}>
                      Support
                    </Title>
                    <Paragraph style={{ marginBottom: '0', fontSize: '16px' }}>
                      <a href="tel:7016727956" style={{ color: '#667eea', textDecoration: 'none' }}>
                        7016727956
                      </a>
                    </Paragraph>
                  </div>
                </ContactItem>

                <ContactItem>
                  <ContactIcon>
                    <MailOutlined />
                  </ContactIcon>
                  <div>
                    <Title level={4} style={{ marginBottom: '8px' }}>
                      General Inquiry
                    </Title>
                    <Paragraph style={{ marginBottom: '0', fontSize: '16px' }}>
                      <a href="mailto:support@aakarexhibition.com" style={{ color: '#667eea', textDecoration: 'none' }}>
                        support@aakarexhibition.com
                      </a>
                    </Paragraph>
                  </div>
                </ContactItem>
              </StyledCard>
            </Col>
          </Row>

          {/* Business Hours */}
          <Row gutter={[40, 40]} style={{ marginBottom: '80px' }}>
            <Col xs={24}>
              <StyledCard>
                <div style={{ textAlign: 'center' }}>
                  <ContactIcon style={{ margin: '0 auto 20px' }}>
                    <ClockCircleOutlined />
                  </ContactIcon>
                  <Title level={3} style={{ marginBottom: '20px' }}>
                    Business Hours
                  </Title>
                  <Row gutter={[20, 20]}>
                    <Col xs={24} sm={12}>
                      <div style={{ padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
                        <Text strong style={{ fontSize: '16px' }}>Monday - Friday</Text>
                        <br />
                        <Text style={{ fontSize: '14px', color: '#666' }}>10:30 AM - 7:00 PM</Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div style={{ padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
                        <Text strong style={{ fontSize: '16px' }}>Saturday</Text>
                        <br />
                        <Text style={{ fontSize: '14px', color: '#666' }}>9:00 AM - 2:00 PM</Text>
                      </div>
                    </Col>
                  </Row>
                  <Paragraph style={{ marginTop: '20px', color: '#666' }}>
                    We're closed on Sundays and public holidays
                  </Paragraph>
                </div>
              </StyledCard>
            </Col>
          </Row>

          <Divider />

          {/* Quick Response */}
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={3}>Quick Response</Title>
            <Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              For immediate assistance, please call our direct contact number. 
              We typically respond to emails within 24 hours during business days.
            </Paragraph>
            <div style={{ marginTop: '30px' }}>
              <a 
                href="tel:+918155001192" 
                style={{ 
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginRight: '15px',
                  marginBottom: '10px'
                }}
              >
                Call Now: +91 81550 01192
              </a>
              <a 
                href="mailto:tanvir@aakarexhibition.com" 
                style={{ 
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: 'transparent',
                  color: '#667eea',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: '2px solid #667eea',
                  marginBottom: '10px'
                }}
              >
                Send Email
              </a>
            </div>
          </div>
        </PageContainer>
      </StyledContent>
      <GlobalFooter />
    </Layout>
  );
};

export default ContactUs; 