import React from 'react';
import { Layout, Typography, Card, Divider, Alert, List } from 'antd';
import { SecurityScanOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
`;

const SectionTitle = styled(Title)`
  margin-bottom: 20px !important;
  font-size: 3rem !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.5rem !important;
  }
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
`;

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <GlobalHeader />
      <StyledContent>
        <PageContainer>
          <SectionTitle level={1}>Privacy Policy</SectionTitle>
          <Paragraph style={{ fontSize: '1.2rem', color: '#666', textAlign: 'center', marginBottom: '60px' }}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </Paragraph>

          <Alert
            message="Last Updated"
            description="This Privacy Policy was last updated on January 1, 2024. We may update this policy from time to time."
            type="info"
            icon={<EyeOutlined />}
            style={{ marginBottom: '40px' }}
            showIcon
          />

          <StyledCard title={<><SecurityScanOutlined /> 1. Information We Collect</>}>
            <Title level={4}>1.1 Personal Information</Title>
            <Paragraph>
              We collect information you provide directly to us when you:
            </Paragraph>
            <List
              dataSource={[
                'Register for exhibitions or events',
                'Create an account on our platform',
                'Contact us for support or inquiries',
                'Subscribe to our newsletters',
                'Make payments for our services'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />

            <Title level={4}>1.2 Technical Information</Title>
            <Paragraph>
              We automatically collect certain technical information including IP addresses, browser types, 
              device information, and usage patterns to improve our services.
            </Paragraph>
          </StyledCard>

          <StyledCard title="2. How We Use Your Information">
            <Paragraph>
              We use the collected information for the following purposes:
            </Paragraph>
            <List
              dataSource={[
                'Process and manage exhibition bookings',
                'Provide customer support and respond to inquiries',
                'Send important updates about your bookings',
                'Improve our services and user experience',
                'Comply with legal obligations',
                'Prevent fraud and ensure platform security'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />
          </StyledCard>

          <StyledCard title={<><LockOutlined /> 3. Data Protection & Security</>}>
            <Title level={4}>3.1 Security Measures</Title>
            <Paragraph>
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </Paragraph>

            <Title level={4}>3.2 Data Encryption</Title>
            <Paragraph>
              All sensitive data, including payment information, is encrypted using industry-standard 
              encryption protocols (SSL/TLS) during transmission and storage.
            </Paragraph>

            <Title level={4}>3.3 Access Controls</Title>
            <Paragraph>
              Access to personal information is restricted to authorized personnel only and is provided 
              on a need-to-know basis for business operations.
            </Paragraph>
          </StyledCard>

          <StyledCard title="4. Information Sharing">
            <Title level={4}>4.1 Third-Party Service Providers</Title>
            <Paragraph>
              We may share your information with trusted third-party service providers who assist us in:
            </Paragraph>
            <List
              dataSource={[
                'Payment processing (PhonePe, bank partners)',
                'Email communication services',
                'Cloud hosting and storage services',
                'Analytics and performance monitoring',
                'Customer support platforms'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />

            <Title level={4}>4.2 Legal Requirements</Title>
            <Paragraph>
              We may disclose your information when required by law, legal process, or government authorities.
            </Paragraph>

            <Title level={4}>4.3 Business Transfers</Title>
            <Paragraph>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred 
              as part of the business transaction.
            </Paragraph>
          </StyledCard>

          <StyledCard title="5. Your Rights">
            <Paragraph>
              You have the following rights regarding your personal information:
            </Paragraph>
            <List
              dataSource={[
                'Access: Request a copy of your personal data',
                'Correction: Update or correct inaccurate information',
                'Deletion: Request deletion of your personal data',
                'Portability: Request transfer of your data to another service',
                'Objection: Object to certain processing of your data',
                'Restriction: Request restriction of data processing'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />
          </StyledCard>

          <StyledCard title="6. Cookies & Tracking">
            <Title level={4}>6.1 Cookie Usage</Title>
            <Paragraph>
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
              and provide personalized content.
            </Paragraph>

            <Title level={4}>6.2 Cookie Types</Title>
            <List
              dataSource={[
                'Essential cookies for basic site functionality',
                'Performance cookies for analytics and optimization',
                'Functional cookies for enhanced user experience',
                'Targeting cookies for relevant advertising (with consent)'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />
          </StyledCard>

          <StyledCard title="7. Data Retention">
            <Paragraph>
              We retain your personal information only for as long as necessary to fulfill the purposes 
              outlined in this privacy policy, unless a longer retention period is required by law. 
              Typically, we retain:
            </Paragraph>
            <List
              dataSource={[
                'Account information: For the duration of your account plus 2 years',
                'Booking records: 7 years for tax and legal compliance',
                'Communication records: 3 years for support purposes',
                'Payment information: As required by payment regulations'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />
          </StyledCard>

          <StyledCard title="8. International Data Transfers">
            <Paragraph>
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place to protect your data during such transfers.
            </Paragraph>
          </StyledCard>

          <StyledCard title="9. Children's Privacy">
            <Paragraph>
              Our services are not intended for children under 18 years of age. We do not knowingly collect 
              personal information from children under 18.
            </Paragraph>
          </StyledCard>

          <StyledCard title="10. Contact Us">
            <Paragraph>
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </Paragraph>
            <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
              <Text strong>Privacy Officer</Text><br />
              <Text>Email: support@aakarexhibition.com</Text><br />
              <Text>Phone: 7016727956</Text><br />
              <Text>Address: B-2, Wall Street 2, opp. Orient Club, Ellisbridge, Ahmedabad, Gujarat 380006</Text>
            </div>
          </StyledCard>

          <Divider />

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Paragraph style={{ fontSize: '14px', color: '#999' }}>
              This Privacy Policy is governed by the laws of India and any disputes will be resolved in the courts of Ahmedabad, Gujarat.
            </Paragraph>
            <Paragraph style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
              Last updated: January 1, 2024
            </Paragraph>
          </div>
        </PageContainer>
      </StyledContent>
      <GlobalFooter />
    </Layout>
  );
};

export default PrivacyPolicy; 