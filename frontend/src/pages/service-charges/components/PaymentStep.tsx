import React from 'react';
import { 
  Button, 
  Card, 
  Space, 
  Alert,
  Descriptions,
  Spin,
  Divider,
  Typography
} from 'antd';
import { 
  CreditCardOutlined, 
  BankOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  LockOutlined,
  CloseCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import api from '../../../services/api';
import { 
  ExhibitionConfig, 
  ServiceChargeStall, 
  FormData, 
  PaymentStatus 
} from '../types';
import { 
  calculateServiceCharge, 
  formatDimensions, 
  isDevelopmentMode,
  getPricingInfo 
} from '../utils/serviceChargeCalculator';

const { Title, Paragraph, Text } = Typography;

interface PaymentStepProps {
  exhibition: ExhibitionConfig | null;
  stalls: ServiceChargeStall[];
  selectedStall: ServiceChargeStall | null;
  formData: FormData;
  paymentStatus: PaymentStatus;
  submitting: boolean;
  onPayment: () => Promise<void>;
  onPrevious: () => void;
  onManualPaymentCheck: () => Promise<void>;
  onCancelPayment: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  exhibition,
  stalls,
  selectedStall,
  formData,
  paymentStatus,
  submitting,
  onPayment,
  onPrevious,
  onManualPaymentCheck,
  onCancelPayment
}) => {
  // Show loading if exhibition data is not loaded yet
  if (!exhibition) {
    return (
      <Card className="step-card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading exhibition details...</div>
        </div>
      </Card>
    );
  }

  // Calculate service charge amount
  const serviceChargeAmount = calculateServiceCharge(exhibition, stalls, selectedStall, formData);

  // Show error if unable to calculate service charge, but ONLY if payment status is not failed
  // This prevents redirection to calculation error for failed payments
  if (!serviceChargeAmount && paymentStatus !== 'failed') {
    return (
      <Card className="step-card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Alert
            message="Unable to Calculate Service Charge"
            description="Please go back and ensure all required information is provided."
            type="warning"
            showIcon
            action={
              <Button onClick={onPrevious} type="primary">
                Go Back
              </Button>
            }
          />
        </div>
      </Card>
    );
  }

  // Handle failed payment case
  if (paymentStatus === 'failed') {
    return (
      <Card className="step-card payment-step-card">
        <div className="step-header">
          <CloseCircleOutlined className="step-icon" style={{ color: '#f5222d' }} />
          <Title level={3}>Payment Failed</Title>
          <Paragraph type="secondary">
            Your payment was not successful. You can try again or start over.
          </Paragraph>
        </div>

        <Alert
          message="Payment could not be completed"
          description="The payment gateway reported that your transaction failed. This could be due to insufficient funds, transaction limits, or other payment issues."
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Vendor Name">{formData.vendorName}</Descriptions.Item>
          <Descriptions.Item label="Company Name">{formData.companyName}</Descriptions.Item>
          <Descriptions.Item label="Stall Number">{formData.stallNumber}</Descriptions.Item>
          <Descriptions.Item label="Service Charge">
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
              ₹{(formData.originalAmount || serviceChargeAmount || 0).toLocaleString()}
            </Text>
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '11px', color: '#666' }}>
                (Inclusive of GST)
              </Text>
            </div>
          </Descriptions.Item>
        </Descriptions>

        <div className="step-actions" style={{ marginTop: '24px', textAlign: 'center' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Button
              type="primary"
              size="large"
              icon={<ReloadOutlined />}
              onClick={onPayment}
              loading={submitting}
            >
              Try Payment Again
            </Button>
            
            <Button 
              size="large" 
              danger
              icon={<CloseCircleOutlined />}
              onClick={onCancelPayment}
            >
              Cancel & Start Over
            </Button>
          </Space>
        </div>
      </Card>
    );
  }

  const isDevelopment = isDevelopmentMode(exhibition);
  const pricingInfo = getPricingInfo(exhibition);

  console.log('[Payment Step] Rendering payment step:', {
    exhibition: !!exhibition,
    formData: formData,
    serviceChargeAmount: serviceChargeAmount,
    isDevelopment: isDevelopment,
    paymentStatus: paymentStatus
  });

  // Default payment step UI
  return (
    <Card className="step-card payment-step-card">
      <div className="step-header">
        <CreditCardOutlined className="step-icon" />
        <Title level={3}>Payment Details</Title>
        <Paragraph type="secondary">
          Review your details and proceed with payment.
        </Paragraph>
      </div>

      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Vendor Name">{formData.vendorName}</Descriptions.Item>
        <Descriptions.Item label="Company Name">{formData.companyName}</Descriptions.Item>
        {formData.exhibitorCompanyName && (
          <Descriptions.Item label="Exhibitor Company">{formData.exhibitorCompanyName}</Descriptions.Item>
        )}
        <Descriptions.Item label="Stall Number">{formData.stallNumber}</Descriptions.Item>
        {selectedStall && (
          <>
            <Descriptions.Item label="Stall Area">{selectedStall.stallArea} sqm</Descriptions.Item>
            <Descriptions.Item label="Stall Dimensions">{formatDimensions(selectedStall.dimensions)}</Descriptions.Item>
          </>
        )}
        <Descriptions.Item label="Phone">{formData.vendorPhone}</Descriptions.Item>
        {formData.uploadedImage && (
          <Descriptions.Item label="Uploaded Image">
            <div style={{ marginTop: '8px' }}>
              <img
                src={formData.uploadedImage.startsWith('http') ? formData.uploadedImage : `${api.defaults.baseURL}/public/uploads/${formData.uploadedImage}`}
                alt="Service charge attachment"
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  objectFit: 'contain',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'block'
                }}
                onClick={() => {
                  window.open(`${api.defaults.baseURL}/public/uploads/${formData.uploadedImage}`, '_blank');
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div style="
                        color: #ff4d4f; 
                        padding: 16px; 
                        border: 1px dashed #ff4d4f; 
                        border-radius: 6px; 
                        text-align: center;
                        background-color: #fff2f0;
                        font-size: 12px;
                      ">
                        ❌ Image preview unavailable
                      </div>
                    `;
                  }
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.border = '1px solid #52c41a';
                }}
              />
              <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                📱 Click to view full size
                {formData.uploadedImage.toLowerCase().includes('heic') && (
                  <span style={{ color: '#1890ff', marginLeft: '4px' }}>
                    (Originally HEIC, converted to JPEG)
                  </span>
                )}
              </Text>
            </div>
          </Descriptions.Item>
        )}
        {/* Show service type only for legacy systems */}
        {formData.serviceType && stalls.length === 0 && (
          <Descriptions.Item label="Service Type">{formData.serviceType}</Descriptions.Item>
        )}
        <Descriptions.Item label="Service Charge">
          <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
            ₹{serviceChargeAmount.toLocaleString()}
          </Text>
          <div style={{ marginTop: '4px' }}>
            <Text type="secondary" style={{ fontSize: '11px', color: '#666' }}>
              (Inclusive of GST)
            </Text>
          </div>
          {selectedStall && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {selectedStall.stallArea <= pricingInfo.threshold ? `Small stall pricing (≤${pricingInfo.threshold} sqm)` : `Large stall pricing (>${pricingInfo.threshold} sqm)`}
              </Text>
            </div>
          )}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        {isDevelopment ? (
          <Alert
            message="Development Mode"
            description="This is running in development mode. PhonePe payment will be simulated - no actual payment will be processed."
            type="warning"
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: 16 }}
            showIcon
          />
        ) : (
          <Alert
            message="Secure Payment"
            description="Your payment is processed securely through PhonePe. You will receive a receipt via email after successful payment."
            type="info"
            icon={<LockOutlined />}
            style={{ marginBottom: 16 }}
          />
        )}
      </div>

      <div className="step-actions">
        <Space>
          <Button onClick={onPrevious} size="large">
            Previous
          </Button>
          <Button
            type="primary"
            size="large"
            loading={submitting}
            onClick={onPayment}
            icon={<BankOutlined />}
          >
            {isDevelopment
              ? `Simulate PhonePe Payment ₹${serviceChargeAmount.toLocaleString()} (Incl. GST)`
              : `Pay via PhonePe ₹${serviceChargeAmount.toLocaleString()} (Incl. GST)`}
          </Button>
        </Space>
      </div>
      
      <div className="payment-help" style={{ marginTop: '16px', textAlign: 'center' }}>
        <Alert
          message="Already completed payment?"
          description={
            <div>
              If you've completed the payment but it's not reflecting, click the button below to check your payment status.
              <br />
              <Button 
                type="link" 
                size="small" 
                onClick={onManualPaymentCheck}
                loading={submitting}
                style={{ marginTop: '8px' }}
              >
                Check Payment Status
              </Button>
            </div>
          }
          type="info"
          showIcon
        />
      </div>
    </Card>
  );
};

export default PaymentStep; 