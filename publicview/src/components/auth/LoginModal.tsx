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
import { Loader2, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoginFormData {
  loginIdentifier: string;
  password: string;
}

export default function LoginModal() {
  const {
    showLoginModal,
    closeLoginModal,
    openRegisterModal,
    openForgotPasswordModal,
    setCredentials,
    setLoading,
    setError,
    clearError,
    isLoading,
    error,
    loginContext,
  } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    loginIdentifier: '',
    password: '',
  });
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Clear form when modal opens/closes
  useEffect(() => {
    if (showLoginModal) {
      setFormData({ loginIdentifier: '', password: '' });
      setValidationErrors({});
      clearError();
    }
  }, [showLoginModal, clearError]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.loginIdentifier.trim()) {
      errors.loginIdentifier = `${loginMethod === 'email' ? 'Email' : 'Phone number'} is required`;
    } else if (loginMethod === 'email' && !/\S+@\S+\.\S+/.test(formData.loginIdentifier)) {
      errors.loginIdentifier = 'Please enter a valid email address';
    } else if (loginMethod === 'phone' && !/^\+?[\d\s\-()]{10,}$/.test(formData.loginIdentifier)) {
      errors.loginIdentifier = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      const loginData = {
        password: formData.password,
        ...(loginMethod === 'email' 
          ? { email: formData.loginIdentifier } 
          : { phone: formData.loginIdentifier.replace(/[\s\-()]/g, '') }
        ),
      };

      const response = await authService.login(loginData);
      
      if (response.exhibitor && response.token) {
        setCredentials(response.exhibitor, response.token);
        closeLoginModal();
        
        // Show context-specific success message
        if (loginContext === 'stall-booking') {
          // You can show a toast here if you have a toast system
          console.log('Login successful! You can now proceed with booking.');
        }
      }
    } catch (error: unknown) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof Error && error.message.includes('403')) {
        // Handle account status errors
        if (error.message.includes('pending')) {
          errorMessage = 'Your account is pending approval. You will be able to log in after admin approval.';
        } else if (error.message.includes('rejected')) {
          errorMessage = 'Your registration has been rejected. Please contact the administrator for more details.';
        } else {
          errorMessage = 'Access denied. Please contact administrator.';
        }
      } else if (error instanceof Error && error.message.includes('401')) {
        if (error.message.includes('not registered')) {
          errorMessage = `${loginMethod === 'email' ? 'Email' : 'Phone number'} is not registered. Please register first.`;
        } else if (error.message.includes('deactivated')) {
          errorMessage = 'Your account has been deactivated. Please contact admin.';
        } else {
          errorMessage = 'Invalid password. Please try again.';
        }
      } else {
        errorMessage = error instanceof Error ? error.message || errorMessage : errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getContextMessage = () => {
    if (loginContext === 'stall-booking') {
      return 'Please log in to proceed with stall booking.';
    }
    return null;
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={() => closeLoginModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center">
            {getContextMessage() || 'Sign in to your exhibitor account'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Method Tabs */}
          <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.loginIdentifier}
                  onChange={(e) => handleInputChange('loginIdentifier', e.target.value)}
                  className={validationErrors.loginIdentifier ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {validationErrors.loginIdentifier && (
                  <p className="text-sm text-red-600">{validationErrors.loginIdentifier}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.loginIdentifier}
                  onChange={(e) => handleInputChange('loginIdentifier', e.target.value)}
                  className={validationErrors.loginIdentifier ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {validationErrors.loginIdentifier && (
                  <p className="text-sm text-red-600">{validationErrors.loginIdentifier}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600">{validationErrors.password}</p>
            )}
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="space-y-3 text-center text-sm">
          <Button
            variant="link"
            className="p-0 h-auto text-blue-600 hover:text-blue-800"
            onClick={() => {
              closeLoginModal();
              openForgotPasswordModal();
            }}
            disabled={isLoading}
          >
            Forgot your password?
          </Button>
          
          <div className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-800"
              onClick={() => {
                closeLoginModal();
                openRegisterModal();
              }}
              disabled={isLoading}
            >
              Sign up here
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
