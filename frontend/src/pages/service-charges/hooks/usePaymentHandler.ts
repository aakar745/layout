import { useEffect } from 'react';
import { message } from 'antd';
import publicServiceChargeService from '../../../services/publicServiceCharge';
import { calculateServiceCharge } from '../utils/serviceChargeCalculator';
import { 
  verifyPaymentWithRetry, 
  restoreFormDataFromServiceCharge,
  isPaymentResultPage 
} from '../utils/paymentVerification';
import { 
  ExhibitionConfig, 
  ServiceChargeStall, 
  FormData, 
  PaymentData 
} from '../types';

interface UsePaymentHandlerProps {
  exhibitionId?: string;
  location: any;
  currentStep: number;
  paymentVerified: boolean;
  verificationInProgress: boolean;
  exhibition: ExhibitionConfig | null;
  stalls: ServiceChargeStall[];
  selectedStall: ServiceChargeStall | null;
  formData: FormData;
  setLoading: (loading: boolean) => void;
  setCurrentStep: (step: number) => void;
  setPaymentResult: (result: any) => void;
  setPaymentVerified: (verified: boolean) => void;
  setVerificationInProgress: (inProgress: boolean) => void;
  setPaymentStatus: (status: any) => void;
  setFailedServiceChargeId: (id: string | null) => void;
  setFormData: (data: any) => void;
  setExhibition: (exhibition: ExhibitionConfig | null) => void;
  setSubmitting: (submitting: boolean) => void;
  form: any;
  navigate: any;
}

