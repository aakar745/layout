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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RegisterFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

type RegistrationStep = 'form' | 'otp-verification' | 'success';

export default function RegisterModal() {
  const {
    showRegisterModal,
    closeRegisterModal,
    openLoginModal,
    setCredentials,
    setLoading,
    setError,
    clearError,
    isLoading,
    error,
  } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>('form');
  const [formData, setFormData] = useState<RegisterFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [otpMethod, setOtpMethod] = useState<'email' | 'whatsapp'>('email');
  const [showPassword, setShowPassword] = useState(false);
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
    if (showRegisterModal) {
      setCurrentStep('form');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
      });
      setOtp('');
      setValidationErrors({});
      setOtpSent(false);
      setResendTimer(0);
      clearError();
    }
  }, [showRegisterModal, clearError]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendOTP = async () => {
    if (!formData.email.trim()) {
      setError('Email is required to send OTP');
      return;
    }

    setLoading(true);
    clearError();

    try {
      if (otpMethod === 'email') {
        await authService.sendEmailOTP({ email: formData.email });
      } else {
        await authService.sendWhatsAppOTP({ phone: formData.phone });
      }
      
      setResendTimer(60); // 60 seconds cooldown
      setCurrentStep('otp-verification');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await sendOTP();
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    clearError();

    try {
      // First verify OTP
      const verifyResponse = await authService.verifyOTP(formData.email, otp);
      
      if (!verifyResponse.verified) {
        setError('Invalid OTP. Please try again.');
        setLoading(false);
        return;
      }

      // Then register the user
      const registerData = {
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone.replace(/[\s\-()]/g, ''),
        address: formData.address,
        password: formData.password,
        otp: otp,
      };

      const response = await authService.register(registerData);
      
      if (response.exhibitor && response.token) {
        setCredentials(response.exhibitor, response.token);
        setCurrentStep('success');
      }
    } catch (error: unknown) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          errorMessage = 'An exhibitor with this email already exists. Please try logging in instead.';
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    if (currentStep === 'success') {
      closeRegisterModal();
    } else {
      closeRegisterModal();
    }
  };

  const renderFormStep = () => (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          placeholder="Enter your company name"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className={validationErrors.companyName ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {validationErrors.companyName && (
          <p className="text-sm text-red-600">{validationErrors.companyName}</p>
        )}
      </div>

      {/* Contact Person */}
      <div className="space-y-2">
        <Label htmlFor="contactPerson">Contact Person *</Label>
        <Input
          id="contactPerson"
          placeholder="Enter contact person name"
          value={formData.contactPerson}
          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
          className={validationErrors.contactPerson ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {validationErrors.contactPerson && (
          <p className="text-sm text-red-600">{validationErrors.contactPerson}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
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

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={validationErrors.phone ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {validationErrors.phone && (
          <p className="text-sm text-red-600">{validationErrors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          placeholder="Enter your company address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={validationErrors.address ? 'border-red-500' : ''}
          disabled={isLoading}
          rows={2}
        />
        {validationErrors.address && (
          <p className="text-sm text-red-600">{validationErrors.address}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={validationErrors.password ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {validationErrors.password && (
          <p className="text-sm text-red-600">{validationErrors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
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

      {/* OTP Method Selection */}
      <div className="space-y-2">
        <Label>Verification Method</Label>
        <Tabs value={otpMethod} onValueChange={(value: string) => setOtpMethod(value as 'email' | 'whatsapp')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email OTP
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              WhatsApp OTP
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending OTP...
          </>
        ) : (
          `Send OTP via ${otpMethod === 'email' ? 'Email' : 'WhatsApp'}`
        )}
      </Button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleOTPVerification} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-center space-y-2">
        <div className="flex justify-center">
          {otpMethod === 'email' ? (
            <Mail className="h-12 w-12 text-blue-600" />
          ) : (
            <MessageSquare className="h-12 w-12 text-green-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold">Verify Your {otpMethod === 'email' ? 'Email' : 'Phone'}</h3>
        <p className="text-sm text-gray-600">
          We&apos;ve sent a verification code to{' '}
          <span className="font-medium">
            {otpMethod === 'email' ? formData.email : formData.phone}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Enter Verification Code</Label>
        <Input
          id="otp"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          disabled={isLoading}
          className="text-center text-lg tracking-widest"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify & Register'
        )}
      </Button>

      <div className="text-center">
        <Button
          variant="link"
          className="p-0 h-auto text-sm"
          onClick={sendOTP}
          disabled={isLoading || resendTimer > 0}
        >
          {resendTimer > 0 
            ? `Resend OTP in ${resendTimer}s` 
            : 'Resend OTP'
          }
        </Button>
      </div>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-green-600">Registration Successful!</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <p>Welcome to our platform, <span className="font-medium">{formData.companyName}</span>!</p>
        <p>Your account has been created and is pending approval from our admin team.</p>
        <p>You&apos;ll receive an email notification once your account is approved.</p>
      </div>
      <Button
        onClick={handleClose}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );

  return (
    <Dialog open={showRegisterModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {currentStep === 'form' && 'Create Account'}
            {currentStep === 'otp-verification' && 'Verify Account'}
            {currentStep === 'success' && 'Welcome!'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentStep === 'form' && 'Join our platform as an exhibitor'}
            {currentStep === 'otp-verification' && 'Complete your registration'}
            {currentStep === 'success' && 'Your registration is complete'}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'form' && renderFormStep()}
        {currentStep === 'otp-verification' && renderOTPStep()}
        {currentStep === 'success' && renderSuccessStep()}

        {/* Footer Links */}
        {currentStep === 'form' && (
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-800"
              onClick={() => {
                closeRegisterModal();
                openLoginModal();
              }}
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
