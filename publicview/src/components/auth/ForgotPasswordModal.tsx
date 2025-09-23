'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import authService from '@/lib/api/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

interface ResetFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

type ResetStep = 'email' | 'otp-verification' | 'new-password' | 'success';

export default function ForgotPasswordModal() {
  const {
    showForgotPasswordModal,
    closeForgotPasswordModal,
    openLoginModal,
    setLoading,
    setError,
    clearError,
    isLoading,
    error,
  } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<ResetStep>('email');
  const [formData, setFormData] = useState<ResetFormData>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [resendTimer, setResendTimer] = useState(0);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showForgotPasswordModal) {
      setCurrentStep('email');
      setFormData({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
      });
      setValidationErrors({});
      setResendTimer(0);
      clearError();
    }
  }, [showForgotPasswordModal, clearError]);

  const validateEmail = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswords = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      await authService.sendForgotPasswordOTP({ email: formData.email });
      setResendTimer(60); // 60 seconds cooldown
      setCurrentStep('otp-verification');
    } catch (error: unknown) {
      let errorMessage = 'Failed to send reset code. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('not found') || error.message.includes('not registered')) {
          errorMessage = 'Email not found. Please check your email address or register first.';
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setCurrentStep('new-password');
    clearError();
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      await authService.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      
      setCurrentStep('success');
    } catch (error: unknown) {
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
          errorMessage = 'Invalid or expired verification code. Please try again.';
          setCurrentStep('otp-verification');
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    clearError();

    try {
      await authService.sendForgotPasswordOTP({ email: formData.email });
      setResendTimer(60);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend code. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ResetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    closeForgotPasswordModal();
  };

  const handleBackToLogin = () => {
    closeForgotPasswordModal();
    openLoginModal();
  };

  const renderEmailStep = () => (
    <form onSubmit={sendResetOTP} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Mail className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">Reset Your Password</h3>
        <p className="text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a verification code to reset your password.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={validationErrors.email ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {validationErrors.email && (
          <p className="text-sm text-red-600">{validationErrors.email}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Code...
          </>
        ) : (
          'Send Reset Code'
        )}
      </Button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={verifyOTPAndProceed} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Mail className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">Check Your Email</h3>
        <p className="text-sm text-gray-600">
          We&apos;ve sent a verification code to{' '}
          <span className="font-medium">{formData.email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Enter Verification Code</Label>
        <Input
          id="otp"
          placeholder="Enter 6-digit code"
          value={formData.otp}
          onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          disabled={isLoading}
          className="text-center text-lg tracking-widest"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || formData.otp.length !== 6}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Code'
        )}
      </Button>

      <div className="text-center space-y-2">
        <Button
          variant="link"
          className="p-0 h-auto text-sm"
          onClick={resendOTP}
          disabled={isLoading || resendTimer > 0}
        >
          {resendTimer > 0 
            ? `Resend code in ${resendTimer}s` 
            : 'Resend verification code'
          }
        </Button>
        
        <div>
          <Button
            variant="link"
            className="p-0 h-auto text-sm text-gray-600 hover:text-gray-800"
            onClick={() => setCurrentStep('email')}
            disabled={isLoading}
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Change email address
          </Button>
        </div>
      </div>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={resetPassword} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Create New Password</h3>
        <p className="text-sm text-gray-600">
          Enter a new password for your account.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            className={validationErrors.newPassword ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowNewPassword(!showNewPassword)}
            disabled={isLoading}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {validationErrors.newPassword && (
          <p className="text-sm text-red-600">{validationErrors.newPassword}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={validationErrors.confirmPassword ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {validationErrors.confirmPassword && (
          <p className="text-sm text-red-600">{validationErrors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting Password...
          </>
        ) : (
          'Reset Password'
        )}
      </Button>

      <div className="text-center">
        <Button
          variant="link"
          className="p-0 h-auto text-sm text-gray-600 hover:text-gray-800"
          onClick={() => setCurrentStep('otp-verification')}
          disabled={isLoading}
        >
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to verification
        </Button>
      </div>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-green-600">Password Reset Successful!</h3>
      <p className="text-sm text-gray-600">
        Your password has been successfully reset. You can now log in with your new password.
      </p>
      <Button
        onClick={handleBackToLogin}
        className="w-full"
      >
        Continue to Login
      </Button>
    </div>
  );

  return (
    <Dialog open={showForgotPasswordModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {currentStep === 'email' && 'Forgot Password'}
            {currentStep === 'otp-verification' && 'Verify Email'}
            {currentStep === 'new-password' && 'Reset Password'}
            {currentStep === 'success' && 'Password Reset'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentStep === 'email' && 'Reset your account password'}
            {currentStep === 'otp-verification' && 'Enter the verification code'}
            {currentStep === 'new-password' && 'Create your new password'}
            {currentStep === 'success' && 'Your password has been reset'}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'email' && renderEmailStep()}
        {currentStep === 'otp-verification' && renderOTPStep()}
        {currentStep === 'new-password' && renderPasswordStep()}
        {currentStep === 'success' && renderSuccessStep()}

        {/* Footer Links */}
        {currentStep === 'email' && (
          <div className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-800"
              onClick={handleBackToLogin}
              disabled={isLoading}
            >
              Sign in here
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
