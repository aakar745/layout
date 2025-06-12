import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message, Alert, Typography, Checkbox, Progress, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, CheckCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store/store';
import api from '../../services/api';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import authService from '../../services/auth';

const { Title, Text, Paragraph } = Typography;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Light beam effect for hover state
const lightBeam = keyframes`
  0% { transform: rotate(0deg) translateY(0) scaleY(1); opacity: 0; }
  20% { opacity: 0.5; }
  100% { transform: rotate(25deg) translateY(-260px) scaleY(1.2); opacity: 0; }
`;

const lightBeamReverse = keyframes`
  0% { transform: rotate(-25deg) translateY(260px) scaleY(1.2); opacity: 0; }
  20% { opacity: 0.5; }
  100% { transform: rotate(0deg) translateY(0) scaleY(1); opacity: 0; }
`;

// Floor plan drawing animation
const drawPath = keyframes`
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
`;

// Styled components for modern two-section layout
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  background-image: linear-gradient(135deg, rgba(35, 92, 169, 0.85), rgba(13, 71, 161, 0.9)), url('/exhibition-background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${slideInLeft} 0.8s ease-out forwards;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    min-height: 200px;
  }
`;

// Light beam elements for hover effect
const LightBeam = styled.div<{ index: number; isHovered: boolean }>`
  position: absolute;
  width: 2px;
  height: 600px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, ${props => 0.1 + (props.index % 3) * 0.05}), transparent);
  left: ${props => 20 + (props.index * 10)}%;
  top: 0;
  z-index: 1;
  opacity: 0;
  transform-origin: top;
  animation: ${props => props.isHovered ? lightBeam : lightBeamReverse} ${props => 1.5 + props.index * 0.2}s ease-out;
  animation-delay: ${props => props.index * 0.1}s;
  animation-fill-mode: forwards;
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #ffffff;
  animation: ${slideInRight} 0.8s ease-out forwards;
