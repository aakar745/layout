'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { serviceChargeAPI } from '@/lib/api/serviceCharge';
import { PaymentResult } from '@/lib/types/serviceCharge';
import SuccessStep from './steps/SuccessStep';

export default function PaymentResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exhibitionId, setExhibitionId] = useState<string | null>(null);

  useEffect(() => {
    const serviceChargeId = searchParams.get('serviceChargeId');
    const gateway = searchParams.get('gateway');
    
    if (!serviceChargeId) {
      setError('Missing payment information');
      setLoading(false);
      return;
    }

    if (gateway !== 'phonepe') {
      setError('Invalid payment gateway');
      setLoading(false);
      return;
    }

    handlePaymentVerification(serviceChargeId);
  }, [searchParams]);

  const handlePaymentVerification = async (serviceChargeId: string) => {
    try {
      setLoading(true);
      setVerifying(true);
      setError(null);

      // First, get the service charge details
      const statusResponse = await serviceChargeAPI.getServiceChargeStatus(serviceChargeId);
      
      if (!statusResponse.success) {
        throw new Error('Failed to get payment details');
      }

      const serviceCharge = statusResponse.data;
      
      // Extract exhibition ID for navigation
      const extractedExhibitionId = typeof serviceCharge.exhibitionId === 'string' 
        ? serviceCharge.exhibitionId 
        : serviceCharge.exhibitionId._id || serviceCharge.exhibitionId.id;
      
      setExhibitionId(extractedExhibitionId);

      // Check payment status
      if (serviceCharge.paymentStatus === 'paid') {
        // Payment already verified
        setPaymentResult({
          serviceChargeId: serviceCharge._id,
          receiptNumber: serviceCharge.receiptNumber,
          paymentId: serviceCharge.phonePeTransactionId,
          amount: serviceCharge.amount,
          paidAt: serviceCharge.paidAt,
          receiptGenerated: serviceCharge.receiptGenerated,
        });
        toast.success('Payment verified successfully!');
        return;
      }

      if (serviceCharge.paymentStatus === 'failed') {
        // Payment failed, redirect to retry
        toast.error('Payment failed. Redirecting to retry...');
        router.push(`/exhibitions/${extractedExhibitionId}/service-charge?serviceChargeId=${serviceChargeId}&gateway=phonepe`);
        return;
      }

      if (serviceCharge.paymentStatus === 'pending') {
        // Need to verify with PhonePe
        const merchantTransactionId = serviceCharge.phonePeMerchantTransactionId || serviceCharge.receiptNumber;
        
        if (!merchantTransactionId) {
          throw new Error('Missing transaction ID for verification');
        }

        // Verify payment with PhonePe
        const verifyResponse = await serviceChargeAPI.verifyPayment(merchantTransactionId);
        
        if (verifyResponse.success) {
          setPaymentResult(verifyResponse.data);
          toast.success('Payment verified successfully!');
        } else {
          throw new Error('Payment verification failed');
        }
      }

    } catch (err) {
      console.error('Payment verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errorMessage);
      
      if (err instanceof Error && err.message.includes('404')) {
        toast.error('Payment record not found');
      } else if (err instanceof Error && err.message.includes('400')) {
        toast.error('Payment verification failed');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const handleNavigateHome = () => {
    router.push('/exhibitions');
  };

  const handleRetry = () => {
    if (exhibitionId) {
      const serviceChargeId = searchParams.get('serviceChargeId');
      router.push(`/exhibitions/${exhibitionId}/service-charge?serviceChargeId=${serviceChargeId}&gateway=phonepe`);
    } else {
      router.push('/exhibitions');
    }
  };

  // Loading state
  if (loading || verifying) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {verifying ? 'Verifying Payment...' : 'Processing Payment Result...'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {verifying 
              ? 'Please wait while we verify your payment with PhonePe. This may take a few seconds.'
              : 'Please wait while we process your payment result.'
            }
          </p>
          
          <div className="text-sm text-gray-500">
            Please do not close this window or press the back button.
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Verification Failed
          </h1>
          
          <p className="text-gray-600 mb-8">
            {error}
          </p>

          <Alert className="mb-8 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Don&apos;t worry!</strong> If you completed the payment successfully, 
              it may take a few minutes to reflect in our system. You can try checking 
              your payment status later.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <Button onClick={handleRetry} className="w-full" size="lg">
              Try Again
            </Button>
            
            <Button 
              onClick={handleNavigateHome} 
              variant="outline" 
              className="w-full" 
              size="lg"
            >
              Browse Exhibitions
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Common Issues:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Payment verification can take up to 5 minutes</li>
              <li>• Check your bank/PhonePe app for transaction status</li>
              <li>• If payment was deducted, it will be processed automatically</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentResult) {
    return (
      <>
        {/* Page Header */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 py-16">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Service Charge Payment
            </h1>
            <p className="text-xl text-gray-600">
              Secure payment processing for exhibition services
            </p>
          </div>
        </div>

        {/* Success Step Content */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
            <SuccessStep
              paymentResult={paymentResult}
              onNavigateHome={handleNavigateHome}
            />
          </div>
        </div>
      </>
    );
  }

  // Fallback
  return (
    <div className="py-32 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
