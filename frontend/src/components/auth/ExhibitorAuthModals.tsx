import React, { useState, useRef } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Divider, 
  Alert, 
  Steps,
  Row,
  Col,
  Typography,
  Radio,
  Space
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  LockOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { hideLoginModal, showLoginModal } from '../../store/slices/exhibitorAuthSlice';
import exhibitorService, { ExhibitorLoginData, ExhibitorRegistrationData, OTPVerificationData, WhatsAppOTPRequestData } from '../../services/exhibitor';
import { message } from 'antd';

const { Step } = Steps;
const { Text } = Typography;

interface ExhibitorAuthModalsProps {
  loginModalVisible: boolean;
  registerModalVisible: boolean;
  setRegisterModalVisible: (visible: boolean) => void;
  setExhibitorCredentials: (data: { exhibitor: any; token: string }) => void;
  onForgotPassword: () => void;
}

const ExhibitorAuthModals: React.FC<ExhibitorAuthModalsProps> = ({
  loginModalVisible,
  registerModalVisible,
  setRegisterModalVisible,
  setExhibitorCredentials,
  onForgotPassword
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const exhibitorAuth = useSelector((state: RootState) => state.exhibitorAuth);
  
  // State for form handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form hooks
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  
  // Registration states
  const [registerStep, setRegisterStep] = useState<number>(0);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'whatsapp'>('email');
  const [emailForOTP, setEmailForOTP] = useState<string>('');
  const [phoneForOTP, setPhoneForOTP] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpResendTimer, setOtpResendTimer] = useState<number>(0);
  const [step1Data, setStep1Data] = useState<{companyName: string; contactPerson: string; email: string; phone: string}>({ 
    companyName: '', 
    contactPerson: '', 
    email: '', 
    phone: '' 
  });
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);

  // State for login method selection
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  // Login form submission
  const handleLoginSubmit = async (values: any) => {
    try {
      setError(null);
      setLoading(true);
      
      // Prepare login data based on selected method
      const loginData: any = {
        password: values.password
      };
      
      if (loginMethod === 'email') {
        loginData.email = values.loginIdentifier;
      } else {
        loginData.phone = values.loginIdentifier;
      }
      
      const response = await exhibitorService.login(loginData);
      const { exhibitor, token } = response.data;
      
      if (!exhibitor || !token) {
        throw new Error('Invalid response from server');
      }

      // Update Redux store with exhibitor credentials
      setExhibitorCredentials({ exhibitor, token });
      
      // Close the modal using Redux action
      dispatch(hideLoginModal());
      
      // Reset form and show success message
      loginForm.resetFields();
      message.success('Login successful!');
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 403) {
        const status = error.response?.data?.status;
        if (status === 'pending') {
          setError('Your account is pending approval. You will be able to log in after admin approval.');
        } else if (status === 'rejected') {
          const rejectionReason = error.response?.data?.rejectionReason;
          setError(rejectionReason 
            ? `Your registration has been rejected. Reason: ${rejectionReason}` 
            : 'Your registration has been rejected. Please contact the administrator for more details.');
        } else {
          setError(error.response?.data?.message || 'Access denied. Please contact administrator.');
        }
      } else {
        setError(error.response?.data?.message || 'Login failed. Please try again.');
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Function to handle sending OTP (both email and WhatsApp)
  const handleSendOTP = async () => {
    try {
      // Validate required fields
      const values = await registerForm.validateFields(['email', 'phone', 'companyName', 'contactPerson']);
      
      setLoading(true);
      setError(null);
      
      // Save Step 1 data to state for use in final registration
      setStep1Data({
        companyName: values.companyName,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone
      });
      
      // Send OTP based on selected method
      if (verificationMethod === 'email') {
        setEmailForOTP(values.email);
        await exhibitorService.sendRegistrationOTP(values.email);
        message.success('OTP sent to your email address');
      } else {
        // WhatsApp OTP
        setPhoneForOTP(values.phone);
        const whatsappData: WhatsAppOTPRequestData = {
          phone: values.phone,
          companyName: values.companyName
        };
        await exhibitorService.sendWhatsAppOTP(whatsappData);
        message.success('OTP sent to your WhatsApp number');
      }
      
      setOtpSent(true);
      
      // Start resend timer (60 seconds)
      setOtpResendTimer(60);
      startOtpResendTimer();
      
      // Move to OTP verification step
      setRegisterStep(1);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        // This is a form validation error, don't show error message
        return;
      }
      
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to start OTP resend timer
  const startOtpResendTimer = () => {
    if (otpTimerRef.current) {
      clearInterval(otpTimerRef.current);
    }
    
    otpTimerRef.current = setInterval(() => {
      setOtpResendTimer(prev => {
        if (prev <= 1) {
          if (otpTimerRef.current) {
            clearInterval(otpTimerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Function to handle resending OTP
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Resend OTP based on selected method
      if (verificationMethod === 'email') {
        await exhibitorService.sendRegistrationOTP(emailForOTP);
        message.success('New OTP sent to your email address');
      } else {
        // WhatsApp OTP
        const whatsappData: WhatsAppOTPRequestData = {
          phone: phoneForOTP,
          companyName: step1Data.companyName
        };
        await exhibitorService.sendWhatsAppOTP(whatsappData);
        message.success('New OTP sent to your WhatsApp number');
      }
      
      // Reset and start timer
      setOtpResendTimer(60);
      startOtpResendTimer();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to verify OTP
  const handleVerifyOTP = async (values: { otp: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API to verify OTP
      const verificationData: OTPVerificationData = {
        otp: values.otp,
        verificationType: verificationMethod
      };
      
      // Add appropriate identifier based on verification method
      if (verificationMethod === 'email') {
        verificationData.email = emailForOTP;
      } else {
        verificationData.phone = phoneForOTP;
      }
      
      await exhibitorService.verifyOTP(verificationData);
      
      setOtpVerified(true);
      message.success(`${verificationMethod === 'email' ? 'Email' : 'Phone number'} verified successfully`);
      
      // Clear OTP timer
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
      }
      
      // Move to final registration step
      setRegisterStep(2);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset OTP related state
  const resetOtpState = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setEmailForOTP('');
    setPhoneForOTP('');
    setVerificationMethod('email');
    setOtpResendTimer(0);
    setRegisterStep(0);
    setStep1Data({ companyName: '', contactPerson: '', email: '', phone: '' });
    
    if (otpTimerRef.current) {
      clearInterval(otpTimerRef.current);
    }
    
    otpForm.resetFields();
  };
  
  // Modified function to handle registeration submit with verified email
  const handleRegisterSubmit = async (values: ExhibitorRegistrationData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Make sure verification is completed
      if (!otpVerified) {
        setError(`${verificationMethod === 'email' ? 'Email' : 'Phone number'} verification required`);
        return;
      }
      
      // Remove confirmPassword before sending to API and use the verified data
      const { confirmPassword, ...registrationData } = values as any;
      
      // Use the stored step 1 data from state
      const completeRegistrationData = {
        ...registrationData,
        email: step1Data.email,
        phone: step1Data.phone,
        companyName: step1Data.companyName,
        contactPerson: step1Data.contactPerson
      };
      
      console.log('Sending registration data:', completeRegistrationData);
      
      // Make the API call with complete registration data
      const response = await exhibitorService.register(completeRegistrationData);
      
      // Don't log in automatically - just show a success message
      message.success('Registration successful! You can log in and book a stall only after admin approval.');
      setRegisterModalVisible(false);
      registerForm.resetFields();
      
      // Reset OTP state
      resetOtpState();
      
      // Use dispatch directly instead of the local state setter
      setTimeout(() => {
        dispatch(showLoginModal(undefined));
      }, 500);
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Response data:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
      }
    };
  }, []);
  
  // Modified function to handle registration modal close
  const handleRegisterModalClose = () => {
    setRegisterModalVisible(false);
    setError(null);
    registerForm.resetFields();
    resetOtpState();
  };
  
  const switchToRegister = () => {
    dispatch(hideLoginModal());
    setRegisterModalVisible(true);
    loginForm.resetFields();
  };

  const switchToLogin = () => {
    setRegisterModalVisible(false);
    dispatch(showLoginModal(undefined));
    registerForm.resetFields();
  };

  return (
    <>
      {/* Login Modal */}
      <Modal
        title="Exhibitor Login"
        open={loginModalVisible}
        onCancel={() => {
          dispatch(hideLoginModal());
          setError(null);
          loginForm.resetFields();
        }}
        footer={null}
        width={400}
      >
        {exhibitorAuth.loginContext === "stall-booking" && (
          <Alert
            message="Login Required for Stall Booking"
            description="Please log in to your exhibitor account to select and book stalls for this exhibition."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Form
          form={loginForm}
          name="exhibitor_login_modal"
          onFinish={handleLoginSubmit}
          layout="vertical"
        >
          <Form.Item label="Login Method">
            <Radio.Group 
              value={loginMethod} 
              onChange={(e) => setLoginMethod(e.target.value)}
              disabled={loading}
            >
              <Radio value="email">
                <Space>
                  <MailOutlined />
                  Email
                </Space>
              </Radio>
              <Radio value="phone">
                <Space>
                  <PhoneOutlined />
                  Phone
                </Space>
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="loginIdentifier"
            rules={[
              { required: true, message: `Please input your ${loginMethod}!` },
              ...(loginMethod === 'email' ? [{ type: 'email' as const, message: 'Please enter a valid email address!' }] : [])
            ]}
          >
            <Input 
              prefix={loginMethod === 'email' ? <MailOutlined /> : <PhoneOutlined />} 
              placeholder={loginMethod === 'email' ? 'Email' : 'Phone Number'} 
              size="large"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: 'right', marginBottom: 10 }}>
              <Button 
                type="link" 
                onClick={() => {
                  dispatch(hideLoginModal());
                  onForgotPassword();
                }}
                style={{ padding: 0 }}
              >
                Forgot password?
              </Button>
            </div>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        
        <Divider>
          <span style={{ fontSize: '14px', color: '#888' }}>Don't have an account?</span>
        </Divider>
        
        <Button 
          type="default" 
          block 
          onClick={switchToRegister}
        >
          Register as Exhibitor
        </Button>
      </Modal>

      {/* Registration Modal */}
      <Modal
        title="Exhibitor Registration"
        open={registerModalVisible}
        onCancel={handleRegisterModalClose}
        footer={null}
        width={500}
      >
        <Steps current={registerStep} style={{ marginBottom: 24 }}>
          <Step title="Basic Info" />
          <Step title={`Verify ${verificationMethod === 'email' ? 'Email' : 'WhatsApp'}`} />
          <Step title="Complete" />
        </Steps>
        
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        {registerStep === 0 && (
          <>
            <Alert
              message="Verification Required"
              description="We'll send a one-time password (OTP) to verify your contact information before completing registration."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form
              form={registerForm}
              name="exhibitor_register_step1"
              layout="vertical"
            >
              <Form.Item
                name="companyName"
                rules={[{ required: true, message: 'Please input your company name!' }]}
              >
                <Input 
                  prefix={<HomeOutlined />} 
                  placeholder="Company Name" 
                  size="large"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="contactPerson"
                rules={[{ required: true, message: 'Please input contact person name!' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Contact Person" 
                  size="large"
                  disabled={loading}
                />
              </Form.Item>
              
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Email" 
                  size="large"
                  disabled={loading}
                />
              </Form.Item>
              
              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="Phone Number" 
                  size="large"
                  disabled={loading}
                />
              </Form.Item>
              
              <Form.Item label="Verification Method">
                <Radio.Group 
                  value={verificationMethod} 
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  disabled={loading}
                >
                  <Space direction="vertical">
                    <Radio value="email">
                      <Space>
                        <MailOutlined />
                        Verify via Email
                      </Space>
                    </Radio>
                    <Radio value="whatsapp">
                      <Space>
                        <MessageOutlined />
                        Verify via WhatsApp
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  onClick={handleSendOTP} 
                  block 
                  size="large"
                  loading={loading}
                >
                  Continue & Send OTP
                </Button>
              </Form.Item>
            </Form>
            
            <Divider>
              <span style={{ fontSize: '14px', color: '#888' }}>Already have an account?</span>
            </Divider>
            
            <Button 
              type="default" 
              block 
              onClick={switchToLogin}
            >
              Login
            </Button>
          </>
        )}
        
        {registerStep === 1 && (
          <>
            <Alert
              message={`${verificationMethod === 'email' ? 'Email' : 'WhatsApp'} Verification`}
              description={verificationMethod === 'email' 
                ? `We've sent a verification code to ${emailForOTP}. Please enter it below to continue.`
                : `We've sent a verification code to your WhatsApp number ${phoneForOTP}. Please enter it below to continue.`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form
              form={otpForm}
              name="verify_otp"
              onFinish={handleVerifyOTP}
              layout="vertical"
            >
              <Form.Item
                name="otp"
                rules={[{ required: true, message: 'Please enter the verification code!' }]}
              >
                <Input
                  size="large"
                  placeholder="Enter OTP"
                  maxLength={6}
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px' }}
                  disabled={loading}
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  Verify & Continue
                </Button>
              </Form.Item>
            </Form>
            
            <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
              <Col>
                <Button 
                  type="link" 
                  disabled={otpResendTimer > 0 || loading}
                  onClick={handleResendOTP}
                >
                  Resend Code
                </Button>
              </Col>
              <Col>
                {otpResendTimer > 0 && (
                  <Text type="secondary">Resend in {otpResendTimer}s</Text>
                )}
              </Col>
            </Row>
            
            <Divider />
            
            <Button 
              type="default" 
              block 
              onClick={() => setRegisterStep(0)}
            >
              Back
            </Button>
          </>
        )}
        
        {registerStep === 2 && (
          <>
            <Alert
              message="Email Verified Successfully"
              description="Please complete your registration by providing the remaining details."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form
              form={registerForm}
              name="exhibitor_register_step2"
              onFinish={handleRegisterSubmit}
              layout="vertical"
            >
              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="Phone Number" 
                  size="large"
                  disabled={loading}
                />
              </Form.Item>
              
              <Form.Item
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <Input.TextArea 
                  placeholder="Address" 
                  rows={3}
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                  disabled={loading}
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                  size="large"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  Complete Registration
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
};

export default ExhibitorAuthModals; 