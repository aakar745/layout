import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Steps, 
  Row, 
  Col, 
  Typography, 
  message, 
  Space,
  Divider,
  Spin,
  Alert,
  Tag,
  Layout
} from 'antd';
import { 
  UserOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined
} from '@ant-design/icons';
import GlobalHeader from '../../components/layout/GlobalHeader';
import GlobalFooter from '../../components/layout/GlobalFooter';
import './ServiceCharges.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
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
    paymentGateway: 'razorpay' | 'phonepe';
    razorpayKeyId: string;
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

declare global {
  interface Window {
    Razorpay: any;
  }
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

  // Check if we're on payment result page (handles all PhonePe outcomes)
  const isPaymentResultPage = location.pathname === '/service-charge/payment-result';
  const isPaymentSuccessPage = location.pathname === '/service-charge/payment-success'; // Keep for Razorpay
  
  useEffect(() => {
    if (isPaymentResultPage || isPaymentSuccessPage) {
      // Handle payment redirect
      handlePaymentRedirect();
    } else if (exhibitionId) {
      fetchExhibitionConfig();
      loadRazorpayScript();
    }
  }, [exhibitionId, isPaymentResultPage, isPaymentSuccessPage]);

  const handlePaymentRedirect = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const serviceChargeId = urlParams.get('serviceChargeId');
      const gateway = urlParams.get('gateway');
      
      // Extract PhonePe specific parameters from URL
      const phonePeTransactionId = urlParams.get('transactionId'); // PhonePe sends this
      const phonePeCode = urlParams.get('code'); // PhonePe payment result code
      const phoneProvidReferenceId = urlParams.get('providerReferenceId'); // PhonePe reference ID
      
      console.log('[Payment Redirect] Starting payment verification:', {
        serviceChargeId,
        gateway,
        phonePeTransactionId,
        phonePeCode,
        phoneProvidReferenceId,
        currentPath: location.pathname,
        fullUrl: location.pathname + location.search,
        allUrlParams: Object.fromEntries(urlParams.entries())
      });
      
      // Log all URL parameters for debugging
      console.log('[Payment Redirect] All URL parameters received:');
      for (const [key, value] of urlParams.entries()) {
        console.log(`  ${key}: ${value}`);
      }
      
      if (!serviceChargeId) {
        console.error('[Payment Redirect] Missing service charge ID');
        message.error('Payment verification failed: Missing service charge ID');
        navigate('/');
        return;
      }

      setLoading(true);
      
      // First get service charge details to find merchant transaction ID
      console.log('[Payment Redirect] Fetching service charge status...');
      const statusResponse = await fetch(`/api/public/service-charge/status/${serviceChargeId}`);
      const statusData = await statusResponse.json();
      
      if (!statusResponse.ok) {
        console.error('[Payment Redirect] Status fetch failed:', statusData);
        throw new Error(statusData.message || 'Failed to get service charge details');
      }

      const serviceCharge = statusData.data;
      console.log('[Payment Redirect] Service charge details:', {
        id: serviceCharge.id,
        paymentStatus: serviceCharge.paymentStatus,
        status: serviceCharge.status,
        phonePeMerchantTransactionId: serviceCharge.phonePeMerchantTransactionId,
        razorpayOrderId: serviceCharge.razorpayOrderId
      });
      
      // Debug: Log the entire serviceCharge object to see what we're actually getting
      console.log('[Payment Redirect] Full service charge object:', serviceCharge);
      console.log('[Payment Redirect] Service charge keys:', Object.keys(serviceCharge));
      console.log('[Payment Redirect] phonePeMerchantTransactionId value:', serviceCharge.phonePeMerchantTransactionId);
      console.log('[Payment Redirect] phonePeMerchantTransactionId type:', typeof serviceCharge.phonePeMerchantTransactionId);
      
      // Ensure we have exhibition config loaded for proper rendering
      if (!exhibition && serviceCharge.exhibition) {
        console.log('[Payment Redirect] Loading exhibition config for payment result page');
        try {
          const exhibitionResponse = await fetch(`/api/public/service-charge/config/${serviceCharge.exhibition._id}`);
          if (exhibitionResponse.ok) {
            const exhibitionData = await exhibitionResponse.json();
            setExhibition(exhibitionData.data);
          }
        } catch (configError) {
          console.warn('[Payment Redirect] Failed to load exhibition config:', configError);
          // Continue without full config - we'll use basic info from service charge
        }
      }
      
      // Check if payment is already verified
      if (serviceCharge.paymentStatus === 'paid') {
        console.log('[Payment Redirect] Payment already verified, showing success');
        // Payment already verified - show success step
        setPaymentResult(serviceCharge);
        setCurrentStep(2);
        
        message.success('Payment verified successfully!');
        return;
      }

      // Handle PhonePe payment verification
      if (gateway === 'phonepe') {
        console.log('[Payment Redirect] Processing PhonePe payment verification');
        
        // Use merchant transaction ID from database or fallback to URL parameter
        let merchantTransactionId = serviceCharge.phonePeMerchantTransactionId;
        
        console.log('[Payment Redirect] Merchant Transaction ID from database:', {
          value: merchantTransactionId,
          type: typeof merchantTransactionId,
          isUndefined: merchantTransactionId === undefined,
          isNull: merchantTransactionId === null,
          isEmpty: merchantTransactionId === '',
          isFalsy: !merchantTransactionId
        });
        
        if (!merchantTransactionId && phonePeTransactionId) {
          console.log('[Payment Redirect] Using PhonePe transaction ID from URL as fallback:', phonePeTransactionId);
          merchantTransactionId = phonePeTransactionId;
        }
        
        // Also try receipt number as fallback (since that's what we use as merchant transaction ID)
        if (!merchantTransactionId && serviceCharge.receiptNumber) {
          console.log('[Payment Redirect] Using receipt number as merchant transaction ID fallback:', serviceCharge.receiptNumber);
          merchantTransactionId = serviceCharge.receiptNumber;
        }
        
        if (!merchantTransactionId) {
          console.error('[Payment Redirect] Missing PhonePe merchant transaction ID in all sources:');
          console.error('[Payment Redirect] - Database phonePeMerchantTransactionId:', serviceCharge.phonePeMerchantTransactionId);
          console.error('[Payment Redirect] - Database receiptNumber:', serviceCharge.receiptNumber);
          console.error('[Payment Redirect] - URL phonePeTransactionId:', phonePeTransactionId);
          console.error('[Payment Redirect] - Available URL parameters:', Object.fromEntries(urlParams.entries()));
          message.error('Payment verification failed: Missing PhonePe transaction details');
          setCurrentStep(1); // Go back to payment form instead of home
          return;
        }
        
        console.log('[Payment Redirect] Verifying PhonePe payment for merchant ID:', merchantTransactionId);
        console.log('[Payment Redirect] PhonePe URL parameters:', { phonePeCode, phoneProvidReferenceId });
        
        // Show loading message for PhonePe verification
        message.loading('Verifying payment with PhonePe...', 0);
        
        try {
          const verifyResponse = await fetch('/api/public/service-charge/verify-phonepe-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              merchantTransactionId: merchantTransactionId
            })
          });

          const verifyData = await verifyResponse.json();
          message.destroy(); // Clear loading message
          
          console.log('[Payment Verification] PhonePe verification response:', {
            ok: verifyResponse.ok,
            status: verifyResponse.status,
            success: verifyData.success,
            state: verifyData.data?.state,
            code: verifyData.data?.code,
            message: verifyData.message
          });
          
          if (verifyResponse.ok && verifyData.success) {
            // Payment verified successfully
            console.log('[Payment Verification] Payment verified successfully');
            setPaymentResult(verifyData.data);
            setCurrentStep(2);
            
            // Load exhibition details for context if not already loaded
            if (!exhibition && serviceCharge.exhibition) {
              try {
                const exhibitionResponse = await fetch(`/api/public/service-charge/config/${serviceCharge.exhibition._id}`);
                if (exhibitionResponse.ok) {
                  const exhibitionData = await exhibitionResponse.json();
                  setExhibition(exhibitionData.data);
                }
              } catch (configError) {
                console.warn('[Payment Verification] Failed to load exhibition config:', configError);
              }
            }
            
            message.success('Payment completed successfully!');
            return;
          } else {
            // Verification failed or still pending
            const state = verifyData.data?.state;
            const code = verifyData.data?.code;
            console.log('[Payment Verification] Payment verification not successful:', { state, code, verifyData });
            
            if (state === 'FAILED' || code === 'PAYMENT_ERROR') {
              message.error('Payment failed. Please try again.');
              setCurrentStep(1); // Go back to payment form
              return;
            } else if (state === 'PENDING' || code === 'PAYMENT_PENDING') {
              // Payment still pending - show pending message and retry
              message.warning('Payment is being processed. Please wait...');
              setTimeout(() => {
                handlePaymentRedirect();
              }, 5000); // Retry after 5 seconds
              return;
            } else {
              // Unknown state or error
              console.error('[Payment Verification] Unknown payment state or error:', verifyData);
              message.error(verifyData.message || 'Payment verification failed');
              setCurrentStep(1); // Go back to payment form
              return;
            }
          }
        } catch (verifyError) {
          console.error('[Payment Verification] Error during PhonePe verification:', verifyError);
          message.destroy(); // Clear loading message
          message.error('Payment verification failed due to network error');
          setCurrentStep(1); // Go back to payment form
          return;
        }
      } else if (!gateway || gateway === 'razorpay') {
        console.log('[Payment Redirect] Processing Razorpay payment verification');
        
        // Handle Razorpay verification (existing logic)
        if (serviceCharge.razorpayOrderId) {
          // This should have been handled by the Razorpay callback already
          message.warning('Payment verification in progress...');
          setTimeout(() => {
            handlePaymentRedirect();
          }, 3000);
        } else {
          console.error('[Payment Redirect] Missing Razorpay order details');
          message.error('Payment verification failed: Missing Razorpay transaction details');
          setCurrentStep(1); // Go back to payment form instead of home
        }
      } else {
        // Unknown gateway
        console.error('[Payment Redirect] Unknown payment gateway:', gateway);
        message.error(`Unknown payment gateway: ${gateway}`);
        setCurrentStep(1); // Go back to payment form instead of home
      }
    } catch (error: any) {
      console.error('[Payment Redirect] Payment verification error:', error);
      message.error(error.message || 'Payment verification failed');
      
      // Check if we have exhibition data to stay on the form
      if (exhibitionId) {
        setCurrentStep(1); // Go back to payment form instead of home
      } else {
        navigate('/'); // Only go to home if we can't stay on the form
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExhibitionConfig = async () => {
    try {
      const response = await fetch(`/api/public/service-charge/config/${exhibitionId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch exhibition config');
      }
      
      setExhibition(data.data);
    } catch (error: any) {
      message.error(error.message || 'Failed to load exhibition details');
      setTimeout(() => navigate('/'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleNext = () => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    });
  };

  const handlePrevious = () => {
    const values = form.getFieldsValue();
    setFormData({ ...formData, ...values });
    setCurrentStep(currentStep - 1);
  };

  const handlePayment = async () => {
    try {
      setSubmitting(true);
      
      // Create payment order
      const orderResponse = await fetch('/api/public/service-charge/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exhibitionId,
          ...formData,
          amount: getSelectedServiceAmount()
        })
      });

      const orderData = await orderResponse.json();
      
      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const paymentGateway = orderData.data.paymentGateway;
      
      if (paymentGateway === 'phonepe') {
        // PhonePe payment flow
        const isDevelopmentMode = exhibition?.config?.phonePeConfig?.clientId === 'phonepe_test_development_mode';
        
        if (isDevelopmentMode) {
          // Development mode - simulate payment success
          message.info('Development Mode: Simulating PhonePe payment...');
          setTimeout(async () => {
            await verifyPhonePePayment(orderData.data.orderId);
          }, 2000); // 2 second delay to simulate payment processing
        } else {
          // Production mode - redirect to PhonePe payment page
          if (orderData.data.redirectUrl) {
            window.location.href = orderData.data.redirectUrl;
          } else {
            throw new Error('PhonePe payment URL not received');
          }
        }
      } else {
        // Razorpay payment flow
        const isDevelopmentMode = exhibition?.config?.razorpayKeyId === 'rzp_test_development_mode';
        
        if (isDevelopmentMode) {
          // Development mode - simulate payment success
          message.info('Development Mode: Simulating Razorpay payment...');
          setTimeout(async () => {
            const mockResponse = {
              razorpay_order_id: orderData.data.orderId,
              razorpay_payment_id: `pay_dev_${Date.now()}`,
              razorpay_signature: `sig_dev_${Date.now()}`
            };
            await verifyRazorpayPayment(mockResponse, orderData.data.serviceChargeId);
          }, 2000); // 2 second delay to simulate payment processing
        } else {
          // Production mode - initialize Razorpay payment
          const options = {
            key: exhibition?.config?.razorpayKeyId,
            amount: orderData.data.amount * 100, // Convert to paise
            currency: 'INR',
            name: exhibition?.name,
            description: `Service Charge - ${formData.serviceType}`,
            order_id: orderData.data.orderId,
            prefill: {
              name: formData.vendorName,
              email: formData.vendorEmail,
              contact: formData.vendorPhone,
            },
            handler: async (response: any) => {
              await verifyRazorpayPayment(response, orderData.data.serviceChargeId);
            },
            modal: {
              ondismiss: () => {
                setSubmitting(false);
                message.warning('Payment cancelled');
              }
            }
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        }
      }
      
    } catch (error: any) {
      setSubmitting(false);
      message.error(error.message || 'Payment initialization failed');
    }
  };

  const verifyRazorpayPayment = async (paymentResponse: any, serviceChargeId: string) => {
    try {
      const verifyResponse = await fetch('/api/public/service-charge/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceChargeId,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        })
      });

      const verifyData = await verifyResponse.json();
      
      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'Payment verification failed');
      }

      setPaymentResult(verifyData.data);
      setCurrentStep(2);
      message.success('Payment successful!');
      
    } catch (error: any) {
      message.error(error.message || 'Payment verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const verifyPhonePePayment = async (merchantTransactionId: string) => {
    try {
      const verifyResponse = await fetch('/api/public/service-charge/verify-phonepe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantTransactionId
        })
      });

      const verifyData = await verifyResponse.json();
      
      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'Payment verification failed');
      }

      setPaymentResult(verifyData.data);
      setCurrentStep(2);
      message.success('Payment successful!');
      
    } catch (error: any) {
      message.error(error.message || 'Payment verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedServiceAmount = () => {
    const serviceType = exhibition?.config?.serviceTypes?.find(s => s.type === formData.serviceType);
    return serviceType?.amount || 0;
  };

  const renderVendorDetailsStep = () => (
    <Card title="Vendor Information" className="step-card">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="vendorName"
            label="Vendor Name"
            rules={[{ required: true, message: 'Please enter vendor name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter vendor name" />
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
        <Col span={12}>
          <Form.Item
            name="exhibitorCompanyName"
            label="Exhibitor Company Name (Optional)"
          >
            <Input placeholder="Enter exhibitor company name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="vendorEmail"
            label="Email (Optional)"
            rules={[
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter email address" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="vendorPhone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="stallNumber"
            label="Exhibitor Stall Number"
            rules={[{ required: true, message: 'Please enter the exhibitor stall number' }]}
          >
            <Input placeholder="Enter exhibitor stall number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="serviceType"
            label="Service Type"
            rules={[{ required: true, message: 'Please select service type' }]}
          >
            <Select placeholder="Select service type">
              {exhibition?.config?.serviceTypes?.map(service => (
                <Option key={service.type} value={service.type}>
                  {service.type} - ₹{service.amount.toLocaleString('en-IN')}
                </Option>
              )) || []}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="vendorAddress"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <TextArea rows={3} placeholder="Enter complete address" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Additional Notes (Optional)"
          >
            <TextArea rows={2} placeholder="Any additional notes or requirements" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  const renderPaymentStep = () => {
    const selectedService = exhibition?.config?.serviceTypes?.find(s => s.type === formData.serviceType);
    
    return (
      <Card title="Payment Details" className="step-card">
        <div className="payment-summary">
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="Service Details">
                <p><strong>Service Type:</strong> {formData.serviceType}</p>
                <p><strong>Amount:</strong> ₹{selectedService?.amount.toLocaleString('en-IN')}</p>
                {selectedService?.description && (
                  <p><strong>Description:</strong> {selectedService.description}</p>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="Vendor Details">
                <p><strong>Name:</strong> {formData.vendorName}</p>
                <p><strong>Vendor Company:</strong> {formData.companyName}</p>
                {formData.exhibitorCompanyName && <p><strong>Exhibitor Company:</strong> {formData.exhibitorCompanyName}</p>}
                <p><strong>Stall Number:</strong> {formData.stallNumber}</p>
                {formData.vendorEmail && <p><strong>Email:</strong> {formData.vendorEmail}</p>}
                <p><strong>Phone:</strong> {formData.vendorPhone}</p>
              </Card>
            </Col>
          </Row>
          
          <Divider />
          
          <div className="payment-total">
            <Title level={3}>
              Total Amount: ₹{selectedService?.amount.toLocaleString('en-IN')}
            </Title>
          </div>
          
          {(() => {
            const isDevelopmentMode = exhibition?.config?.paymentGateway === 'phonepe' 
              ? exhibition?.config?.phonePeConfig?.clientId === 'phonepe_test_development_mode'
              : exhibition?.config?.razorpayKeyId === 'rzp_test_development_mode';
            
            const paymentGateway = exhibition?.config?.paymentGateway || 'phonepe';
            
            if (isDevelopmentMode) {
              return (
                <Alert
                  message="Development Mode"
                  description={`This is running in development mode. ${paymentGateway === 'phonepe' ? 'PhonePe' : 'Razorpay'} payment will be simulated - no actual payment will be processed.`}
                  type="warning"
                  icon={<InfoCircleOutlined />}
                  style={{ marginBottom: 16 }}
                  showIcon
                />
              );
            } else {
              return (
                <Alert
                  message="Secure Payment"
                  description={`Your payment is processed securely through ${paymentGateway === 'phonepe' ? 'PhonePe' : 'Razorpay'}. You will receive a receipt via email after successful payment.`}
                  type="info"
                  icon={<BankOutlined />}
                  style={{ marginBottom: 16 }}
                />
              );
            }
          })()}
        </div>
      </Card>
    );
  };

  const renderSuccessStep = () => (
    <Card className="step-card success-card">
      <div style={{ textAlign: 'center' }}>
        <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
        <Title level={2}>Payment Successful!</Title>
        
        {paymentResult && (
          <div className="success-details">
            <Tag color="green" style={{ marginBottom: 16 }}>
              Receipt Number: {paymentResult.receiptNumber}
            </Tag>
            
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>Amount Paid:</strong> ₹{paymentResult.amount.toLocaleString('en-IN')}</p>
                  <p><strong>Payment ID:</strong> {paymentResult.paymentId}</p>
                </Col>
                <Col span={12}>
                  <p><strong>Date:</strong> {new Date(paymentResult.paidAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> <Tag color="green">Paid</Tag></p>
                </Col>
              </Row>
            </Card>
            
            <Alert
              message="Receipt Sent"
              description="A detailed receipt has been sent to your email address. You can also download it using the link below."
              type="success"
              style={{ marginBottom: 16 }}
            />
            
            {paymentResult.receiptDownloadUrl && (
              <Button 
                type="primary" 
                icon={<BankOutlined />}
                href={paymentResult.receiptDownloadUrl}
                target="_blank"
                style={{ marginRight: 8 }}
              >
                Download Receipt
              </Button>
            )}
            
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" tip="Loading exhibition details..." />
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  if (!exhibition && !isPaymentSuccessPage) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <Alert
              message="Exhibition Not Found"
              description="The requested exhibition could not be found or service charges are not enabled."
              type="error"
              showIcon
            />
            <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
              Back to Home
            </Button>
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  const steps = [
    {
      title: 'Vendor Details',
      icon: <UserOutlined />,
      content: renderVendorDetailsStep(),
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
      content: renderPaymentStep(),
    },
    {
      title: 'Confirmation',
      icon: <CheckCircleOutlined />,
      content: renderSuccessStep(),
    },
  ];

  return (
    <Layout>
      <GlobalHeader />
      <Content style={{ paddingTop: '64px', background: '#f5f5f5' }}>
        <div className="public-service-charge-form">
          <div className="form-container">
            <Card className="header-card">
              <div style={{ textAlign: 'center' }}>
                            <Title level={2}>{exhibition?.config?.title || 'Service Charge Payment'}</Title>
            <Paragraph>{exhibition?.config?.description || 'Complete your service charge payment'}</Paragraph>
                {exhibition && (
                  <Space>
                    <InfoCircleOutlined />
                    <Text strong>{exhibition.name}</Text>
                    <Divider type="vertical" />
                    <Text>{exhibition.venue}</Text>
                  </Space>
                )}
              </div>
            </Card>

            <Card className="steps-card">
              <Steps current={currentStep} items={steps} />
            </Card>

            <Form
              form={form}
              layout="vertical"
              initialValues={formData}
              onValuesChange={(_, allValues) => setFormData({ ...formData, ...allValues })}
            >
              {steps[currentStep].content}
            </Form>

            <Card className="actions-card">
              <div style={{ textAlign: 'center' }}>
                {currentStep > 0 && currentStep < 2 && (
                  <Button onClick={handlePrevious} style={{ marginRight: 8 }}>
                    Previous
                  </Button>
                )}
                
                {currentStep === 0 && (
                  <Button type="primary" onClick={handleNext}>
                    Next
                  </Button>
                )}
                
                            {currentStep === 1 && (
              <Button 
                type="primary" 
                onClick={handlePayment}
                loading={submitting}
                icon={<CreditCardOutlined />}
              >
                {(() => {
                              const isDevelopmentMode = exhibition?.config?.paymentGateway === 'phonepe'
              ? exhibition?.config?.phonePeConfig?.clientId === 'phonepe_test_development_mode'
              : exhibition?.config?.razorpayKeyId === 'rzp_test_development_mode';
            
            const paymentGateway = exhibition?.config?.paymentGateway || 'phonepe';
                  const amount = getSelectedServiceAmount().toLocaleString('en-IN');
                  
                  return isDevelopmentMode 
                    ? `Simulate ${paymentGateway === 'phonepe' ? 'PhonePe' : 'Razorpay'} Payment Rs. ${amount}`
                    : `Pay via ${paymentGateway === 'phonepe' ? 'PhonePe' : 'Razorpay'} Rs. ${amount}`;
                })()}
              </Button>
            )}
              </div>
            </Card>
          </div>
        </div>
      </Content>
      <GlobalFooter />
    </Layout>
  );
};

export default PublicServiceChargeForm; 