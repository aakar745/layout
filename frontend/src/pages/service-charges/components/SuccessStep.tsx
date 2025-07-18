import React from 'react';
import { Button, Card, Space, Alert, Descriptions, Result, Tag, Typography } from 'antd';
import { PaymentResult } from '../types';

const { Text } = Typography;

interface SuccessStepProps {
  paymentResult: PaymentResult | null;
  onNavigateHome: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  paymentResult,
  onNavigateHome
}) => {
  return (
    <Card className="step-card success-card">
      <Result
        status="success"
        title="Payment Successful!"
        subTitle={`Your service charge payment of ₹${paymentResult?.amount?.toLocaleString()} (inclusive of GST) has been processed successfully.`}
        extra={[
          <div key="details" style={{ textAlign: 'left', margin: '20px 0' }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Receipt Number">
                <Tag color="blue">{paymentResult?.receiptNumber}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment ID">
                {paymentResult?.paymentId || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                ₹{paymentResult?.amount?.toLocaleString()} <Text type="secondary" style={{ fontSize: '11px' }}>(Incl. GST)</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Date">
                {paymentResult?.paidAt ? new Date(paymentResult.paidAt).toLocaleString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="green">Paid</Tag>
              </Descriptions.Item>
              {paymentResult?.state && (
                <Descriptions.Item label="PhonePe Status">
                  <Tag color="green">{paymentResult.state}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>,
          <div key="actions">
            <Space>
              {paymentResult?.receiptDownloadUrl && (
                <Button
                  type="primary"
                  href={paymentResult.receiptDownloadUrl}
                  target="_blank"
                  download
                >
                  Download Receipt
                </Button>
              )}
              <Button onClick={onNavigateHome}>
                Back to Home
              </Button>
            </Space>
          </div>,
          <div key="help" style={{ marginTop: '16px' }}>
            <Alert
              message="Need Help?"
              description="If you don't see your receipt or have any issues, please save your Receipt Number and contact support."
              type="info"
              showIcon
              style={{ textAlign: 'left' }}
            />
          </div>
        ]}
      />
    </Card>
  );
};

export default SuccessStep; 