'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { serviceChargeAPI } from '@/lib/api/serviceCharge';
import { 
  ServiceChargeExhibition, 
  ServiceChargeStall, 
  ServiceChargeFormData,
  PaymentStatus,
  PaymentResult
} from '@/lib/types/serviceCharge';
import { useAtomicServiceCharge } from '@/hooks/useAtomicServiceCharge';
import VendorDetailsStep from './steps/VendorDetailsStep';
import PaymentStep from './steps/PaymentStep';
import SuccessStep from './steps/SuccessStep';
import StepsIndicator from './StepsIndicator';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';

interface ServiceChargeClientProps {
  exhibitionId: string;
}

export default function ServiceChargeClient({ exhibitionId }: ServiceChargeClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Atomic service charge hook for race condition protection
  const atomicServiceCharge = useAtomicServiceCharge({
    onSuccess: (result) => {
      // Handle successful payment
      if (result?.data?.redirectUrl) {
        window.location.href = result.data.redirectUrl;
      }
    },
    onError: (error) => {
      console.error('Atomic service charge error:', error);
      setPaymentStatus('failed');
      
      // Handle specific error types
      if (error.type === 'duplicate_payment') {
        // Reset to first step to check payment status
        setCurrentStep(0);
        toast.error('Payment already exists. Please check payment status.');
      } else if (error.message?.includes('Stall not found') || error.message?.includes('reselect your stall')) {
        // Reset to first step to reselect stall
        console.log('🔄 Stall selection error - redirecting to step 1');
        setCurrentStep(0);
        setSelectedStall(null);
        toast.error('Please reselect your stall and try again');
      } else {
        // Start auto-cancel timeout for other payment failures
        startAutoCancelTimeout();
        toast.error('Payment failed. Please try again.');
      }
    },
    debounceMs: 1000, // 1 second debounce for payments
    cooldownMs: 3000, // 3 second cooldown
    maxRetries: 3
  });
  
  // Data state
  const [exhibition, setExhibition] = useState<ServiceChargeExhibition | null>(null);
  const [stalls, setStalls] = useState<ServiceChargeStall[]>([]);
  const [selectedStall, setSelectedStall] = useState<ServiceChargeStall | null>(null);
  const [pendingStallNumber, setPendingStallNumber] = useState<string | null>(null); // For restoration after stalls load
  const [formData, setFormData] = useState<ServiceChargeFormData>({
    vendorName: '',
    companyName: '',
    exhibitorCompanyName: '',
    vendorPhone: '',
    stallNumber: '',
    stallArea: 0,
    serviceType: '',
    uploadedImage: '',
  });
  
  // Payment state
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentServiceChargeId, setCurrentServiceChargeId] = useState<string | null>(null);
  
  // Auto-cancel timeout for abandoned payment retries
  const autoCancelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showAutoCancelWarning, setShowAutoCancelWarning] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

  // Load exhibition config and stalls
  useEffect(() => {
    const loadExhibitionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load exhibition config
        const configResponse = await serviceChargeAPI.getExhibitionConfig(exhibitionId);
        
        if (!configResponse.success) {
          throw new Error(configResponse.message || 'Failed to load exhibition configuration');
        }

        if (!configResponse.data.config.isEnabled) {
          throw new Error('Service charges are not enabled for this exhibition');
        }

        setExhibition(configResponse.data);

        // Load stalls if available
        try {
          const stallsResponse = await serviceChargeAPI.getExhibitionStalls(exhibitionId);
          if (stallsResponse.success) {
            setStalls(stallsResponse.data);
          }
        } catch (stallsError) {
          // Stalls are optional for backward compatibility
          console.warn('Failed to load stalls:', stallsError);
        }

      } catch (err) {
        console.error('Error loading exhibition data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exhibition data');
      } finally {
        setLoading(false);
      }
    };

    if (exhibitionId) {
      loadExhibitionData();
    }
  }, [exhibitionId]);

  // Handle payment redirect from URL params
  useEffect(() => {
    const serviceChargeId = searchParams.get('serviceChargeId');
    const gateway = searchParams.get('gateway');
    
    if (serviceChargeId && gateway === 'phonepe') {
      handlePaymentVerification(serviceChargeId);
    }
  }, [searchParams]);

  // Restore stall selection when stalls are loaded (for payment retry scenarios)
  useEffect(() => {
    if (pendingStallNumber && stalls.length > 0) {
      const stall = stalls.find(s => s.stallNumber === pendingStallNumber);
      if (stall) {
        console.log('🔄 Restoring stall selection after stalls loaded:', stall.stallNumber);
        setSelectedStall(stall);
        setPendingStallNumber(null); // Clear pending restoration
      }
    }
  }, [stalls, pendingStallNumber]);

  // Auto-cancel timeout management for abandoned payment retries
  const startAutoCancelTimeout = useCallback(() => {
    console.log('⏱️ Starting auto-cancel timeout for abandoned payment retry');
    
    // Clear any existing timeouts
    if (autoCancelTimeoutRef.current) {
      clearTimeout(autoCancelTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Start countdown at 120 seconds (2 minutes)
    setCountdownSeconds(120);
    
    // Update countdown every second
    countdownIntervalRef.current = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev === null || prev <= 1) {
          return null; // Stop countdown
        }
        return prev - 1;
      });
    }, 1000);

    // Show warning after 90 seconds (1.5 minutes)
    warningTimeoutRef.current = setTimeout(() => {
      setShowAutoCancelWarning(true);
      toast.warning('Session will expire in 30 seconds due to inactivity', {
        duration: 5000,
        action: {
          label: 'Stay Active',
          onClick: () => {
            clearAutoCancelTimeout();
            setShowAutoCancelWarning(false);
          }
        }
      });
    }, 90000); // 90 seconds

    // Auto-cancel after 2 minutes total
    autoCancelTimeoutRef.current = setTimeout(async () => {
      console.log('🔄 Auto-cancelling abandoned payment retry after 2 minutes');
      
      // Cancel backend service charge if exists
      if (currentServiceChargeId) {
        try {
          console.log('🚫 [AUTO-CANCEL] Cancelling backend service charge:', currentServiceChargeId);
          await serviceChargeAPI.cancelServiceCharge(
            currentServiceChargeId, 
            'Auto-cancelled due to user inactivity (2 minute timeout)'
          );
          console.log('✅ [AUTO-CANCEL] Backend service charge cancelled successfully');
        } catch (error) {
          console.error('❌ [AUTO-CANCEL] Failed to cancel backend service charge:', error);
          // Continue with frontend cleanup even if backend cancellation fails
        }
      }
      
      // Reset to initial state
      setCurrentStep(0);
      setPaymentStatus('idle');
      setSelectedStall(null);
      setPendingStallNumber(null);
      setShowAutoCancelWarning(false);
      setCountdownSeconds(null);
      setCurrentServiceChargeId(null); // Clear tracked service charge
      setFormData({
        vendorName: '',
        companyName: '',
        exhibitorCompanyName: '',
        vendorPhone: '',
        stallNumber: '',
        stallArea: 0,
        serviceType: '',
        uploadedImage: '',
      });
      
      toast.info('Payment session expired due to inactivity. Please start over.', {
        duration: 6000
      });
      
      autoCancelTimeoutRef.current = null;
      warningTimeoutRef.current = null;
      countdownIntervalRef.current = null;
    }, 120000); // 2 minutes
  }, []);

  const clearAutoCancelTimeout = useCallback(() => {
    if (autoCancelTimeoutRef.current) {
      console.log('🛑 Clearing auto-cancel timeout due to user activity');
      clearTimeout(autoCancelTimeoutRef.current);
      autoCancelTimeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setShowAutoCancelWarning(false);
    setCountdownSeconds(null);
  }, []);

  // Manual cancel function for user-initiated cancellations
  const cancelCurrentServiceCharge = useCallback(async (reason: string = 'User cancelled manually') => {
    if (currentServiceChargeId) {
      try {
        console.log('🚫 [MANUAL-CANCEL] Cancelling service charge:', currentServiceChargeId);
        await serviceChargeAPI.cancelServiceCharge(currentServiceChargeId, reason);
        console.log('✅ [MANUAL-CANCEL] Service charge cancelled successfully');
        setCurrentServiceChargeId(null);
      } catch (error) {
        console.error('❌ [MANUAL-CANCEL] Failed to cancel service charge:', error);
        // Continue even if backend cancellation fails
        setCurrentServiceChargeId(null);
      }
    }
  }, [currentServiceChargeId]);

  // Cleanup on unmount to prevent memory leaks and cancel pending operations
  useEffect(() => {
    return () => {
      console.log('🧹 [CLEANUP] Component unmounting, cleaning up timers and pending operations');
      clearAutoCancelTimeout();
      
      // Don't cancel service charge on unmount as user might be navigating to payment gateway
      // The auto-cancel timeout will handle abandoned sessions
    };
  }, [clearAutoCancelTimeout]);

  // Clear timeouts on component unmount
  useEffect(() => {
    return () => {
      if (autoCancelTimeoutRef.current) {
        clearTimeout(autoCancelTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Handle payment verification
  const handlePaymentVerification = async (serviceChargeId: string) => {
    try {
      setLoading(true);
      setPaymentStatus('processing');

      // Get service charge details
      const statusResponse = await serviceChargeAPI.getServiceChargeStatus(serviceChargeId);
      
      if (!statusResponse.success) {
        throw new Error('Failed to get payment status');
      }

      const serviceCharge = statusResponse.data;

      // If already paid, show success
      if (serviceCharge.paymentStatus === 'paid') {
        setPaymentResult({
          serviceChargeId: serviceCharge._id,
          receiptNumber: serviceCharge.receiptNumber,
          paymentId: serviceCharge.phonePeTransactionId,
          amount: serviceCharge.amount,
          paidAt: serviceCharge.paidAt,
          receiptGenerated: serviceCharge.receiptGenerated,
        });
        setCurrentStep(2);
        setPaymentStatus('success');
        setCurrentServiceChargeId(null); // Clear tracked service charge on success
        return;
      }

      // If failed, show retry option
      if (serviceCharge.paymentStatus === 'failed') {
        // Restore form data for retry
        restoreFormDataFromServiceCharge(serviceCharge);
        setPaymentStatus('failed');
        setCurrentStep(1);
        
        // Start auto-cancel timeout for abandoned retry
        startAutoCancelTimeout();
        
        // Note: Error toast will be handled by the atomic service charge onError handler
        return;
      }

      // Verify payment with PhonePe
      const merchantTransactionId = serviceCharge.phonePeMerchantTransactionId || serviceCharge.receiptNumber;
      
      if (!merchantTransactionId) {
        throw new Error('Missing transaction details for verification');
      }

      const verifyResponse = await serviceChargeAPI.verifyPayment(merchantTransactionId);
      
      if (verifyResponse.success) {
        setPaymentResult(verifyResponse.data);
        setCurrentStep(2);
        setPaymentStatus('success');
        setCurrentServiceChargeId(null); // Clear tracked service charge on verification success
        toast.success('Payment verified successfully!');
      } else {
        throw new Error('Payment verification failed');
      }

    } catch (err) {
      console.error('Payment verification error:', err);
      setPaymentStatus('failed');
      setCurrentStep(1);
      toast.error(err instanceof Error ? err.message : 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Restore form data from service charge
  const restoreFormDataFromServiceCharge = (serviceCharge: any) => {
    console.log('🔄 Restoring form data from service charge:', serviceCharge.stallNumber);
    
    setFormData({
      vendorName: serviceCharge.vendorName || '',
      companyName: serviceCharge.companyName || '',
      exhibitorCompanyName: serviceCharge.exhibitorCompanyName || '',
      vendorPhone: serviceCharge.vendorPhone || '',
      stallNumber: serviceCharge.stallNumber || '',
      stallArea: serviceCharge.stallArea || 0,
      serviceType: serviceCharge.serviceType || '',
      uploadedImage: serviceCharge.uploadedImage,
    });

    // Restore stall selection if available
    if (serviceCharge.stallNumber) {
      if (stalls.length > 0) {
        // Stalls are already loaded, restore immediately
        const stall = stalls.find(s => s.stallNumber === serviceCharge.stallNumber);
        if (stall) {
          console.log('🔄 Immediately restoring stall selection:', stall.stallNumber);
          setSelectedStall(stall);
        } else {
          console.warn('⚠️ Stall not found in loaded stalls:', serviceCharge.stallNumber);
        }
      } else {
        // Stalls not loaded yet, set pending for restoration later
        console.log('⏳ Setting pending stall number for restoration:', serviceCharge.stallNumber);
        setPendingStallNumber(serviceCharge.stallNumber);
      }
    }
  };

  // Handle stall selection
  const handleStallSelection = (stallNumber: string) => {
    const stall = stalls.find(s => s.stallNumber === stallNumber);
    if (stall) {
      setSelectedStall(stall);
      setFormData(prev => ({
        ...prev,
        stallNumber: stallNumber,
        exhibitorCompanyName: stall.exhibitorCompanyName,
        stallArea: stall.stallArea,
      }));
    } else {
      setSelectedStall(null);
      setFormData(prev => ({
        ...prev,
        stallNumber: stallNumber,
        exhibitorCompanyName: '',
        stallArea: 0,
      }));
    }
  };

  // Handle form submission
  const handleFormSubmit = (data: ServiceChargeFormData) => {
    // Clear auto-cancel timeout when user submits form
    clearAutoCancelTimeout();
    
    setFormData(data);
    setCurrentStep(1);
  };

  // Handle payment with atomic protection
  const handlePayment = async () => {
    // Clear auto-cancel timeout when user actively tries payment
    clearAutoCancelTimeout();
    
    // Use atomic service charge hook to prevent race conditions
    await atomicServiceCharge.executeOperation(async () => {
      setSubmitting(true);
      setPaymentStatus('processing');

      try {
        // Calculate amount
        const amount = calculateServiceChargeAmount();
        
        if (!amount) {
          console.error('💸 Payment failed: Unable to calculate service charge amount', {
            selectedStall: !!selectedStall,
            stallNumber: formData.stallNumber,
            stallArea: formData.stallArea,
            serviceType: formData.serviceType,
            exhibition: !!exhibition,
            pricingRules: !!exhibition?.config?.pricingRules
          });
          
          const errorMsg = selectedStall 
            ? 'Unable to calculate service charge - pricing rules not found'
            : formData.stallNumber 
              ? 'Stall not found - please reselect your stall'
              : 'Please select a stall or service type to calculate charges';
              
          throw new Error(errorMsg);
        }

        // Create payment order
        const paymentData = {
          exhibitionId: exhibition!._id,
          vendorName: formData.vendorName,
          vendorPhone: formData.vendorPhone,
          companyName: formData.companyName,
          exhibitorCompanyName: formData.exhibitorCompanyName,
          stallNumber: formData.stallNumber,
          stallArea: formData.stallArea,
          serviceType: formData.serviceType || 'Stall Service Charge',
          amount: amount.toString(),
          uploadedImage: formData.uploadedImage,
        };

        console.log('🔒 [ATOMIC] Creating payment order with race condition protection...');
        const orderResponse = await serviceChargeAPI.createPaymentOrder(paymentData);
        
        if (!orderResponse.success || !orderResponse.data.redirectUrl) {
          throw new Error('Failed to create payment order');
        }

        // Track the service charge ID for potential cancellation
        if (orderResponse.data.serviceChargeId) {
          console.log('📝 [TRACKING] Storing service charge ID for cleanup:', orderResponse.data.serviceChargeId);
          setCurrentServiceChargeId(orderResponse.data.serviceChargeId);
        }

        console.log('✅ [ATOMIC] Payment order created successfully');
        return orderResponse;

      } finally {
        setSubmitting(false);
      }
    });
  };

  // Calculate service charge amount
  const calculateServiceChargeAmount = (): number => {
    console.log('💰 Calculating service charge amount...', {
      exhibition: !!exhibition,
      selectedStall: !!selectedStall,
      stallNumber: formData.stallNumber,
      serviceType: formData.serviceType,
      pricingRules: !!exhibition?.config?.pricingRules,
      serviceTypes: !!exhibition?.config?.serviceTypes
    });

    if (!exhibition) {
      console.warn('⚠️ No exhibition data available for calculation');
      return 0;
    }

    // For stall-based pricing
    if (selectedStall && exhibition.config.pricingRules) {
      const { smallStallThreshold, smallStallPrice, largeStallPrice } = exhibition.config.pricingRules;
      const amount = selectedStall.stallArea <= smallStallThreshold ? smallStallPrice : largeStallPrice;
      console.log('💰 Calculated stall-based amount:', amount, {
        stallArea: selectedStall.stallArea,
        threshold: smallStallThreshold,
        smallPrice: smallStallPrice,
        largePrice: largeStallPrice
      });
      return amount;
    }

    // For legacy service types
    if (formData.serviceType && exhibition.config.serviceTypes) {
      const serviceType = exhibition.config.serviceTypes.find(st => st.type === formData.serviceType);
      const amount = serviceType?.amount || 0;
      console.log('💰 Calculated service-type amount:', amount, {
        serviceType: formData.serviceType,
        found: !!serviceType
      });
      return amount;
    }

    // Fallback: Try to calculate from form data stallArea if available
    if (formData.stallArea > 0 && exhibition.config.pricingRules) {
      const { smallStallThreshold, smallStallPrice, largeStallPrice } = exhibition.config.pricingRules;
      const amount = formData.stallArea <= smallStallThreshold ? smallStallPrice : largeStallPrice;
      console.log('💰 Calculated fallback amount from formData.stallArea:', amount, {
        stallArea: formData.stallArea,
        threshold: smallStallThreshold
      });
      return amount;
    }

    console.warn('⚠️ Unable to calculate service charge amount - no valid pricing data found');
    return 0;
  };

  // Handle navigation
  const handlePrevious = () => {
    // Clear auto-cancel timeout on user navigation
    clearAutoCancelTimeout();
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    // Clear auto-cancel timeout when user cancels
    clearAutoCancelTimeout();
    
    setCurrentStep(0);
    setPaymentStatus('idle');
    setFormData({
      vendorName: '',
      companyName: '',
      exhibitorCompanyName: '',
      vendorPhone: '',
      stallNumber: '',
      stallArea: 0,
      serviceType: '',
      uploadedImage: '',
    });
    setSelectedStall(null);
    router.push(`/exhibitions/${exhibitionId}/service-charge`);
  };

  const handleNavigateHome = () => {
    // Clear auto-cancel timeout when user navigates home
    clearAutoCancelTimeout();
    router.push('/exhibitions');
  };

  // Loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // Error screen
  if (error) {
    return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;
  }

  // Main render
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Service Charge Payment
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6 px-2 sm:px-0 leading-relaxed">
            {exhibition?.config.title || 'Pay your exhibition service charges securely'}
          </p>
          <div className="text-sm text-gray-500">
            {exhibition?.name} • {exhibition?.venue}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Steps Indicator */}
        <div className="mb-6 sm:mb-8">
          <StepsIndicator currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {currentStep === 0 && (
            <VendorDetailsStep
              exhibition={exhibition!}
              stalls={stalls}
              selectedStall={selectedStall}
              formData={formData}
              onStallSelection={handleStallSelection}
              onSubmit={handleFormSubmit}
            />
          )}

          {currentStep === 1 && (
            <PaymentStep
              exhibition={exhibition!}
              stalls={stalls}
              selectedStall={selectedStall}
              formData={formData}
              paymentStatus={paymentStatus}
              submitting={submitting || atomicServiceCharge.isProcessing}
              onPayment={handlePayment}
              onPrevious={handlePrevious}
              onCancel={handleCancel}
              countdownSeconds={countdownSeconds}
            />
          )}

          {currentStep === 2 && paymentResult && (
            <SuccessStep
              paymentResult={paymentResult}
              onNavigateHome={handleNavigateHome}
            />
          )}
        </div>
      </div>
    </div>
  );
}
