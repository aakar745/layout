'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useBookingStore } from '@/store/bookingStore';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { ArrowRight, ArrowLeft, User, Mail, Phone, Building, MapPin, CreditCard } from 'lucide-react';

interface CustomerStepProps {
  exhibition: ExhibitionWithStats;
}

export default function CustomerStep({ exhibition }: CustomerStepProps) {
  const { 
    formData, 
    updateCustomerInfo, 
    goToNextStep, 
    goToPreviousStep,
    validateStep,
    errors,
    setErrors,
    clearErrors
  } = useBookingStore();
  
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    updateCustomerInfo({ [field]: value });
    
    // Clear error when user starts typing
    if (localErrors[field]) {
      const newErrors = { ...localErrors };
      delete newErrors[field];
      setLocalErrors(newErrors);
    }
  };

  const handleContinue = () => {
    clearErrors();
    const validations = validateStep(1);
    
    if (validations.some(v => !v.isValid)) {
      const newErrors: Record<string, string> = {};
      validations.forEach(v => {
        if (!v.isValid) {
          newErrors[v.field] = v.message;
        }
      });
      setLocalErrors(newErrors);
      return;
    }
    
    goToNextStep();
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Information
        </h2>
        <p className="text-gray-600">
          Please provide your contact details to complete the booking.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.customerInfo.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={localErrors.name ? 'border-red-500' : ''}
                  />
                  {localErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{localErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.customerInfo.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 ${localErrors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {localErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{localErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.customerInfo.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`pl-10 ${localErrors.phone ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {localErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{localErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Business Information
                <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your company name"
                    value={formData.customerInfo.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="22AAAAA0000A1Z5"
                        value={formData.customerInfo.gstNumber || ''}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter GST number for business invoicing
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        placeholder="Enter your address"
                        value={formData.customerInfo.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full pl-10 pt-2 pb-2 pr-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Usage Notice */}
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  🔒 Privacy & Data Security
                </h4>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>• Your information is encrypted and securely stored</p>
                  <p>• We'll use this data only for booking confirmation and communication</p>
                  <p>• You can update or delete your information anytime</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-sm text-gray-500">
            Step 2 of 4 • Contact information
          </div>
          
          <Button 
            onClick={handleContinue}
            size="lg"
            className="px-8"
          >
            Continue to Services
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
