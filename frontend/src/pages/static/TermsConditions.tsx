import React from 'react';
import { Layout, Typography, Card, Divider, Alert } from 'antd';
import { FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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

const TermsConditions: React.FC = () => {
  return (
    <Layout>
      <GlobalHeader />
      <StyledContent>
        <PageContainer>
          <SectionTitle level={1}>Terms & Conditions</SectionTitle>
          <Paragraph style={{ fontSize: '1.2rem', color: '#666', textAlign: 'center', marginBottom: '60px' }}>
            Please read these terms and conditions carefully before using our services
          </Paragraph>

          <Alert
            message="Effective Date"
            description="These terms and conditions are effective as of January 1, 2024, and may be updated from time to time."
            type="info"
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: '40px' }}
            showIcon
          />

          <StyledCard title={<><FileTextOutlined /> 1. Acceptance of Terms</>}>
            <Paragraph>
              By accessing and using Aakar Exhibition services, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the terms and conditions of this agreement, you are not authorized to use or access our services.
            </Paragraph>
          </StyledCard>

          <StyledCard title="2. Exhibition Booking Terms">
            <Title level={4}>2.1 Booking Process</Title>
            <Paragraph>
              • All bookings are subject to availability and confirmation by Aakar Exhibition<br />
              • Booking confirmation will be provided via email within 24-48 hours<br />
              • Full payment or advance payment as specified must be made to secure the booking<br />
              • Stall allocation is final once confirmed and cannot be changed without mutual agreement
            </Paragraph>

            <Title level={4}>2.2 Exhibitor Responsibilities</Title>
            <Paragraph>
              • Exhibitors must comply with all exhibition rules and regulations<br />
              • Setup and breakdown must be completed within specified timeframes<br />
              • Exhibitors are responsible for their own property and materials<br />
              • Professional conduct is required at all times during the exhibition
            </Paragraph>
          </StyledCard>

          <StyledCard title="3. Payment Terms">
            <Title level={4}>3.1 Payment Schedule</Title>
            <Paragraph>
              • Advance payment: 50% of total amount at time of booking<br />
              • Balance payment: 50% at least 15 days before exhibition start date<br />
              • Service charges: Payable as per agreed terms<br />
              • Late payment may result in cancellation of booking
            </Paragraph>

            <Title level={4}>3.2 Payment Methods</Title>
            <Paragraph>
              We accept payments through bank transfer, online payment gateways, cheques, and digital wallets. 
              All payments should be made in Indian Rupees (INR) unless otherwise specified.
            </Paragraph>
          </StyledCard>

          <StyledCard title="4. Cancellation & Refund Policy">
            <Paragraph>
              • Cancellations made 30+ days before exhibition: 80% refund<br />
              • Cancellations made 15-29 days before: 50% refund<br />
              • Cancellations made 7-14 days before: 25% refund<br />
              • Cancellations made less than 7 days before: No refund<br />
              • Processing fee of 5% applicable on all refunds
            </Paragraph>
          </StyledCard>

          <StyledCard title="5. Force Majeure">
            <Paragraph>
              Aakar Exhibition shall not be liable for any failure or delay in performance under this agreement which is due to 
              fire, casualty, flood, earthquake, other acts of God, strikes, labor disputes, wars, government regulations, 
              communications or power failures, equipment or software malfunctions, or other circumstances beyond our reasonable control.
            </Paragraph>
          </StyledCard>

          <StyledCard title="6. Liability & Insurance">
            <Title level={4}>6.1 Limitation of Liability</Title>
            <Paragraph>
              Aakar Exhibition's liability is limited to the amount paid by the exhibitor for the specific service. 
              We are not responsible for any indirect, incidental, special, or consequential damages.
            </Paragraph>

            <Title level={4}>6.2 Insurance</Title>
            <Paragraph>
              Exhibitors are strongly advised to obtain comprehensive insurance coverage for their exhibits, equipment, 
              and personnel. Aakar Exhibition does not provide insurance coverage for exhibitor property.
            </Paragraph>
          </StyledCard>

          <StyledCard title="7. Intellectual Property">
            <Paragraph>
              All content, trademarks, and intellectual property on our platform remain the property of Aakar Exhibition 
              or respective owners. Exhibitors retain rights to their own materials but grant us permission to use 
              exhibition-related content for promotional purposes.
            </Paragraph>
          </StyledCard>

          <StyledCard title="8. Privacy & Data Protection">
            <Paragraph>
              We are committed to protecting your privacy and personal information. Please refer to our Privacy Policy 
              for detailed information about how we collect, use, and protect your data.
            </Paragraph>
          </StyledCard>

          <StyledCard title="9. Dispute Resolution">
            <Paragraph>
              Any disputes arising from these terms shall be resolved through arbitration in Ahmedabad, Gujarat, India. 
              The courts of Ahmedabad shall have exclusive jurisdiction over any legal proceedings.
            </Paragraph>
          </StyledCard>

          <StyledCard title="10. Modifications">
            <Paragraph>
              Aakar Exhibition reserves the right to modify these terms and conditions at any time. 
              Updated terms will be posted on our website, and continued use of our services constitutes acceptance of the modified terms.
            </Paragraph>
          </StyledCard>

          <Divider />

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Paragraph style={{ fontSize: '16px', color: '#666' }}>
              <Text strong>Questions about these terms?</Text><br />
              Contact us: support@aakarexhibition.com | 7016727956
            </Paragraph>
            <Paragraph style={{ fontSize: '14px', color: '#999', marginTop: '20px' }}>
              Last updated: January 1, 2024
            </Paragraph>
          </div>
        </PageContainer>
      </StyledContent>
      <GlobalFooter />
    </Layout>
  );
};

export default TermsConditions; 