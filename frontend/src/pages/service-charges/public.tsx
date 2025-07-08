import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Steps, 
  Card, 
  Row, 
  Col, 
  Typography, 
  message, 
  Divider, 
  Space, 
  Alert,
  Descriptions,
  Spin,
  Result,
  Tag,
  Layout
} from 'antd';
import { 
  ShoppingCartOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  HomeOutlined, 
  BankOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  LockOutlined
} from '@ant-design/icons';
import publicServiceChargeService from '../../services/publicServiceCharge';
import GlobalHeader from '../../components/layout/GlobalHeader';
import GlobalFooter from '../../components/layout/GlobalFooter';
import './ServiceCharges.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;
const { TextArea } = Input;
const { Content } = Layout;

interface ServiceType {
  type: string;
  amount: number;
  description?: string;
}

interface ExhibitionConfig {
  _id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  config: {
    isEnabled: boolean;
    title: string;
    description: string;
    serviceTypes: ServiceType[];
    paymentGateway: 'phonepe';
    phonePeConfig: {
      clientId: string;
      env: 'SANDBOX' | 'PRODUCTION';
    };
  };
}

interface FormData {
  vendorName: string;
  companyName: string;
  exhibitorCompanyName?: string;
  vendorEmail?: string;
  vendorPhone: string;
  stallNumber: string;
  vendorAddress: string;
  serviceType: string;
  description?: string;
}

