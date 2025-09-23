'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import authService from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, User, Building, Mail, Phone, MapPin, Link as LinkIcon, FileText } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface ProfileFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  panNumber?: string;
  gstNumber?: string;
  city?: string;
  state?: string;
  pinCode?: string;
}

export default function ProfilePage() {
  const { isAuthenticated, exhibitor, setCredentials, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    panNumber: '',
    gstNumber: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !exhibitor) {
      redirect('/');
    }
  }, [isAuthenticated, exhibitor]);

  // Initialize form data with current exhibitor data
  useEffect(() => {
    if (exhibitor) {
      setFormData({
        companyName: exhibitor.companyName || '',
        contactPerson: exhibitor.contactPerson || '',
        email: exhibitor.email || '',
        phone: exhibitor.phone || '',
        address: exhibitor.address || '',
        website: exhibitor.website || '',
        description: exhibitor.description || '',
        panNumber: exhibitor.panNumber || '',
        gstNumber: exhibitor.gstNumber || '',
        city: exhibitor.city || '',
        state: exhibitor.state || '',
        pinCode: exhibitor.pinCode || '',
      });
    }
  }, [exhibitor]);

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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm() || !token) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedExhibitor = await authService.updateProfile(token, formData);
      
      // Update the auth store with new data
      setCredentials(updatedExhibitor, token);
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !exhibitor) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your exhibitor profile information and business details.
          </p>
        </div>

        {/* Account Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{exhibitor.companyName}</p>
                <p className="text-sm text-gray-600">Registered on {new Date(exhibitor.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  exhibitor.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : exhibitor.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {exhibitor.status === 'approved' ? 'Approved' : 
                   exhibitor.status === 'pending' ? 'Pending Approval' : 'Rejected'}
                </span>
                {exhibitor.status === 'pending' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Your account is pending admin approval
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Update your company details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={validationErrors.companyName ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {validationErrors.companyName && (
                    <p className="text-sm text-red-600">{validationErrors.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contact Person *
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className={validationErrors.contactPerson ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {validationErrors.contactPerson && (
                    <p className="text-sm text-red-600">{validationErrors.contactPerson}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={validationErrors.email ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={validationErrors.phone ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {validationErrors.phone && (
                    <p className="text-sm text-red-600">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={validationErrors.address ? 'border-red-500' : ''}
                    disabled={isLoading}
                    rows={3}
                  />
                  {validationErrors.address && (
                    <p className="text-sm text-red-600">{validationErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pinCode">PIN Code</Label>
                    <Input
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={isLoading}
                    placeholder="https://www.yourcompany.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange('panNumber', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Company Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  placeholder="Tell us about your company, products, and services..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
