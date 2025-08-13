import React from 'react';
import { 
  Steps, 
  Card, 
  Typography, 
  Space, 
  Divider, 
  Layout,
  Result,
  Button,
  Spin
} from 'antd';
import { 
  ShoppingCartOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined,
  LoadingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

// Components
import GlobalHeader from '../../../components/layout/GlobalHeader';
import GlobalFooter from '../../../components/layout/GlobalFooter';
import VendorDetailsStep from '../components/VendorDetailsStep';
import PaymentStep from '../components/PaymentStep';
import SuccessStep from '../components/SuccessStep';

// Hooks
import { useServiceChargeForm } from '../hooks/useServiceChargeForm';
import { usePaymentHandler } from '../hooks/usePaymentHandler';

// Utils
import { isPaymentResultPage } from '../utils/paymentVerification';

// Styles
import '../ServiceCharges.css';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const PublicServiceChargeForm: React.FC = () => {
  // Use our custom hooks
  const {
    // State
    exhibitionId,
    currentStep,
    setCurrentStep,
    loading,
    setLoading,
    submitting,
    setSubmitting,
    exhibition,
    setExhibition,
    stalls,
    selectedStall,
    formData,
    setFormData,
    paymentResult,
    setPaymentResult,
    verificationInProgress,
    setVerificationInProgress,
    paymentVerified,
    setPaymentVerified,
    paymentStatus,
    setPaymentStatus,
    failedServiceChargeId,
    setFailedServiceChargeId,
    fileList,
    setFileList,
    
    // Form
    form,
    message,
    
    // Navigation
    navigate,
    location,
    
    // Functions
    handleStallSelection,
    handleNext,
    handlePrevious,
    handleCancelPayment,
  } = useServiceChargeForm();

  // Use payment handler hook
  const { handlePayment } = usePaymentHandler({
    exhibitionId,
    location,
    currentStep,
    paymentVerified,
    verificationInProgress,
    exhibition,
    stalls,
    selectedStall,
    formData,
    setLoading,
    setCurrentStep,
    setPaymentResult,
    setPaymentVerified,
    setVerificationInProgress,
    setPaymentStatus,
    setFailedServiceChargeId,
    setFormData,
    setExhibition,
    setSubmitting,
    form,
    navigate
  });

  // Define steps
  const steps = [
    {
      title: 'Service Details',
      content: (
        <VendorDetailsStep
          form={form}
          formData={formData}
          exhibition={exhibition}
          stalls={stalls}
          selectedStall={selectedStall}
          fileList={fileList}
          setFileList={setFileList}
          setFormData={setFormData}
          onStallSelection={handleStallSelection}
          onNext={handleNext}
        />
      ),
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Payment',
      content: (
        <PaymentStep
          exhibition={exhibition}
          stalls={stalls}
          selectedStall={selectedStall}
          formData={formData}
          paymentStatus={paymentStatus}
          submitting={submitting}
          onPayment={handlePayment}
          onPrevious={handlePrevious}
          onCancelPayment={handleCancelPayment}
        />
      ),
      icon: <CreditCardOutlined />
    },
    {
      title: 'Success',
      content: (
        <SuccessStep
          paymentResult={paymentResult}
          onNavigateHome={() => navigate('/')}
        />
      ),
      icon: <CheckCircleOutlined />
    }
  ];

  // Check if we're on payment result page
  const isPaymentResult = isPaymentResultPage(location.pathname, location.search);

  if (loading) {
    console.log('[Payment Redirect] Component loading state:', {
      isPaymentResult,
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
  if (isPaymentResult && !exhibition && currentStep !== 2) {
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

            {steps[currentStep].content}
          </div>
        </div>
      </Content>
      <GlobalFooter />
    </Layout>
  );
};

export default PublicServiceChargeForm; 