`;

// Custom loader animation
const LoaderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FloorPlanSVG = styled.svg`
  width: 40px;
  height: 40px;
  
  .path {
    stroke: #1890ff;
    stroke-width: 2;
    fill: none;
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
    animation: ${drawPath} 2s linear infinite;
  }
  
  .dot {
    fill: #1890ff;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const LoadingText = styled.span`
  margin-left: 10px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const TopLeftLogoContainer = styled.div`
  position: absolute;
  top: 25px;
  left: 30px;
  z-index: 10;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

const LogoBackground = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const LogoImage = styled.img`
  width: 140px;
  height: auto;
  animation: ${float} 6s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
`;

const BrandNameText = styled.div({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginLeft: '14px',
  color: '#1a3e72',
  letterSpacing: '0.5px'
});

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

const LogoText = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  color: #ffffff;
  letter-spacing: 1px;
`;

const StyledTitle = styled(Title)`
  color: #ffffff !important;
  font-weight: 400 !important;
  text-align: center;
  margin-top: 0 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const StyledParagraph = styled(Paragraph)`
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  max-width: 500px;
  margin: 1.5rem auto 0;
`;

const LoginForm = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const StyledInput = styled(Input)`
  height: 50px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background-color: #f8f8f8;
  transition: all 0.3s;
  
  &:hover, &:focus {
    background-color: white;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const StyledPasswordInput = styled(Input.Password)`
  height: 50px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background-color: #f8f8f8;
  transition: all 0.3s;
  
  &:hover, &:focus {
    background-color: white;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const StyledButton = styled(Button)`
  height: 50px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.success {
    animation: ${pulse} 0.5s ease-in-out;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;
`;

const PasswordStrengthWrapper = styled.div`
  margin-top: 8px;
`;

const RememberMeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #1890ff;
    border-color: #1890ff;
  }
  
  .ant-checkbox-inner:hover {
    border-color: #1890ff;
  }
  
  .ant-checkbox-wrapper:hover .ant-checkbox-inner {
    border-color: #1890ff;
  }
`;

const SuccessAnimation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(82, 196, 26, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: ${fadeIn} 0.3s ease-out;
  
  svg {
    font-size: 80px;
    color: #52c41a;
    animation: ${pulse} 0.5s ease-in-out;
  }
`;

// Exhibition themed loader component
const ExhibitionLoader = () => (
  <LoaderContainer>
    <FloorPlanSVG viewBox="0 0 50 50">
      {/* Exhibition floor plan shape */}
      <path 
        className="path" 
        d="M10,10 L40,10 L40,40 L10,40 L10,10 Z M10,25 L40,25 M20,10 L20,40 M30,10 L30,40" 
      />
      <circle className="dot" cx="15" cy="15" r="2" />
      <circle className="dot" cx="25" cy="15" r="2" />
      <circle className="dot" cx="35" cy="15" r="2" />
      <circle className="dot" cx="15" cy="35" r="2" />
      <circle className="dot" cx="25" cy="35" r="2" />
      <circle className="dot" cx="35" cy="35" r="2" />
    </FloorPlanSVG>
    <LoadingText>Signing in...</LoadingText>
  </LoaderContainer>
);

// Interactive floating element component
const FloatingElement = styled.div<{ size: number; delay: number; duration: number; top: number; left: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  z-index: 1;
`;

// Function to evaluate password strength
const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  // Basic validation rules
  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  const strengthChecks = [hasLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars];
  const passedChecks = strengthChecks.filter(check => check).length;
  
  // Return percentage
  return (passedChecks / strengthChecks.length) * 100;
};

// Function to get color based on strength
const getStrengthColor = (strength: number): string => {
  if (strength < 30) return '#ff4d4f'; // Red
  if (strength < 60) return '#faad14'; // Yellow
  if (strength < 80) return '#1890ff'; // Blue
  return '#52c41a'; // Green
};

// Function to get strength text
const getStrengthText = (strength: number): string => {
  if (strength < 30) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 80) return 'Good';
  return 'Strong';
};

// Password requirements tips
const passwordRequirements = [
  'At least 8 characters long',
  'Contains uppercase letters',
  'Contains lowercase letters',
  'Contains numbers',
  'Contains special characters'
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationReady, setAnimationReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [form] = Form.useForm();
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');
  const [siteName, setSiteName] = useState<string>("EXHIBITION MANAGER");
  
  // Use the public logo endpoint directly
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
    
    // Fetch site info to get the site name
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
  
  // Check for remembered credentials
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const userData = JSON.parse(rememberedUser);
        form.setFieldsValue({
          username: userData.username,
          password: userData.password,
          remember: true
        });
      } catch (e) {
        // If JSON parsing fails, clear remembered user
        localStorage.removeItem('rememberedUser');
      }
    }
    
    // Check for login message (from API interceptor for inactive accounts)
    const loginMessage = localStorage.getItem('loginMessage');
    if (loginMessage) {
      setError({
        title: 'Account Inactive',
        message: loginMessage
      });
      localStorage.removeItem('loginMessage');
    }
  }, [form]);
  
  // Set animation ready state after a delay to ensure smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle mouse movement for interactive particles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (particlesRef.current) {
        const rect = particlesRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          setMousePosition({ x, y });
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const onFinish = async (values: { username: string; password: string; remember: boolean }) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login({
        username: values.username,
        password: values.password
      });

      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      // Handle "Remember Me" logic
      if (values.remember) {
        // Save user credentials to localStorage
        localStorage.setItem('rememberedUser', JSON.stringify({
          username: values.username,
          password: values.password
        }));
        localStorage.setItem('rememberUser', 'true');
      } else {
        // Clear remembered credentials
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('rememberUser');
      }

      // Show success animation
      setShowSuccess(true);
      
      // Delay redirect for animation
      setTimeout(() => {
        dispatch(setCredentials({ user, token }));
        message.success('Login successful!');
        navigate('/dashboard');
      }, 1200);
    } catch (error: any) {
      // Log the exact error structure for debugging
      console.error('Login Error:', error);
      console.error('Response Data:', error.response?.data);
      
      // Default error message as fallback
      let errorTitle = 'Authentication Error';
      let errorMessage = 'Invalid username or password.';
      
      // Check if we have a valid error response from the backend
      if (error.response && typeof error.response === 'object') {
        const { status, data } = error.response;
        
        // Direct mapping from backend status codes to user-friendly messages
        if (status === 401) {
          errorTitle = 'Invalid Credentials';
          errorMessage = 'The username or password you entered is incorrect.';
        } else if (status === 403) {
          errorTitle = 'Access Denied';
          errorMessage = 'You do not have permission to access this resource.';
        } else if (status === 400) {
          errorTitle = 'Invalid Request';
          errorMessage = 'Please check your input and try again.';
        } else if (status === 500) {
          errorTitle = 'Server Error';
          errorMessage = 'A server error occurred. Please try again later.';
        }
        
        // Override with the backend message if it exists
        if (data && typeof data === 'object' && data.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        // Network error - request made but no response received
        errorTitle = 'Connection Error';
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.message) {
        // Something else happened while setting up the request
        errorMessage = error.message;
      }
      
      // Set error state for Alert component
      setError({
        title: errorTitle,
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Password strength calculation
  const passwordStrength = getPasswordStrength(password);
  const strengthColor = getStrengthColor(passwordStrength);
  const strengthText = getStrengthText(passwordStrength);

  // Check for remembered user - moved to useEffect for better UX
  const rememberUserDefault = localStorage.getItem('rememberUser') === 'true';

  if (isAuthenticated) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        background: '#f0f5ff' 
      }}>
        <ExhibitionLoader />
        <Text style={{ marginTop: 16 }}>Redirecting to dashboard...</Text>
      </div>
    );
  }

  // Generate floating elements for interactive background
  const generateFloatingElements = (count: number) => {
    const elements = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 20 + 8; // 8-28px (slightly smaller)
      const delay = Math.random() * 3; // 0-3s delay
      const duration = Math.random() * 10 + 6; // 6-16s duration
      const top = Math.random() * 100; // 0-100% top position
      const left = Math.random() * 100; // 0-100% left position
      
      elements.push(
        <FloatingElement 
          key={i} 
          size={size} 
          delay={delay} 
          duration={duration} 
          top={top} 
          left={left} 
          style={{
            transform: `translate(${(mousePosition.x / 50) * (i % 5 - 2)}px, ${(mousePosition.y / 50) * (i % 5 - 2)}px)`,
            opacity: isHovered ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
            backgroundColor: 'rgba(255, 255, 255, 0.07)'
          }}
        />
      );
    }
    return elements;
  };

  // Generate light beam elements for hover effect
  const generateLightBeams = (count: number) => {
    const elements = [];
    for (let i = 0; i < count; i++) {
      elements.push(
        <LightBeam 
          key={i} 
          index={i} 
          isHovered={isHovered}
        />
      );
    }
    return elements;
  };

  const handleImageSectionHover = (hovering: boolean) => {
    setIsHovered(hovering);
  };

  return (
    <LoginContainer style={{ opacity: animationReady ? 1 : 0, transition: 'opacity 0.3s ease-out' }}>
      {showSuccess && (
        <SuccessAnimation>
          <CheckCircleFilled />
        </SuccessAnimation>
      )}
      
      <ImageSection 
        onMouseEnter={() => handleImageSectionHover(true)}
        onMouseLeave={() => handleImageSectionHover(false)}
      >
        <TopLeftLogoContainer>
          <LogoBackground>
            <LogoImage 
              src={logoUrl} 
              alt="Exhibition Manager Logo" 
              onError={() => setLogoUrl('/logo.png')}
            />
          </LogoBackground>
        </TopLeftLogoContainer>
        
        <ParticlesContainer ref={particlesRef}>
          {generateFloatingElements(12)}
          {generateLightBeams(8)}
        </ParticlesContainer>
        
        <ContentWrapper>
          <LogoContainer>
            <LogoText>{siteName}</LogoText>
          </LogoContainer>
          
          <StyledTitle level={4}>
            Your complete solution for managing exhibitions, stalls, and exhibitors
          </StyledTitle>
          
          <StyledParagraph>
            Create floor plans, manage exhibitors, handle bookings, and generate invoices - all in one platform.
          </StyledParagraph>
        </ContentWrapper>
      </ImageSection>
      
      <FormSection>
        <LoginForm>
          <FormHeader>
            <Title level={2} style={{ marginBottom: '0.5rem' }}>Admin Login</Title>
            <Text type="secondary">Enter your credentials to access the admin dashboard</Text>
          </FormHeader>
          
          {error && (
            <Alert
              message={error.title}
              description={error.message}
              type="error"
              showIcon
              style={{ 
                marginBottom: 24, 
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
              action={
                <Button size="small" type="text" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              }
            />
          )}
          
          <Form
            form={form}
            name="login"
            initialValues={{ 
              remember: rememberUserDefault
            }}
            onFinish={onFinish}
            layout="vertical"
          >
            <StyledFormItem
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
              label="Username"
            >
              <StyledInput
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter your username"
                disabled={loading}
                autoComplete="username"
              />
            </StyledFormItem>

            <StyledFormItem
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
              label="Password"
              help={passwordFocused && (
                <PasswordStrengthWrapper>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <Text type="secondary">Password Strength:</Text>
                    <Text strong style={{ color: strengthColor }}>{strengthText}</Text>
                  </div>
                  <Progress 
                    percent={passwordStrength} 
                    showInfo={false} 
                    strokeColor={strengthColor}
                    size="small"
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Tooltip 
                      title={
                        <ul style={{ paddingLeft: '20px', margin: '0' }}>
                          {passwordRequirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      }
                    >
                      <Text type="secondary" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <InfoCircleOutlined style={{ marginRight: '4px' }} />
                        Password requirements
                      </Text>
                    </Tooltip>
                  </div>
                </PasswordStrengthWrapper>
              )}
            >
              <StyledPasswordInput
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </StyledFormItem>
            
            <RememberMeWrapper>
              <StyledFormItem name="remember" valuePropName="checked" noStyle>
                <StyledCheckbox>Remember me</StyledCheckbox>
              </StyledFormItem>
            </RememberMeWrapper>

            <StyledFormItem>
              {loading ? (
                <ExhibitionLoader />
              ) : (
                <StyledButton
                  type="primary"
                  htmlType="submit"
                  block
                  className={showSuccess ? 'success' : ''}
                >
                  Sign in
                </StyledButton>
              )}
            </StyledFormItem>
            
            {/* <div style={{ 
              background: '#f6f6f6', 
              padding: '12px 16px', 
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}>
              <Text type="secondary">Development credentials:</Text>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Text strong>Username:</Text> <Text code>admin</Text>
                </div>
                <div>
                  <Text strong>Password:</Text> <Text code>admin123</Text>
                </div>
              </div>
            </div> */}
          </Form>
        </LoginForm>
      </FormSection>
    </LoginContainer>
  );
};

export default Login; 