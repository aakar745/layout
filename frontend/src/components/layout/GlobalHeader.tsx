import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  Menu, 
  Dropdown, 
  Avatar, 
  Space, 
  message, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Divider, 
  Alert, 
  Drawer,
  Steps,
  Row,
  Col,
  Typography,
  InputNumber
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { 
  UserOutlined, 
  LoginOutlined, 
  ShopOutlined, 
  LogoutOutlined, 
  DashboardOutlined, 
  UserAddOutlined, 
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  LockOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { exhibitorLogout, setExhibitorCredentials, hideLoginModal, showLoginModal } from '../../store/slices/exhibitorAuthSlice';
import exhibitorService, { ExhibitorLoginData, ExhibitorRegistrationData, OTPVerificationData } from '../../services/exhibitor';
import api from '../../services/api';

const { Header } = Layout;
const { Step } = Steps;
const { Title, Text } = Typography;

const StyledHeader = styled(Header)`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    position: static;
    transform: none;
    justify-content: flex-start;
  }
`;

const LogoBackground = styled.div`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const LogoImage = styled.img`
  height: auto;
  width: 100%;
  max-width: 140px;
  max-height: auto;
  object-fit: contain;
  
  @media (max-width: 768px) {
    max-width: 120px;
  }
`;

const BrandText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1890ff;
`;

const ProfileAvatar = styled(Avatar)`
  background-color: #1890ff;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    background-color: #40a9ff;
    border-color: #e6f7ff;
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(24, 144, 255, 0.3);
  }
`;

const StyledMenu = styled(Menu)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  
  .ant-dropdown-menu-item {
    padding: 10px 16px;
    transition: all 0.2s;
    
    &:hover {
      background-color: #fafafa;
    }
  }
`;

const DesktopMenu = styled(Menu)`
  border: none;
  display: flex;
  justify-content: center;
  font-size: 15px;
  
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const MobileMenuIcon = styled(Button)`
  display: none;
  font-size: 18px;
  background: transparent;
  border: none;
  padding: 8px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }
  
  &:hover {
    transform: rotate(90deg);
    color: #4158D0;
  }
  
  &:active {
    transform: scale(0.9) rotate(90deg);
  }
`;

const MobileMenuWrapper = styled.div`
  .ant-drawer-header {
    padding: 16px 24px;
  }
  
  .ant-drawer-title {
    font-size: 16px;
    font-weight: 600;
  }
  
  .ant-drawer-body {
    padding: 24px 16px;
  }
  
  .ant-drawer-content-wrapper {
    max-width: 80%;
  }
`;

const MobileMenuItem = styled(Link)`
  display: block;
  padding: 16px 8px;
  margin-bottom: 8px;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    color: #1890ff;
  }
`;

const MobileMenuButton = styled(Button)`
  width: 100%;
  margin-bottom: 12px;
  height: auto;
  padding: 12px 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 10px;
    font-size: 18px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CompanyName = styled.span`
  margin-right: 8px;
  display: none;
  
  @media (min-width: 768px) {
    display: inline;
  }
`;

const GlobalHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const exhibitorAuth = useSelector((state: RootState) => state.exhibitorAuth);
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');
  const [siteName, setSiteName] = useState<string>('Exhibition Manager');
  
  // Modal states
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form hooks
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  
  // New states for multi-step registration
  const [registerStep, setRegisterStep] = useState<number>(0);
  const [emailForOTP, setEmailForOTP] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpResendTimer, setOtpResendTimer] = useState<number>(0);
  const [step1Data, setStep1Data] = useState<{companyName: string; contactPerson: string}>({ companyName: '', contactPerson: '' });
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load logo from public endpoint
  useEffect(() => {
    // Check if we have a cached logo URL first
    const cachedLogoUrl = localStorage.getItem('cachedLogoUrl');
    const logoTimestamp = localStorage.getItem('logoTimestamp');
    const now = new Date().getTime();
    
    // Use cached logo if it exists and is less than 1 hour old
    if (cachedLogoUrl && logoTimestamp && (now - parseInt(logoTimestamp)) < 3600000) {
      setLogoUrl(cachedLogoUrl);
    } else {
      // Set the logo URL directly
      const directLogoUrl = `${api.defaults.baseURL}/public/logo`;
      setLogoUrl(directLogoUrl);
      
      // Cache the logo URL
      localStorage.setItem('cachedLogoUrl', directLogoUrl);
      localStorage.setItem('logoTimestamp', now.toString());
      
      // Preload the image
      const img = new Image();
      img.src = directLogoUrl;
    }
    
    // Still fetch site info to get the site name
    fetch(`${api.defaults.baseURL}/public/site-info`)
      .then(response => response.json())
      .then(data => {
        if (data.siteName) {
          setSiteName(data.siteName);
        }
      })
      .catch(error => {
        console.error('Error fetching site info:', error);
      });
  }, []);
  
  // Sync local modal state with Redux
  useEffect(() => {
    setLoginModalVisible(exhibitorAuth.showLoginModal);
  }, [exhibitorAuth.showLoginModal]);

  /**
   * Configure global message positioning
   * Sets up the message component to display notifications in the correct position
   */
  useEffect(() => {
    // Configure the global message component to appear below the header
    message.config({
      top: 84, // Increased from 70 to ensure it's below the header shadow
      duration: 3,
      maxCount: 1 // Only show one message at a time
    });
    
    // Cleanup on component unmount
    return () => {
      message.destroy(); // Remove any active messages when component unmounts
    };
  }, []);

  const handleExhibitorLogout = () => {
    dispatch(exhibitorLogout());
    message.success('Successfully logged out');
    navigate('/');
    setDropdownVisible(false);
    setMobileMenuVisible(false);
  };
  
  const handleLoginSubmit = async (values: ExhibitorLoginData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await exhibitorService.login(values);
      const { exhibitor, token } = response.data;
      
      if (!exhibitor || !token) {
        throw new Error('Invalid response from server');
      }

      // Update Redux store with exhibitor credentials
      dispatch(setExhibitorCredentials({ exhibitor, token }));
      
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

  // Function to handle sending OTP
  const handleSendOTP = async () => {
    try {
      // Validate email field
      const values = await registerForm.validateFields(['email', 'companyName', 'contactPerson']);
      
      setLoading(true);
      setError(null);
      setEmailForOTP(values.email);
      
      // Save Step 1 data to state for use in final registration
      setStep1Data({
        companyName: values.companyName,
        contactPerson: values.contactPerson
      });
      
      // Call API to send OTP
      await exhibitorService.sendRegistrationOTP(values.email);
      
      setOtpSent(true);
      message.success('OTP sent to your email address');
      
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
      
      // Call API to resend OTP
      await exhibitorService.sendRegistrationOTP(emailForOTP);
      
      message.success('New OTP sent to your email address');
      
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
        email: emailForOTP,
        otp: values.otp
      };
      
      await exhibitorService.verifyOTP(verificationData);
      
      setOtpVerified(true);
      message.success('Email verified successfully');
      
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
    setOtpResendTimer(0);
    setRegisterStep(0);
    setStep1Data({ companyName: '', contactPerson: '' });
    
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
      
      // Make sure email is verified
      if (!otpVerified) {
        setError('Email verification required');
        return;
      }
      
      // Remove confirmPassword before sending to API and use the verified email
      const { confirmPassword, ...registrationData } = values as any;
      
      // Use the stored step 1 data from state
      const completeRegistrationData = {
        ...registrationData,
        email: emailForOTP,
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
      
      // Automatically show login modal after successful registration using Redux action
      setTimeout(() => {
        dispatch(showLoginModal(undefined));
      }, 300);
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
  useEffect(() => {
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
  
  const handleShowLoginModal = () => {
    dispatch(showLoginModal(undefined));
    setDropdownVisible(false);
    setMobileMenuVisible(false);
  };

  const showRegisterModal = () => {
    setRegisterModalVisible(true);
    setDropdownVisible(false);
    setMobileMenuVisible(false);
  };

  const switchToRegister = () => {
    setLoginModalVisible(false);
    setRegisterModalVisible(true);
    loginForm.resetFields();
  };

  const switchToLogin = () => {
    setRegisterModalVisible(false);
    setLoginModalVisible(true);
    registerForm.resetFields();
  };
  
  const menuItems = [
    { key: 'exhibitions', label: 'Exhibitions', path: '/exhibitions' },
    { key: 'about', label: 'About', path: '/about' },
    { key: 'contact', label: 'Contact', path: '/contact' },
  ];
  
  // Guest menu when not logged in
  const guestMenu = (
    <StyledMenu
      items={[
        {
          key: 'exhibitor-login',
          icon: <LoginOutlined />,
          label: <a onClick={handleShowLoginModal}>Exhibitor Login</a>,
        },
        {
          key: 'exhibitor-register',
          icon: <UserAddOutlined />,
          label: <a onClick={showRegisterModal}>Register as Exhibitor</a>,
        }
      ]}
    />
  );

  // Exhibitor menu when logged in
  const exhibitorMenu = (
    <StyledMenu
      items={[
        {
          key: 'exhibitor-dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/exhibitor/dashboard">Dashboard</Link>,
        },
        {
          key: 'exhibitor-profile',
          icon: <UserOutlined />,
          label: <Link to="/exhibitor/profile">My Profile</Link>,
        },
        {
          key: 'exhibitor-bookings',
          icon: <ShopOutlined />,
          label: <Link to="/exhibitor/bookings">My Bookings</Link>,
        },
        {
          key: 'divider',
          type: 'divider',
        },
        {
          key: 'exhibitor-logout',
          icon: <LogoutOutlined />,
          label: <a onClick={handleExhibitorLogout}>Logout</a>,
        },
      ]}
    />
  );

  return (
    <>
      <StyledHeader>
        <HeaderContainer>
          {/* Logo */}
          <LogoContainer>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <LogoBackground>
                <LogoImage 
                  src={logoUrl} 
                  alt="Logo" 
                  onError={() => setLogoUrl('/logo.png')}
                />
              </LogoBackground>
            </Link>
          </LogoContainer>
          
          {/* Desktop navigation */}
          <DesktopMenu
            mode="horizontal"
            selectedKeys={[]}
            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
            items={menuItems.map(item => ({
              key: item.key,
              label: <Link to={item.path}>{item.label}</Link>,
            }))}
          />
          
          {/* User profile/login for desktop */}
          <HeaderRight>
            <Dropdown 
              overlay={exhibitorAuth.isAuthenticated ? exhibitorMenu : guestMenu} 
              trigger={['click']} 
              placement="bottomRight"
              open={dropdownVisible}
              onOpenChange={setDropdownVisible}
              overlayStyle={{ 
                minWidth: '150px',
                marginTop: '10px'
              }}
            >
              {exhibitorAuth.isAuthenticated ? (
                <Space style={{ cursor: 'pointer' }}>
                  <CompanyName>
                    {exhibitorAuth.exhibitor?.companyName || 'Exhibitor'}
                  </CompanyName>
                  <ProfileAvatar 
                    icon={<UserOutlined />} 
                    size="large"
                  />
                </Space>
              ) : (
                <ProfileAvatar 
                  icon={<UserOutlined />} 
                  size="large"
                />
              )}
            </Dropdown>
          </HeaderRight>
          
          {/* Mobile menu toggle */}
          <MobileMenuIcon
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
          />
        </HeaderContainer>
      </StyledHeader>

      {/* Mobile Navigation Drawer */}
      <MobileMenuWrapper>
        <Drawer
          title="Exhibition Management System"
          placement="right"
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          width={280}
          closeIcon={<span style={{ fontSize: '16px' }}>×</span>}
        >
          <div style={{ marginBottom: 24 }}>
            {menuItems.map(item => (
              <MobileMenuItem 
                key={item.key} 
                to={item.path}
                onClick={() => setMobileMenuVisible(false)}
              >
                {item.label}
              </MobileMenuItem>
            ))}
          </div>
          
          <div style={{ marginTop: 40 }}>
            {exhibitorAuth.isAuthenticated ? (
              <>
                <MobileMenuButton
                  type="primary"
                  icon={<DashboardOutlined />}
                  onClick={() => {
                    navigate('/exhibitor/dashboard');
                    setMobileMenuVisible(false);
                  }}
                >
                  Dashboard
                </MobileMenuButton>
                <MobileMenuButton
                  type="default"
                  icon={<LogoutOutlined />}
                  onClick={handleExhibitorLogout}
                >
                  Logout
                </MobileMenuButton>
              </>
            ) : (
              <>
                <MobileMenuButton
                  type="primary"
                  style={{ background: '#7E57C2', borderColor: '#7E57C2' }}
                  icon={<LoginOutlined />}
                  onClick={() => {
                    handleShowLoginModal();
                    setMobileMenuVisible(false);
                  }}
                >
                  Exhibitor Login
                </MobileMenuButton>
                <MobileMenuButton
                  type="default"
                  icon={<UserAddOutlined />}
                  onClick={() => {
                    showRegisterModal();
                    setMobileMenuVisible(false);
                  }}
                >
                  Register as Exhibitor
                </MobileMenuButton>
              </>
            )}
          </div>
        </Drawer>
      </MobileMenuWrapper>

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
          <Step title="Verify Email" />
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
              message="Email Verification Required"
              description="We'll send a one-time password (OTP) to verify your email before completing registration."
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
              
              <Form.Item>
                <Button 
                  type="primary" 
                  onClick={handleSendOTP} 
                  block 
                  size="large"
                  loading={loading}
                >
                  Continue & Verify Email
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
              message="Email Verification"
              description={`We've sent a verification code to ${emailForOTP}. Please enter it below to continue.`}
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

export default GlobalHeader; 