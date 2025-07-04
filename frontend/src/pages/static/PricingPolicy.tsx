import React from 'react';
import { Layout, Typography, Card, Divider, List, Alert } from 'antd';
import { InfoCircleOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
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

const PricingPolicy: React.FC = () => {
  return (
    <Layout>
      <GlobalHeader />
      <StyledContent>
        <PageContainer>
          <SectionTitle level={1}>Pricing Policy</SectionTitle>
          <Paragraph style={{ fontSize: '1.2rem', color: '#666', textAlign: 'center', marginBottom: '60px' }}>
            Transparent and competitive pricing for all our exhibition services
          </Paragraph>

          <Alert
            message="Important Notice"
            description="All prices are subject to change based on exhibition requirements and market conditions. Final pricing will be confirmed during the booking process."
            type="info"
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: '40px' }}
            showIcon
          />

          <StyledCard title={<><DollarOutlined /> Exhibition Stall Booking</>}>
            <Paragraph>
              Our stall pricing is designed to be fair and competitive, offering excellent value for exhibitors of all sizes.
            </Paragraph>
            
            <Title level={4}>Standard Pricing Structure:</Title>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: 'Premium Stalls (Front Row)',
                  description: 'Pricing varies based on location and exhibition type'
                },
                {
                  title: 'Standard Stalls',
                  description: 'Competitive rates for general exhibition areas'
                },
                {
                  title: 'Corner Stalls',
                  description: 'Premium pricing for enhanced visibility'
                },
                {
                  title: 'Island Stalls',
                  description: 'Special pricing for large exhibition spaces'
                }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </StyledCard>

          <StyledCard title={<><CalendarOutlined /> Service Charges</>}>
            <Paragraph>
              Additional services are charged separately to provide flexibility and cost-effectiveness.
            </Paragraph>
            
            <Title level={4}>Service Charge Details:</Title>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: 'Setup Services',
                  description: 'Professional stall setup and configuration services'
                },
                {
                  title: 'Power & Utilities',
                  description: 'Electrical connections and utility services'
                },
                {
                  title: 'Security Services',
                  description: '24/7 security coverage during exhibition period'
                },
                {
                  title: 'Cleaning Services',
                  description: 'Daily cleaning and maintenance services'
                },
                {
                  title: 'Technical Support',
                  description: 'On-site technical assistance and troubleshooting'
                }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </StyledCard>

          <StyledCard title="Payment Terms">
            <Title level={4}>Booking Process:</Title>
            <List
              dataSource={[
                '1. Initial inquiry and requirement assessment',
                '2. Customized quote preparation based on specific needs',
                '3. Booking confirmation with advance payment',
                '4. Service delivery as per agreed terms',
                '5. Final payment upon completion'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '8px' }}>{item}</Paragraph>
                </List.Item>
              )}
            />

            <Divider />

            <Title level={4}>Payment Methods:</Title>
            <Paragraph>
              We accept multiple payment methods for your convenience:
            </Paragraph>
            <List
              dataSource={[
                'Online payment via secure payment gateway',
                'Bank transfer (NEFT/RTGS)',
                'Cheque payments',
                'Cash payments (for smaller amounts)',
                'Digital wallets (UPI, PhonePe, GooglePay)'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />
          </StyledCard>

          <StyledCard title="Additional Information">
            <Title level={4}>What's Included:</Title>
            <List
              dataSource={[
                'Basic stall space allocation',
                'Standard exhibition infrastructure',
                'Basic promotional support',
                'Visitor management system access',
                'Certificate of participation'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>✓ {item}</Paragraph>
                </List.Item>
              )}
            />

            <Divider />

            <Title level={4}>Pricing Factors:</Title>
            <Paragraph>
              Final pricing may vary based on:
            </Paragraph>
            <List
              dataSource={[
                'Exhibition duration and dates',
                'Stall size and location preferences',
                'Additional services required',
                'Advance booking discounts',
                'Package deals for multiple exhibitions',
                'Seasonal pricing adjustments'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />
          </StyledCard>

          <Alert
            message="Get Custom Quote"
            description="For detailed pricing information specific to your requirements, please contact our team. We provide customized quotes based on your exhibition needs and budget."
            type="success"
            style={{ marginTop: '40px' }}
            showIcon
          />

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Paragraph style={{ fontSize: '16px', color: '#666' }}>
              <Text strong>Contact us for detailed pricing:</Text><br />
              Email: support@aakarexhibition.com | Phone: 7016727956
            </Paragraph>
          </div>
        </PageContainer>
      </StyledContent>
      <GlobalFooter />
    </Layout>
  );
};

export default PricingPolicy; 