export const usePaymentHandler = ({
  exhibitionId,
  location,
  currentStep,
  paymentVerified,
  verificationInProgress,
  exhibition,
  stalls,
  selectedStall,
  formData,
  setLoading,
  setCurrentStep,
  setPaymentResult,
  setPaymentVerified,
  setVerificationInProgress,
  setPaymentStatus,
  setFailedServiceChargeId,
  setFormData,
  setExhibition,
  setSubmitting,
  form,
  navigate
}: UsePaymentHandlerProps) => {

  // Payment processing function
  const handlePayment = async () => {
    console.log('🚀 [PAYMENT FLOW] ===== STARTING PAYMENT PROCESS =====');
    console.log('🚀 [PAYMENT FLOW] Exhibition ID:', exhibitionId);
    console.log('🚀 [PAYMENT FLOW] Form Data:', formData);
    console.log('🚀 [PAYMENT FLOW] Selected Stall:', selectedStall);
    
    try {
      setSubmitting(true);
      
      // ✅ CRITICAL FIX: Clear failed payment state when starting new payment
      setFailedServiceChargeId(null);
      setPaymentStatus('idle');
      
      const serviceChargeAmount = calculateServiceCharge(exhibition, stalls, selectedStall, formData);
      
      if (!serviceChargeAmount) {
        message.error('Unable to calculate service charge. Please try again.');
        return;
      }

      // Prepare payment data for both new and legacy systems
      const paymentData: PaymentData = {
        exhibitionId: exhibition?._id || '',
        vendorName: formData.vendorName,
        vendorPhone: formData.vendorPhone,
        companyName: formData.companyName,
        exhibitorCompanyName: formData.exhibitorCompanyName || '',
        stallNumber: formData.stallNumber,
        stallArea: selectedStall?.stallArea || formData.stallArea || 0,
        serviceType: formData.serviceType || 'Stall Service Charge',
        amount: serviceChargeAmount.toString(),
        uploadedImage: formData.uploadedImage || ''
      };

      console.log('💰 [PAYMENT FLOW] Payment data structure:', {
        ...paymentData,
        isStallBased: !!(selectedStall || formData.stallArea),
        calculatedAmount: serviceChargeAmount
      });

      console.log('📡 [PAYMENT FLOW] Creating PhonePe payment order...');
      console.log('📡 [PAYMENT FLOW] API Endpoint: /api/public/service-charge/create-order');
      console.log('📡 [PAYMENT FLOW] Payload:', JSON.stringify(paymentData, null, 2));
      
      const orderResponse = await publicServiceChargeService.createPaymentOrder(paymentData);
      
      console.log('📡 [PAYMENT FLOW] API Response received:', orderResponse);
      console.log('📡 [PAYMENT FLOW] Response Status:', orderResponse.status);
      console.log('📡 [PAYMENT FLOW] Response Data:', JSON.stringify(orderResponse.data, null, 2));
      
      if (orderResponse.data.success) {
        const orderData = orderResponse.data;
        console.log('✅ [PAYMENT FLOW] PhonePe order created successfully!');
        
        // PhonePe redirects to payment page
        if (orderData.data.redirectUrl) {
          console.log('🔄 [PAYMENT FLOW] Service Charge ID:', orderData.data.serviceChargeId);
          console.log('🔄 [PAYMENT FLOW] Receipt Number:', orderData.data.receiptNumber);
          console.log('🔄 [PAYMENT FLOW] PhonePe Order ID:', orderData.data.orderId);
          console.log('🔄 [PAYMENT FLOW] Redirect URL:', orderData.data.redirectUrl);
          console.log('🔄 [PAYMENT FLOW] ===== REDIRECTING TO PHONEPE =====');
          window.location.href = orderData.data.redirectUrl;
        } else {
          console.error('❌ [PAYMENT FLOW] PhonePe redirect URL not received!');
          console.error('❌ [PAYMENT FLOW] Order data:', orderData);
          throw new Error('PhonePe redirect URL not received');
        }
      } else {
        throw new Error(orderResponse.data.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('[Payment] Error creating payment order:', error);
      message.error('Failed to initiate payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Restore form data from service charge
  const restoreFormData = async (serviceChargeData?: any) => {
    try {
      console.log('[Payment Redirect] Restoring form data from service charge');
      
      const urlParams = new URLSearchParams(location.search);
      const serviceChargeId = urlParams.get('serviceChargeId');
      
      if (!serviceChargeId) {
        console.error('[Payment Redirect] No service charge ID found for form restoration');
        return;
      }
      
      const result = await restoreFormDataFromServiceCharge(serviceChargeId);
      
      if (result.success && result.data) {
        const { formData: restoredFormData, serviceCharge } = result.data;
        
        // ✅ CRITICAL FIX: Preserve existing originalAmount when restoring data
        setFormData((prevFormData: any) => ({
          ...restoredFormData,
          originalAmount: prevFormData.originalAmount || restoredFormData.originalAmount // Preserve existing originalAmount
        }));
        
        // ✅ CRITICAL FIX: Restore stall selection if stallNumber exists
        if (restoredFormData.stallNumber && stalls.length > 0) {
          const stall = stalls.find(s => s.stallNumber === restoredFormData.stallNumber);
          if (stall) {
            console.log('[Payment Redirect] Restoring stall selection:', stall.stallNumber);
            // This will be handled by the stall selection handler
            // setSelectedStall(stall); // Don't call directly, let the hook handle it
          }
        }
        
        // Restore exhibition config if not already loaded
        if (!exhibition && serviceCharge.exhibitionId) {
          const exhibitionId = typeof serviceCharge.exhibitionId === 'string' 
            ? serviceCharge.exhibitionId 
            : serviceCharge.exhibitionId._id || serviceCharge.exhibitionId.id;
          
          console.log('[Payment Redirect] Loading exhibition config for restored form:', exhibitionId);
          
          try {
            const exhibitionResponse = await publicServiceChargeService.getServiceChargeConfig(exhibitionId);
            if (exhibitionResponse.data.success) {
              setExhibition(exhibitionResponse.data.data);
              console.log('[Payment Redirect] Exhibition config loaded for restored form');
            }
          } catch (exhibitionError) {
            console.error('[Payment Redirect] Failed to load exhibition config for restored form:', exhibitionError);
          }
        }
        
        // Update the form fields with restored data
        form.setFieldsValue(restoredFormData);
        
        console.log('[Payment Redirect] Form data restoration completed');
      }
    } catch (error) {
      console.error('[Payment Redirect] Error restoring form data:', error);
    }
  };

  // Handle payment redirect
  const handlePaymentRedirect = async () => {
    console.log('🔄 [PAYMENT REDIRECT] ===== PAYMENT REDIRECT STARTED =====');
    console.log('🔄 [PAYMENT REDIRECT] URL:', window.location.href);
    console.log('🔄 [PAYMENT REDIRECT] Pathname:', location.pathname);
    console.log('🔄 [PAYMENT REDIRECT] Search params:', location.search);
    
    // Prevent multiple verification attempts
    if (verificationInProgress || paymentVerified) {
      console.log('⚠️ [PAYMENT REDIRECT] Verification already in progress or completed, skipping', {
        verificationInProgress,
        paymentVerified
      });
      return;
    }

    // ✅ ADDITIONAL SAFEGUARD: Double-check we have serviceChargeId in URL
    const urlParams = new URLSearchParams(location.search);
    const serviceChargeId = urlParams.get('serviceChargeId');
    
    if (!serviceChargeId) {
      console.log('[Payment Redirect] No service charge ID in URL - likely after cancel operation, aborting redirect');
      return;
    }

    try {
      setVerificationInProgress(true);
      
      // Note: serviceChargeId already extracted above for safeguard check
      const gateway = urlParams.get('gateway');
      
      console.log('🔍 [PAYMENT REDIRECT] Starting payment verification:', {
        serviceChargeId,
        gateway,
        currentPath: location.pathname,
        allUrlParams: Object.fromEntries(urlParams.entries())
      });
      
      console.log('📡 [PAYMENT REDIRECT] Fetching service charge status...');
      console.log('📡 [PAYMENT REDIRECT] API Endpoint: /api/public/service-charge/status/' + serviceChargeId);
      
      if (!serviceChargeId) {
        console.error('[Payment Redirect] Missing service charge ID');
        message.error('Payment verification failed: Missing service charge ID');
        setPaymentStatus('idle');
        navigate('/');
        return;
      }

      setLoading(true);
      
      // Get service charge details using the service method
      const statusResponse = await publicServiceChargeService.getServiceChargeStatus(serviceChargeId);
      
      if (!statusResponse.data.success) {
        console.error('[Payment Redirect] Status fetch failed:', statusResponse.data);
        throw new Error(statusResponse.data.message || 'Failed to get service charge details');
      }

      const serviceCharge = statusResponse.data.data;
      
      // Ensure we have exhibition config loaded
      if (!exhibition && serviceCharge.exhibitionId) {
        try {
          // Handle both string ID and populated object
          const exhibitionId = typeof serviceCharge.exhibitionId === 'string' 
            ? serviceCharge.exhibitionId 
            : serviceCharge.exhibitionId._id || serviceCharge.exhibitionId.id;
          
          console.log('[Payment Redirect] Loading exhibition config for ID:', exhibitionId);
          
          const exhibitionResponse = await publicServiceChargeService.getServiceChargeConfig(exhibitionId);
          if (exhibitionResponse.data.success) {
            setExhibition(exhibitionResponse.data.data);
            console.log('[Payment Redirect] Exhibition config loaded successfully');
          }
        } catch (configError) {
          console.warn('[Payment Redirect] Failed to load exhibition config:', configError);
        }
      }
      
      // Check if payment is already verified
      if (serviceCharge.paymentStatus === 'paid') {
        console.log('[Payment Redirect] Payment already verified, showing success');
        // Ensure we have all the required data for the success step
        const paymentData = {
          serviceChargeId: serviceCharge._id || serviceCharge.id,
          receiptNumber: serviceCharge.receiptNumber,
          paymentId: serviceCharge.phonePeTransactionId || serviceCharge.paymentId,
          amount: serviceCharge.amount,
          paidAt: serviceCharge.paidAt,
          receiptGenerated: serviceCharge.receiptGenerated,
          receiptDownloadUrl: serviceCharge.receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id || serviceCharge.id}` : undefined
        };
        
        setPaymentResult(paymentData);
        setCurrentStep(2);
        setPaymentVerified(true); // Mark payment as verified to prevent re-verification
        setPaymentStatus('idle');
        setLoading(false); // Stop loading immediately when payment is verified
        return;
      }

      // ✅ CRITICAL FIX: Handle failed payments - don't try to verify, allow retry
      if (serviceCharge.paymentStatus === 'failed') {
        console.log('[Payment Redirect] Payment already failed, allowing retry');
        
        // Preserve any existing originalAmount before restoration
        const currentOriginalAmount = formData.originalAmount;
        console.log('[Payment Redirect] Preserving originalAmount for failed payment:', currentOriginalAmount);
        
        // Restore form data for retry
        await restoreFormData(serviceCharge);
        
        // Ensure originalAmount is preserved
        setFormData((prev: any) => ({
          ...prev,
          originalAmount: currentOriginalAmount || Number(serviceCharge.amount)
        }));
        
        // Set up for retry
        setPaymentStatus('failed');
        setFailedServiceChargeId(serviceCharge._id);
        setCurrentStep(1); // Stay on payment step
        setLoading(false);
        setVerificationInProgress(false);
        
        // Clear any messages
        message.destroy();
        
        return; // ✅ Exit early - no verification needed
      }

      // Handle PhonePe payment verification
      if (gateway === 'phonepe') {
        console.log('📱 [PHONEPE VERIFICATION] Processing PhonePe payment verification');
        console.log('📱 [PHONEPE VERIFICATION] Service Charge Data:', {
          id: serviceCharge._id,
          receiptNumber: serviceCharge.receiptNumber,
          phonePeMerchantTransactionId: serviceCharge.phonePeMerchantTransactionId,
          paymentStatus: serviceCharge.paymentStatus,
          status: serviceCharge.status,
          amount: serviceCharge.amount
        });
        
        let merchantTransactionId = serviceCharge.phonePeMerchantTransactionId || serviceCharge.receiptNumber;
        
        if (!merchantTransactionId) {
          console.error('❌ [PHONEPE VERIFICATION] Missing PhonePe merchant transaction ID');
          console.error('❌ [PHONEPE VERIFICATION] Service charge data:', serviceCharge);
          message.error('Payment verification failed: Missing PhonePe transaction details');
          setCurrentStep(1);
          return;
        }
        
        console.log('📱 [PHONEPE VERIFICATION] Using merchant transaction ID:', merchantTransactionId);
        console.log('📡 [PHONEPE VERIFICATION] Calling PhonePe verification API...');
        // Only show loading message if no other loading message is active
        message.destroy(); // Clear any existing messages first
        message.loading('Verifying payment with PhonePe...', 0);
        
        // Store service charge data for use in retry
        await restoreFormData(serviceCharge);

        // Verify payment with retry
        const result = await verifyPaymentWithRetry(merchantTransactionId);
        
        if (result.success && result.data) {
          console.log('[Payment Verification] PhonePe payment verified successfully');
          
          message.destroy();
          setPaymentResult(result.data);
          setCurrentStep(2);
          setPaymentVerified(true);
          setPaymentStatus('idle');
          setLoading(false);
        } else {
          console.error('[Payment Verification] PhonePe payment verification failed:', result.error);
          
          message.destroy();
          
          // Store the original payment amount BEFORE restoring data to prevent overwrite
          const currentOriginalAmount = formData.originalAmount;
          console.log('[Payment Verification] Preserving originalAmount:', currentOriginalAmount, 'Service charge amount:', serviceCharge.amount);
          
          // ✅ CRITICAL FIX: Ensure all form data is restored properly for retry
          await restoreFormData(serviceCharge);
          
          // Preserve the originalAmount that was already set (don't overwrite it)
          setFormData((prev: any) => ({
            ...prev,
            stallArea: serviceCharge.stallArea || prev.stallArea || 0, // ✅ Ensure stallArea is preserved
            originalAmount: currentOriginalAmount || Number(serviceCharge.amount) // ✅ Preserve existing originalAmount
          }));
          
          // Set payment status to failed instead of redirecting to error page
          setPaymentStatus('failed');
          setFailedServiceChargeId(serviceCharge._id);
          setLoading(false);
          setVerificationInProgress(false);
          
          // Clear any error notifications with setTimeout to avoid React batching issues
          setTimeout(() => message.destroy(), 0);
          
          // Stay on payment step (1) and show the failure UI
          setCurrentStep(1);
        }
      }
    } catch (error: any) {
      console.error('[Payment Redirect] Error:', error);
      
      // Check if it's a 404 error (service charge not found)
      if (error.response?.status === 404 || error.message?.includes('404')) {
        message.destroy();
        // Using setTimeout to ensure message is shown after any other messages are cleared
        setTimeout(() => {
          message.error('Payment record not found. Please contact support if you completed the payment.');
        }, 100);
        setCurrentStep(0); // Go back to first step
        navigate('/');
      } else if (error.response?.status === 400) {
        // ✅ CRITICAL FIX: 400 error means payment verification failed - allow retry
        console.log('[Payment Redirect] 400 error - payment verification failed, allowing retry');
        message.destroy();
        
        // Try to restore form data if we have serviceChargeId
        const urlParams = new URLSearchParams(location.search);
        const serviceChargeId = urlParams.get('serviceChargeId');
        if (serviceChargeId) {
          try {
            // Preserve existing originalAmount before restoration
            const currentOriginalAmount = formData.originalAmount;
            console.log('[Payment Redirect] Preserving originalAmount for 400 error:', currentOriginalAmount);
            
            const statusResponse = await publicServiceChargeService.getServiceChargeStatus(serviceChargeId);
            if (statusResponse.data.success) {
              await restoreFormData(statusResponse.data.data);
              setFailedServiceChargeId(serviceChargeId);
              
              // Ensure originalAmount is preserved after restoration
              setFormData((prev: any) => ({
                ...prev,
                originalAmount: currentOriginalAmount || Number(statusResponse.data.data.amount)
              }));
            }
          } catch (restoreError) {
            console.warn('[Payment Redirect] Failed to restore data after 400 error:', restoreError);
          }
        }
        
        setPaymentStatus('failed');
        setCurrentStep(1); // Stay on payment step
      } else {
        // For other errors, set failed status and don't show a message
        message.destroy();
        setPaymentStatus('failed');
        setCurrentStep(1);
      }
    } finally {
      setLoading(false);
      setVerificationInProgress(false);
    }
  };

  // Check if we're on payment result page
  const isPaymentResult = isPaymentResultPage(location.pathname, location.search);

  // Handle payment redirect effect
  useEffect(() => {
    console.log('[Payment Redirect] useEffect triggered:', {
      isPaymentResult,
      pathname: location.pathname,
      search: location.search,
      exhibitionId,
      currentStep
    });
    
    // Clear any existing messages before payment verification
    message.destroy();
    
    // ✅ CRITICAL FIX: Only handle payment redirect if we're actually on a payment result URL with parameters
    // Prevent redirect handling after user cancels (when only pathname matches but no query params)
    const hasServiceChargeId = location.search.includes('serviceChargeId=');
    
    if (isPaymentResult && hasServiceChargeId) {
      // Handle payment redirect (but not if we're already in success step or payment is verified)
      if (currentStep !== 2 && !paymentVerified) {
        console.log('[Payment Redirect] Handling payment redirect with service charge ID');
        handlePaymentRedirect();
      } else {
        console.log('[Payment Redirect] Already in success step or payment verified, skipping redirect handling', {
          currentStep,
          paymentVerified
        });
      }
    } else if (isPaymentResult && !hasServiceChargeId) {
      console.log('[Payment Redirect] On payment result page but no service charge ID - likely after cancel, skipping redirect');
    }
  }, [exhibitionId, isPaymentResult, currentStep, paymentVerified, location.search]);

  return {
    handlePayment,
    handlePaymentRedirect,
    restoreFormData,
    isPaymentResult
  };
}; 