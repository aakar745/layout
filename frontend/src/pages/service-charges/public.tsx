import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    if (exhibitionId) {
      fetchExhibitionConfig();
      loadRazorpayScript();
    }
  }, [exhibitionId]);

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
        const isDevelopmentMode = exhibition?.config.phonePeConfig.clientId === 'phonepe_test_development_mode';
        
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
        const isDevelopmentMode = exhibition?.config.razorpayKeyId === 'rzp_test_development_mode';
        
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
            key: exhibition?.config.razorpayKeyId,
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
    const serviceType = exhibition?.config.serviceTypes.find(s => s.type === formData.serviceType);
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
              {exhibition?.config.serviceTypes.map(service => (
                <Option key={service.type} value={service.type}>
                  {service.type} - ₹{service.amount.toLocaleString('en-IN')}
                </Option>
              ))}
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
    const selectedService = exhibition?.config.serviceTypes.find(s => s.type === formData.serviceType);
    
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
            const isDevelopmentMode = exhibition?.config.paymentGateway === 'phonepe' 
              ? exhibition?.config.phonePeConfig.clientId === 'phonepe_test_development_mode'
              : exhibition?.config.razorpayKeyId === 'rzp_test_development_mode';
            
            const paymentGateway = exhibition?.config.paymentGateway || 'phonepe';
            
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

  if (!exhibition) {
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
                  const isDevelopmentMode = exhibition?.config.paymentGateway === 'phonepe' 
                    ? exhibition?.config.phonePeConfig.clientId === 'phonepe_test_development_mode'
                    : exhibition?.config.razorpayKeyId === 'rzp_test_development_mode';
                  
                  const paymentGateway = exhibition?.config.paymentGateway || 'phonepe';
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