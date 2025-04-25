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
  Typography
} from 'antd';
import { 
  MailOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { hideForgotPasswordModal, showLoginModal } from '../../store/slices/exhibitorAuthSlice';
import exhibitorService, { PasswordResetRequestData, PasswordResetData } from '../../services/exhibitor';
import { message } from 'antd';

const { Step } = Steps;
const { Text } = Typography;

interface ForgotPasswordModalProps {
  visible: boolean;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // State for form handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Password reset states
  const [passwordResetStep, setPasswordResetStep] = useState(0);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [passwordResetOtpSent, setPasswordResetOtpSent] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  // Form instances
  const forgotPasswordForm = Form.useForm()[0];
  const resetPasswordOtpForm = Form.useForm()[0];
  const newPasswordForm = Form.useForm()[0];
  
  // Ref for OTP timer
  const passwordResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to handle forgot password request
  const handleForgotPasswordSubmit = async (values: PasswordResetRequestData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await exhibitorService.requestPasswordReset(values);
      setPasswordResetEmail(values.email);
      setPasswordResetOtpSent(true);
      setPasswordResetStep(1);
      
      message.success('Password reset code sent to your email');
      
      // Start resend timer (60 seconds)
      setOtpResendTimer(60);
      startPasswordResetTimer();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send password reset code. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to start password reset timer
  const startPasswordResetTimer = () => {
    if (passwordResetTimerRef.current) {
      clearInterval(passwordResetTimerRef.current);
    }
    
    passwordResetTimerRef.current = setInterval(() => {
      setOtpResendTimer(prev => {
        if (prev <= 1) {
          if (passwordResetTimerRef.current) {
            clearInterval(passwordResetTimerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Function to resend password reset OTP
  const handleResendPasswordResetOTP = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await exhibitorService.requestPasswordReset({ email: passwordResetEmail });
      
      message.success('New password reset code sent to your email');
      
      // Reset and start timer
      setOtpResendTimer(60);
      startPasswordResetTimer();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend password reset code. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to verify password reset OTP
  const handleVerifyPasswordResetOTP = async (values: { otp: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      // We don't verify the OTP on the backend until the password reset step
      // This just moves to the next step in the UI
      setPasswordResetStep(2);
      
      // Clear OTP timer
      if (passwordResetTimerRef.current) {
        clearInterval(passwordResetTimerRef.current);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid code. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to reset password with OTP
  const handleResetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const otpValue = resetPasswordOtpForm.getFieldValue('otp');
      
      const resetData: PasswordResetData = {
        email: passwordResetEmail,
        otp: otpValue,
        newPassword: values.newPassword
      };
      
      await exhibitorService.resetPassword(resetData);
      
      message.success('Password reset successful. You can now log in with your new password.');
      resetPasswordFormState();
      dispatch(hideForgotPasswordModal());
      dispatch(showLoginModal());
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to reset password reset form state
  const resetPasswordFormState = () => {
    setPasswordResetStep(0);
    setPasswordResetEmail('');
    setPasswordResetOtpSent(false);
    setOtpResendTimer(0);
    
    if (passwordResetTimerRef.current) {
      clearInterval(passwordResetTimerRef.current);
    }
    
    forgotPasswordForm.resetFields();
    resetPasswordOtpForm.resetFields();
    newPasswordForm.resetFields();
  };
  
  // Function to close forgot password modal
  const handleCloseForgotPasswordModal = () => {
    resetPasswordFormState();
    dispatch(hideForgotPasswordModal());
  };
  
  // Function to switch back to login from forgot password
  const switchBackToLogin = () => {
    resetPasswordFormState();
    dispatch(hideForgotPasswordModal());
    dispatch(showLoginModal());
  };

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (passwordResetTimerRef.current) {
        clearInterval(passwordResetTimerRef.current);
      }
    };
  }, []);

  return (
    <Modal
      title="Forgot Password"
      open={visible}
      onCancel={handleCloseForgotPasswordModal}
      footer={null}
      width={400}
    >
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      
      <Steps
        current={passwordResetStep}
        size="small"
        style={{ marginBottom: 20 }}
        items={[
          { title: 'Email' },
          { title: 'Verify' },
          { title: 'Reset' }
        ]}
      />
      
      {/* Step 1: Enter Email */}
      {passwordResetStep === 0 && (
        <Form
          form={forgotPasswordForm}
          onFinish={handleForgotPasswordSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
            >
              Send Reset Code
            </Button>
          </Form.Item>
          
          <Divider style={{ margin: '12px 0' }}>
            <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Remember your password?</span>
          </Divider>
          
          <Button type="link" onClick={switchBackToLogin} block>
            Back to Login
          </Button>
        </Form>
      )}
      
      {/* Step 2: Verify OTP */}
      {passwordResetStep === 1 && (
        <Form
          form={resetPasswordOtpForm}
          onFinish={handleVerifyPasswordResetOTP}
          layout="vertical"
        >
          <p>
            We've sent a verification code to <strong>{passwordResetEmail}</strong>. 
            Please check your email and enter the code below.
          </p>
          
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Please enter the verification code' },
              { pattern: /^\d{6}$/, message: 'Please enter a valid 6-digit code' }
            ]}
          >
            <Input 
              placeholder="Enter 6-digit code" 
              maxLength={6}
              style={{ letterSpacing: '0.5em', textAlign: 'center', fontWeight: 'bold' }}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
            >
              Verify Code
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            {otpResendTimer > 0 ? (
              <Typography.Text type="secondary">
                Resend code in {otpResendTimer}s
              </Typography.Text>
            ) : (
              <Button 
                type="link" 
                onClick={handleResendPasswordResetOTP}
                disabled={loading}
              >
                Resend Code
              </Button>
            )}
          </div>
          
          <Divider style={{ margin: '12px 0' }}>
            <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Back to beginning</span>
          </Divider>
          
          <Button 
            type="link" 
            onClick={() => {
              setPasswordResetStep(0);
              if (passwordResetTimerRef.current) {
                clearInterval(passwordResetTimerRef.current);
                setOtpResendTimer(0);
              }
            }} 
            block
          >
            Change Email
          </Button>
        </Form>
      )}
      
      {/* Step 3: New Password */}
      {passwordResetStep === 2 && (
        <Form
          form={newPasswordForm}
          onFinish={handleResetPassword}
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="New Password" 
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm Password" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal; 