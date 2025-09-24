'use client';

import { CreditCard, ArrowLeft, X, RefreshCw, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ServiceChargeExhibition, 
  ServiceChargeStall, 
  ServiceChargeFormData,
  PaymentStatus
} from '@/lib/types/serviceCharge';

interface PaymentStepProps {
  exhibition: ServiceChargeExhibition;
  stalls: ServiceChargeStall[];
  selectedStall: ServiceChargeStall | null;
  formData: ServiceChargeFormData;
  paymentStatus: PaymentStatus;
  submitting: boolean;
  onPayment: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  countdownSeconds?: number | null;
}

export default function PaymentStep({
  exhibition,
  stalls,
  selectedStall,
  formData,
  paymentStatus,
  submitting,
  onPayment,
  onPrevious,
  onCancel,
  countdownSeconds,
}: PaymentStepProps) {
  
  // Calculate service charge amount
  const calculateAmount = (): number => {
    if (selectedStall && exhibition.config.pricingRules) {
      const { smallStallThreshold, smallStallPrice, largeStallPrice } = exhibition.config.pricingRules;
      return selectedStall.stallArea <= smallStallThreshold ? smallStallPrice : largeStallPrice;
    }

    if (formData.serviceType && exhibition.config.serviceTypes) {
      const serviceType = exhibition.config.serviceTypes.find(st => st.type === formData.serviceType);
      return serviceType?.amount || 0;
    }

    return 0;
  };

  const amount = calculateAmount();
  const isDevelopment = exhibition.config.phonePeConfig.env === 'SANDBOX';

  // Failed payment state
  if (paymentStatus === 'failed') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600">
            Your payment could not be completed. You can try again or start over.
          </p>
          
          {/* Countdown Timer */}
          {countdownSeconds && countdownSeconds > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 text-yellow-600">
                  ⏱️
                </div>
                <span className="text-sm font-medium text-yellow-800">
                  Session expires in: {Math.floor(countdownSeconds / 60)}:{(countdownSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs text-yellow-700 text-center mt-1">
                Make a payment attempt to reset the timer
              </p>
            </div>
          )}
        </div>

        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 text-sm">
            The payment gateway reported that your transaction failed. This could be due to insufficient funds, 
            transaction limits, or other payment issues.
          </AlertDescription>
        </Alert>

        {/* Payment Details */}
        <Card className="p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-gray-600">Vendor Name:</span>
              <span className="font-medium break-words">{formData.vendorName}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-gray-600">Company Name:</span>
              <span className="font-medium break-words">{formData.companyName}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-gray-600">Stall Number:</span>
              <span className="font-medium">{formData.stallNumber}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-t pt-3">
              <span className="text-gray-600">Service Charge:</span>
              <span className="text-lg font-bold text-blue-600">
                ₹{amount.toLocaleString()}
                <span className="text-xs text-gray-500 ml-1">(Incl. GST)</span>
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onPayment}
            disabled={submitting}
            className="flex-1"
            size="lg"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Payment Again
              </>
            )}
          </Button>
          
          <Button
            onClick={onCancel}
            variant="outline"
            size="lg"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel & Start Over
          </Button>
        </div>
      </div>
    );
  }

  // Normal payment step
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Payment Details
        </h2>
        <p className="text-gray-600">
          Review your details and proceed with secure payment.
        </p>
      </div>

      {/* Payment Summary */}
      <Card className="p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
            <span className="text-gray-600 text-sm">Vendor Name</span>
            <span className="font-medium break-words">{formData.vendorName}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
            <span className="text-gray-600 text-sm">Vendor Company</span>
            <span className="font-medium break-words">{formData.companyName}</span>
          </div>

          {formData.exhibitorCompanyName && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
              <span className="text-gray-600 text-sm">Exhibitor Company</span>
              <span className="font-medium break-words">{formData.exhibitorCompanyName}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
            <span className="text-gray-600 text-sm">Stall Number</span>
            <span className="font-medium">{formData.stallNumber}</span>
          </div>

          {selectedStall && (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
                <span className="text-gray-600 text-sm">Stall Area</span>
                <span className="font-medium">{selectedStall.stallArea} sqm</span>
              </div>
              
              {selectedStall.dimensions && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
                  <span className="text-gray-600 text-sm">Dimensions</span>
                  <span className="font-medium">
                    {selectedStall.dimensions.width} × {selectedStall.dimensions.height}m
                  </span>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
            <span className="text-gray-600 text-sm">Mobile Number</span>
            <span className="font-medium">{formData.vendorPhone}</span>
          </div>

          {formData.serviceType && !selectedStall && (
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Service Type</span>
              <span className="font-medium">{formData.serviceType}</span>
            </div>
          )}

          {/* Total Amount */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 py-4 border-t-2 border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Service Charge</span>
            <div className="text-left sm:text-right">
              <div className="text-2xl font-bold text-blue-600">
                ₹{amount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">(Inclusive of GST)</div>
              {selectedStall && exhibition.config.pricingRules && (
                <div className="text-xs text-gray-500 mt-1">
                  {selectedStall.stallArea <= exhibition.config.pricingRules.smallStallThreshold 
                    ? `Small stall pricing (≤${exhibition.config.pricingRules.smallStallThreshold} sqm)` 
                    : `Large stall pricing (>${exhibition.config.pricingRules.smallStallThreshold} sqm)`
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Gateway Info */}
      <div className="mb-8">
        {isDevelopment ? (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Development Mode:</strong> This is running in development mode. 
              PhonePe payment will be simulated - no actual payment will be processed.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-green-200 bg-green-50">
            <Lock className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Secure Payment:</strong> Your payment is processed securely through PhonePe. 
              You will receive a receipt via email after successful payment.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* PhonePe Badge */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">Pe</span>
          </div>
          <span className="text-purple-800 font-medium">Powered by PhonePe</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="lg"
          className="sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={onPayment}
          disabled={submitting || paymentStatus === 'processing'}
          className="flex-1"
          size="lg"
        >
          {submitting || paymentStatus === 'processing' ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                {isDevelopment
                  ? `Simulate PhonePe Payment ₹${amount.toLocaleString()}`
                  : `Pay via PhonePe ₹${amount.toLocaleString()}`}
              </span>
              <span className="sm:hidden">
                {isDevelopment
                  ? `Test Pay ₹${amount.toLocaleString()}`
                  : `Pay ₹${amount.toLocaleString()}`}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
