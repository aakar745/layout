import React from 'react';
import { Layout, Typography, Card, Divider, Alert, List, Steps } from 'antd';
import { DollarOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import GlobalHeader from '../../components/layout/GlobalHeader';
import GlobalFooter from '../../components/layout/GlobalFooter';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

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

const RefundTable = styled.div`
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`;

const CancellationRefund: React.FC = () => {
  return (
    <Layout>
      <GlobalHeader />
      <StyledContent>
        <PageContainer>
          <SectionTitle level={1}>Cancellation & Refund Policy</SectionTitle>
          <Paragraph style={{ fontSize: '1.2rem', color: '#666', textAlign: 'center', marginBottom: '60px' }}>
            Understanding our cancellation and refund procedures for exhibition bookings
          </Paragraph>

          <Alert
            message="Important Information"
            description="Please read this policy carefully before making any booking. Cancellation charges apply based on the timing of your cancellation request."
            type="warning"
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: '40px' }}
            showIcon
          />

          <StyledCard title={<><ClockCircleOutlined /> Cancellation Timeline & Refund Rates</>}>
            <Paragraph>
              Refund amounts are calculated based on when you cancel your booking relative to the exhibition start date:
            </Paragraph>
            
            <RefundTable>
              <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>
                Refund Schedule
              </Title>
              <List
                dataSource={[
                  { period: '30+ days before exhibition', refund: '80% refund', charge: '20% cancellation charge' },
                  { period: '15-29 days before exhibition', refund: '50% refund', charge: '50% cancellation charge' },
                  { period: '7-14 days before exhibition', refund: '25% refund', charge: '75% cancellation charge' },
                  { period: 'Less than 7 days before', refund: 'No refund', charge: '100% cancellation charge' }
                ]}
                renderItem={(item) => (
                  <List.Item style={{ border: 'none', padding: '12px 0' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ flex: 1 }}>{item.period}</Text>
                      <Text style={{ flex: 1, textAlign: 'center', color: '#52c41a' }}>{item.refund}</Text>
                      <Text style={{ flex: 1, textAlign: 'right', color: '#ff4d4f' }}>{item.charge}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </RefundTable>

            <Alert
              message="Processing Fee"
              description="A processing fee of 5% will be deducted from all refund amounts to cover administrative costs."
              type="info"
              style={{ marginTop: '20px' }}
              showIcon
            />
          </StyledCard>

          <StyledCard title={<><DollarOutlined /> Cancellation Process</>}>
            <Paragraph style={{ marginBottom: '30px' }}>
              Follow these steps to cancel your exhibition booking:
            </Paragraph>
            
            <Steps direction="vertical">
              <Step 
                title="Submit Cancellation Request"
                description="Send a written cancellation request to support@aakarexhibition.com with your booking details"
                icon={<ExclamationCircleOutlined />}
              />
              <Step 
                title="Verification Process"
                description="Our team will verify your booking details and calculate the refund amount based on the cancellation timeline"
                icon={<ClockCircleOutlined />}
              />
              <Step 
                title="Refund Processing"
                description="Approved refunds will be processed within 5-7 business days to your original payment method"
                icon={<DollarOutlined />}
              />
              <Step 
                title="Confirmation"
                description="You will receive an email confirmation once the refund has been processed"
                icon={<CheckCircleOutlined />}
              />
            </Steps>
          </StyledCard>

          <StyledCard title="Refund Eligibility">
            <Title level={4}>Eligible for Refund:</Title>
            <List
              dataSource={[
                'Cancellations made within the specified timeline',
                'Exhibition cancellation by organizer',
                'Force majeure events (natural disasters, government restrictions)',
                'Technical issues preventing exhibition participation'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>✓ {item}</Paragraph>
                </List.Item>
              )}
            />

            <Divider />

            <Title level={4}>Not Eligible for Refund:</Title>
            <List
              dataSource={[
                'No-show on exhibition day without prior cancellation',
                'Exhibitor misconduct leading to removal',
                'Changes in business circumstances',
                'Partial participation (attending only some days)',
                'Requests made after exhibition completion'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>✗ {item}</Paragraph>
                </List.Item>
              )}
            />
          </StyledCard>

          <StyledCard title="Special Circumstances">
            <Title level={4}>Emergency Cancellations</Title>
            <Paragraph>
              In case of medical emergencies or other exceptional circumstances, please contact us immediately. 
              Each case will be reviewed individually, and we may consider special refund arrangements.
            </Paragraph>

            <Title level={4}>Exhibition Postponement</Title>
            <Paragraph>
              If an exhibition is postponed due to unforeseen circumstances:
            </Paragraph>
            <List
              dataSource={[
                'Full refund will be offered if new dates are not suitable',
                'Booking can be transferred to new exhibition dates at no additional cost',
                'No cancellation charges will apply in such cases'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />

            <Title level={4}>Venue Changes</Title>
            <Paragraph>
              If the exhibition venue is changed significantly:
            </Paragraph>
            <List
              dataSource={[
                'Exhibitors will be notified at least 15 days in advance',
                'Option to cancel with 80% refund regardless of timeline',
                'Alternative arrangements will be offered where possible'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '4px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />
          </StyledCard>

          <StyledCard title="Important Notes">
            <Alert
              message="Required Information for Cancellation"
              description="Please include the following in your cancellation request: Booking ID, Exhibitor name, Exhibition name, Contact details, Reason for cancellation, Bank details for refund (if different from original payment method)."
              type="info"
              style={{ marginBottom: '20px' }}
              showIcon
            />

            <List
              dataSource={[
                'Refunds will be processed in the same currency as the original payment',
                'Bank transfer charges (if any) will be borne by the exhibitor',
                'Partial cancellations (reducing stall count) follow the same timeline rules',
                'Group bookings may have different terms - please check your agreement',
                'Refund timeline starts from the exhibition start date, not booking date',
                'All cancellation requests must be in writing (email preferred)'
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Paragraph style={{ marginBottom: '8px' }}>• {item}</Paragraph>
                </List.Item>
              )}
            />
          </StyledCard>

          <Alert
            message="Need Help with Cancellation?"
            description="Our customer support team is here to assist you with the cancellation process. Contact us as soon as possible if you need to cancel your booking."
            type="success"
            style={{ marginTop: '40px' }}
            showIcon
          />

          <Divider />

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Title level={3}>Contact Support</Title>
            <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
              <Text strong>Cancellation Support</Text><br />
              <Text>Email: support@aakarexhibition.com</Text><br />
              <Text>Phone: 7016727956</Text><br />
              <Text>Contact Person: Tanvir Pathan (+91 81550 01192)</Text>
            </div>
            <Paragraph style={{ fontSize: '14px', color: '#999', marginTop: '20px' }}>
              This policy is effective from January 1, 2024, and applies to all bookings made after this date.
            </Paragraph>
          </div>
        </PageContainer>
      </StyledContent>
      <GlobalFooter />
    </Layout>
  );
};

export default CancellationRefund; 