const PublicServiceChargeForm: React.FC = () => {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exhibition, setExhibition] = useState<ExhibitionConfig | null>(null);
  const [formData, setFormData] = useState<FormData>({
    vendorName: '',
    companyName: '',
    exhibitorCompanyName: '',
    vendorEmail: '',
    vendorPhone: '',
    stallNumber: '',
    vendorAddress: '',
    serviceType: '',
  });
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);

  // Check if we're on payment result page (handle multiple possible paths)
  const isPaymentResultPage = location.pathname === '/service-charge/payment-result' || 
                              location.pathname === '/service-charge/payment-success' ||
                              location.search.includes('serviceChargeId=');
  
  useEffect(() => {
    console.log('[Payment Redirect] useEffect triggered:', {
      isPaymentResultPage,
      pathname: location.pathname,
      search: location.search,
      exhibitionId
    });
    
    if (isPaymentResultPage) {
      // Handle payment redirect (but not if we're already in success step)
      if (currentStep !== 2) {
        console.log('[Payment Redirect] Handling payment redirect');
        handlePaymentRedirect();
      } else {
        console.log('[Payment Redirect] Already in success step, skipping redirect handling');
      }
    } else if (exhibitionId) {
      console.log('[Payment Redirect] Fetching exhibition config for:', exhibitionId);
      fetchExhibitionConfig();
    } else {
      console.log('[Payment Redirect] No action taken - missing exhibitionId or not payment result page');
    }
  }, [exhibitionId, isPaymentResultPage, currentStep]);

  const restoreFormDataFromServiceCharge = async () => {
    try {
      console.log('[Payment Redirect] Restoring form data from service charge');
      
      const urlParams = new URLSearchParams(location.search);
      const serviceChargeId = urlParams.get('serviceChargeId');
      
      if (!serviceChargeId) {
        console.error('[Payment Redirect] No service charge ID found for form restoration');
        return;
      }
      
      // Fetch the service charge details
      const statusResponse = await publicServiceChargeService.getServiceChargeStatus(serviceChargeId);
      
      if (statusResponse.data.success) {
        const serviceCharge = statusResponse.data.data;
        
        console.log('[Payment Redirect] Service charge data retrieved for form restoration:', serviceCharge);
        
        // Restore form data from service charge record
        const restoredFormData = {
          vendorName: serviceCharge.vendorName || '',
          companyName: serviceCharge.companyName || '',
          exhibitorCompanyName: serviceCharge.exhibitorCompanyName || '',
          vendorEmail: serviceCharge.vendorEmail || '',
          vendorPhone: serviceCharge.vendorPhone || '',
          stallNumber: serviceCharge.stallNumber || '',
          vendorAddress: serviceCharge.vendorAddress || '',
          serviceType: serviceCharge.serviceType || '',
          description: serviceCharge.description || ''
        };
        
        console.log('[Payment Redirect] Restoring form data:', restoredFormData);
        
        // Set the form data
        setFormData(restoredFormData);
        
        // Restore exhibition config if not already loaded
        if (!exhibition && serviceCharge.exhibitionId) {
          const exhibitionId = typeof serviceCharge.exhibitionId === 'string' 
            ? serviceCharge.exhibitionId 
            : serviceCharge.exhibitionId._id || serviceCharge.exhibitionId.id;
          
          console.log('[Payment Redirect] Loading exhibition config for restored form:', exhibitionId);
          
          try {
            const exhibitionResponse = await publicServiceChargeService.getServiceChargeConfig(exhibitionId);
            if (exhibitionResponse.data.success) {
              setExhibition(exhibitionResponse.data.data);
              console.log('[Payment Redirect] Exhibition config loaded for restored form');
            }
          } catch (exhibitionError) {
            console.error('[Payment Redirect] Failed to load exhibition config for restored form:', exhibitionError);
          }
        }
        
        // Update the form fields with restored data
        form.setFieldsValue(restoredFormData);
        
        console.log('[Payment Redirect] Form data restoration completed');
      } else {
        console.error('[Payment Redirect] Failed to fetch service charge for form restoration');
      }
    } catch (error) {
      console.error('[Payment Redirect] Error restoring form data:', error);
    }
  };

  const handlePaymentRedirect = async () => {
    // Prevent multiple verification attempts
    if (verificationInProgress) {
      console.log('[Payment Redirect] Verification already in progress, skipping');
      return;
    }

    try {
      setVerificationInProgress(true);
      
      const urlParams = new URLSearchParams(location.search);
      const serviceChargeId = urlParams.get('serviceChargeId');
      const gateway = urlParams.get('gateway');
      
      console.log('[Payment Redirect] Starting payment verification:', {
        serviceChargeId,
        gateway,
        currentPath: location.pathname,
        allUrlParams: Object.fromEntries(urlParams.entries())
      });
      
      if (!serviceChargeId) {
        console.error('[Payment Redirect] Missing service charge ID');
        message.error('Payment verification failed: Missing service charge ID');
        
        // Try to extract from URL in case it's in a different format
        const urlPath = location.pathname;
        const urlSearchParams = new URLSearchParams(location.search);
        console.log('[Payment Redirect] URL details:', {
          pathname: urlPath,
          searchParams: Object.fromEntries(urlSearchParams.entries()),
          fullUrl: window.location.href
        });
        
        navigate('/');
        return;
      }

      setLoading(true);
      
      // Get service charge details using the service method
      const statusResponse = await publicServiceChargeService.getServiceChargeStatus(serviceChargeId);
      
      if (!statusResponse.data.success) {
        console.error('[Payment Redirect] Status fetch failed:', statusResponse.data);
        throw new Error(statusResponse.data.message || 'Failed to get service charge details');
      }

      const serviceCharge = statusResponse.data.data;
      
      // Ensure we have exhibition config loaded
      if (!exhibition && serviceCharge.exhibitionId) {
        try {
          // Handle both string ID and populated object
          const exhibitionId = typeof serviceCharge.exhibitionId === 'string' 
            ? serviceCharge.exhibitionId 
            : serviceCharge.exhibitionId._id || serviceCharge.exhibitionId.id;
          
          console.log('[Payment Redirect] Loading exhibition config for ID:', exhibitionId);
          
          const exhibitionResponse = await publicServiceChargeService.getServiceChargeConfig(exhibitionId);
          if (exhibitionResponse.data.success) {
            setExhibition(exhibitionResponse.data.data);
            console.log('[Payment Redirect] Exhibition config loaded successfully');
          }
        } catch (configError) {
          console.warn('[Payment Redirect] Failed to load exhibition config:', configError);
        }
      }
      
      // Check if payment is already verified
      if (serviceCharge.paymentStatus === 'paid') {
        console.log('[Payment Redirect] Payment already verified, showing success');
        // Ensure we have all the required data for the success step
        const paymentData = {
          serviceChargeId: serviceCharge._id || serviceCharge.id,
          receiptNumber: serviceCharge.receiptNumber,
          paymentId: serviceCharge.phonePeTransactionId || serviceCharge.paymentId,
          amount: serviceCharge.amount,
          paidAt: serviceCharge.paidAt,
          receiptGenerated: serviceCharge.receiptGenerated,
          receiptDownloadUrl: serviceCharge.receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id || serviceCharge.id}` : null
        };
        
        setPaymentResult(paymentData);
        setCurrentStep(2);
        setLoading(false); // Stop loading immediately when payment is verified
        message.success('Payment verified successfully!');
        return;
      }

      // Handle PhonePe payment verification
      if (gateway === 'phonepe') {
        console.log('[Payment Redirect] Processing PhonePe payment verification');
        
        let merchantTransactionId = serviceCharge.phonePeMerchantTransactionId || serviceCharge.receiptNumber;
        
        if (!merchantTransactionId) {
          console.error('[Payment Redirect] Missing PhonePe merchant transaction ID');
          message.error('Payment verification failed: Missing PhonePe transaction details');
          setCurrentStep(1);
          return;
        }
        
        console.log('[Payment Redirect] Verifying PhonePe payment for merchant ID:', merchantTransactionId);
        message.loading('Verifying payment with PhonePe...', 0);
        
        // Add retry mechanism for payment verification
        const verifyPaymentWithRetry = async (retryCount = 0): Promise<void> => {
          const maxRetries = 3;
          const retryDelay = 2000; // 2 seconds
          
          try {
            console.log(`[Payment Verification] Attempt ${retryCount + 1}/${maxRetries + 1} for merchant ID:`, merchantTransactionId);
            
            const verifyResponse = await publicServiceChargeService.verifyPhonePePayment({
              merchantTransactionId: merchantTransactionId
            });

            console.log('[Payment Verification] Full response:', verifyResponse);
            console.log('[Payment Verification] Response data:', verifyResponse.data);
            console.log('[Payment Verification] Response success:', verifyResponse.data?.success);
            
            // Check if verification was successful
            if (verifyResponse.data && verifyResponse.data.success) {
              console.log('[Payment Verification] PhonePe payment verified successfully');
              console.log('[Payment Verification] Payment result data:', verifyResponse.data.data);
              
              message.destroy();
              setPaymentResult(verifyResponse.data.data);
              setCurrentStep(2);
              setLoading(false); // Stop loading immediately when payment is verified
              message.success('Payment verified successfully!');
              return;
            } 
            
            // Check if payment is still pending (might need retry)
            const state = verifyResponse.data?.data?.state;
            const isPending = state === 'PENDING' || state === 'PROCESSING';
            
            if (isPending && retryCount < maxRetries) {
              console.log(`[Payment Verification] Payment still pending (${state}), retrying in ${retryDelay}ms...`);
              message.destroy();
              message.loading(`Payment is being processed... (Attempt ${retryCount + 2}/${maxRetries + 1})`, 0);
              
              setTimeout(() => {
                verifyPaymentWithRetry(retryCount + 1);
              }, retryDelay);
              return;
            }
            
            // Payment failed or max retries reached
            console.error('[Payment Verification] PhonePe payment verification failed:', {
              response: verifyResponse.data,
              state,
              retryCount,
              maxRetries
            });
            
            message.destroy();
            const errorMessage = verifyResponse.data?.message || 
              (retryCount >= maxRetries ? 'Payment verification timeout. Please check your payment status.' : 'Payment verification failed');
            message.error(errorMessage);
            
            // Restore form data from service charge record before going back to payment step
            await restoreFormDataFromServiceCharge();
            
            // Small delay to ensure form and exhibition data are loaded
            setTimeout(() => {
              setCurrentStep(1);
            }, 500);
            
          } catch (verifyError: any) {
            console.error(`[Payment Verification] Error on attempt ${retryCount + 1}:`, verifyError);
            
            // If it's a network error and we haven't exhausted retries
            if (retryCount < maxRetries && (verifyError.code === 'NETWORK_ERROR' || verifyError.message?.includes('fetch'))) {
              console.log(`[Payment Verification] Network error, retrying in ${retryDelay}ms...`);
              message.destroy();
              message.loading(`Connection error, retrying... (Attempt ${retryCount + 2}/${maxRetries + 1})`, 0);
              
              setTimeout(() => {
                verifyPaymentWithRetry(retryCount + 1);
              }, retryDelay);
              return;
            }
            
            // Final error - no more retries
            message.destroy();
            console.error('[Payment Verification] Final verification error:', verifyError);
            message.error('Payment verification failed. Please use the "Check Payment Status" button if you completed the payment.');
            
            // Restore form data from service charge record before going back to payment step
            await restoreFormDataFromServiceCharge();
            
            // Small delay to ensure form and exhibition data are loaded
            setTimeout(() => {
              setCurrentStep(1);
            }, 500);
          }
        };
        
        // Start verification with retry (add small delay to ensure callback is processed)
        setTimeout(() => {
          verifyPaymentWithRetry();
        }, 1000); // 1 second delay
      }
    } catch (error: any) {
      console.error('[Payment Redirect] Error:', error);
      
      // Check if it's a 404 error (service charge not found)
      if (error.response?.status === 404 || error.message?.includes('404')) {
        message.error('Payment record not found. Please contact support if you completed the payment.');
        navigate('/');
      } else if (error.response?.status === 400) {
        message.error('Invalid payment details. Please try again.');
        navigate('/');
      } else {
        message.error('Payment verification failed. Please try again or contact support.');
        // Try to restore form data before navigating away
        try {
          await restoreFormDataFromServiceCharge();
          // If restoration is successful, stay on the page and go to payment step
          setTimeout(() => {
            setCurrentStep(1);
          }, 500);
        } catch (restoreError) {
          console.error('[Payment Redirect] Failed to restore form data, navigating to home:', restoreError);
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
      setVerificationInProgress(false);
    }
  };

  const fetchExhibitionConfig = async () => {
    try {
      setLoading(true);
      const response = await publicServiceChargeService.getServiceChargeConfig(exhibitionId!);
      setExhibition(response.data.data);
    } catch (error) {
      console.error('Error fetching exhibition config:', error);
      message.error('Failed to load exhibition configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    });
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePayment = async () => {
    try {
      setSubmitting(true);
      
      const selectedService = exhibition?.config.serviceTypes.find(
        service => service.type === formData.serviceType
      );
      
      if (!selectedService) {
        message.error('Invalid service type selected');
        return;
      }

      const paymentData = {
        exhibitionId: exhibition?._id,
        ...formData,
        amount: selectedService.amount,
        description: formData.description || selectedService.description
      };

      console.log('[Payment] Creating PhonePe payment order:', paymentData);
      
      const orderResponse = await publicServiceChargeService.createPaymentOrder(paymentData);
      
      if (orderResponse.data.success) {
        const orderData = orderResponse.data;
        console.log('[Payment] PhonePe order created:', orderData);
        
        // PhonePe redirects to payment page
        if (orderData.data.redirectUrl) {
          console.log('[Payment] Redirecting to PhonePe payment page:', orderData.data.redirectUrl);
          window.location.href = orderData.data.redirectUrl;
        } else {
          throw new Error('PhonePe redirect URL not received');
        }
      } else {
        throw new Error(orderResponse.data.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('[Payment] Error creating payment order:', error);
      message.error('Failed to initiate payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedServiceAmount = () => {
    // Return 0 if exhibition or formData is not properly loaded yet
    if (!exhibition?.config?.serviceTypes || !formData.serviceType) {
      return 0;
    }
    
    const selectedService = exhibition.config.serviceTypes.find(
      service => service.type === formData.serviceType
    );
    return selectedService ? selectedService.amount : 0;
  };

  const handleManualPaymentCheck = async () => {
    try {
      setSubmitting(true);
      message.loading('Checking payment status...', 0);
      
      // Check if we have a service charge ID in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const serviceChargeId = urlParams.get('serviceChargeId');
      
      if (!serviceChargeId) {
        message.destroy();
        message.error('No payment ID found. Please initiate payment first.');
        return;
      }

      // Fetch the service charge status
      const statusResponse = await publicServiceChargeService.getServiceChargeStatus(serviceChargeId);
      
      if (statusResponse.data.success) {
        const serviceCharge = statusResponse.data.data;
        
        if (serviceCharge.paymentStatus === 'paid') {
          message.destroy();
          message.success('Payment found! Redirecting to success page...');
          
          // Prepare payment result data
          const paymentData = {
            serviceChargeId: serviceCharge._id,
            receiptNumber: serviceCharge.receiptNumber,
            paymentId: serviceCharge.phonePeTransactionId,
            amount: serviceCharge.amount,
            paidAt: serviceCharge.paidAt,
            receiptGenerated: serviceCharge.receiptGenerated,
            receiptDownloadUrl: serviceCharge.receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id}` : null,
            state: 'COMPLETED'
          };
          
          setPaymentResult(paymentData);
          setCurrentStep(2);
        } else {
          message.destroy();
          message.info(`Payment status: ${serviceCharge.paymentStatus}. Please try again if you have completed the payment.`);
        }
      } else {
        message.destroy();
        message.error('Could not check payment status. Please try again.');
      }
    } catch (error) {
      message.destroy();
      console.error('Error checking payment status:', error);
      message.error('Error checking payment status. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderVendorDetailsStep = () => (
    <Card className="step-card">
      <div className="step-header">
        <ShoppingCartOutlined className="step-icon" />
        <Title level={3}>Service Details</Title>
        <Paragraph type="secondary">
          Please provide your vendor details and select the service type.
        </Paragraph>
      </div>

      <Form form={form} layout="vertical" initialValues={formData}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="vendorName"
              label="Vendor Name"
              rules={[{ required: true, message: 'Please enter vendor name' }]}
            >
              <Input placeholder="Enter vendor name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="companyName"
              label="Vendor Company Name"
              rules={[{ required: true, message: 'Please enter vendor company name' }]}
            >
              <Input placeholder="Enter vendor company name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="exhibitorCompanyName"
              label="Exhibitor Company Name"
              tooltip="The company name of the exhibitor (if different from vendor)"
            >
              <Input placeholder="Enter exhibitor company name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="stallNumber"
              label="Stall Number"
              rules={[{ required: true, message: 'Please enter stall number' }]}
            >
              <Input placeholder="Enter stall number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="vendorPhone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter phone number' },
                { pattern: /^[0-9+\-\s()]{10,}$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="vendorEmail"
              label="Email Address"
              rules={[
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter email address" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="vendorAddress"
          label="Address"
        >
          <TextArea rows={3} placeholder="Enter complete address" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="serviceType"
              label="Service Type"
              rules={[{ required: true, message: 'Please select service type' }]}
            >
              <Select placeholder="Select service type">
                {exhibition?.config.serviceTypes.map(service => (
                  <Option key={service.type} value={service.type}>
                    {service.type} - ₹{service.amount.toLocaleString()}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Additional Description"
            >
              <TextArea rows={2} placeholder="Any additional details" />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className="step-actions">
        <Button type="primary" onClick={handleNext} size="large">
          Next
        </Button>
      </div>
    </Card>
  );

  const renderPaymentStep = () => {
    // Show loading if data is being restored
    if (!exhibition || !formData.serviceType) {
      return (
        <Card className="step-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Loading payment details...</div>
          </div>
        </Card>
      );
    }

    const selectedService = exhibition.config.serviceTypes.find(
      service => service.type === formData.serviceType
    );

    const isDevelopmentMode = exhibition.config.phonePeConfig?.env === 'SANDBOX';

    return (
      <Card className="step-card">
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
          <Descriptions.Item label="Phone">{formData.vendorPhone}</Descriptions.Item>
          {formData.vendorEmail && (
            <Descriptions.Item label="Email">{formData.vendorEmail}</Descriptions.Item>
          )}
          <Descriptions.Item label="Service Type">{formData.serviceType}</Descriptions.Item>
          <Descriptions.Item label="Amount">
            <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
              ₹{selectedService?.amount.toLocaleString()}
            </Text>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {isDevelopmentMode ? (
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
            <Button onClick={handlePrevious} size="large">
              Previous
            </Button>
            <Button
              type="primary"
              size="large"
              loading={submitting}
              onClick={handlePayment}
              icon={<BankOutlined />}
            >
              {isDevelopmentMode
                ? `Simulate PhonePe Payment ₹${getSelectedServiceAmount().toLocaleString()}`
                : `Pay via PhonePe ₹${getSelectedServiceAmount().toLocaleString()}`}
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
                  onClick={handleManualPaymentCheck}
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

  const renderSuccessStep = () => (
    <Card className="step-card success-card">
      <Result
        status="success"
        title="Payment Successful!"
        subTitle={`Your service charge payment of ₹${paymentResult?.amount?.toLocaleString()} has been processed successfully.`}
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
                ₹{paymentResult?.amount?.toLocaleString()}
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
              <Button onClick={() => navigate('/')}>
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

  const steps = [
    {
      title: 'Service Details',
      content: renderVendorDetailsStep(),
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Payment',
      content: renderPaymentStep(),
      icon: <CreditCardOutlined />
    },
    {
      title: 'Success',
      content: renderSuccessStep(),
      icon: <CheckCircleOutlined />
    }
  ];

  if (loading) {
    console.log('[Payment Redirect] Component loading state:', {
      isPaymentResultPage,
      pathname: location.pathname,
      search: location.search,
      exhibitionId
    });
    
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh' 
          }}>
            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  // Handle payment result page even if exhibition is not loaded yet
  if (isPaymentResultPage && !exhibition && currentStep !== 2) {
    console.log('[Payment Redirect] Payment result page loading - exhibition config not loaded yet');
    
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh' 
          }}>
            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  if (!exhibition && currentStep !== 2) {
    console.log('[Payment Redirect] Exhibition not found and not payment result page');
    
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ padding: '50px' }}>
            <Result
              status="404"
              title="Exhibition Not Found"
              subTitle="The exhibition you're looking for doesn't exist or service charges are not enabled."
              extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
            />
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  return (
    <Layout>
      <GlobalHeader />
      <Content style={{ paddingTop: '64px', background: '#f5f5f5' }}>
        <div className="public-service-charge-form">
          <div className="form-container">
            {exhibition && (
              <Card className="header-card">
                <div style={{ textAlign: 'center' }}>
                  <Title level={2}>{exhibition.config.title}</Title>
                  <Paragraph>{exhibition.config.description}</Paragraph>
                  <Space>
                    <InfoCircleOutlined />
                    <Text strong>{exhibition.name}</Text>
                    <Divider type="vertical" />
                    <Text>{exhibition.venue}</Text>
                  </Space>
                </div>
              </Card>
            )}

            <Card className="steps-card">
              <Steps 
                current={currentStep} 
                items={steps.map(step => ({
                  title: step.title,
                  icon: step.icon
                }))}
              />
            </Card>

            <Form
              form={form}
              layout="vertical"
              initialValues={formData}
              onValuesChange={(_, allValues) => setFormData({ ...formData, ...allValues })}
            >
              {steps[currentStep].content}
            </Form>
          </div>
        </div>
      </Content>
      <GlobalFooter />
    </Layout>
  );
};

export default PublicServiceChargeForm; 