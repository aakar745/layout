import React, { useState } from 'react';
import { Button, Card, Space, Alert, Descriptions, Result, Tag, Typography, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PaymentResult } from '../types';
import { apiUrl } from '../../../config';

const { Text } = Typography;

interface SuccessStepProps {
  paymentResult: PaymentResult | null;
  onNavigateHome: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  paymentResult,
  onNavigateHome
}) => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownloadReceipt = async (serviceChargeId: string, receiptNumber?: string) => {
    try {
      setDownloadLoading(true);
      message.loading({ content: 'Preparing receipt for download...', key: 'receipt-download' });
      
      // Use the correct backend API URL
      const response = await fetch(`${apiUrl}/public/service-charge/receipt/${serviceChargeId}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Receipt-${receiptNumber || serviceChargeId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        message.success({ content: 'Receipt downloaded successfully', key: 'receipt-download' });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      message.error({ content: 'Failed to download receipt', key: 'receipt-download' });
    } finally {
      setDownloadLoading(false);
    }
  };
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
              {paymentResult?.serviceChargeId && (
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadReceipt(paymentResult.serviceChargeId, paymentResult.receiptNumber)}
                  loading={downloadLoading}
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