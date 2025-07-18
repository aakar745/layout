import { message } from 'antd';
import publicServiceChargeService from '../../../services/publicServiceCharge';
import { PaymentResult, FormData } from '../types';

/**
 * Verify PhonePe payment with retry mechanism
 */
export const verifyPaymentWithRetry = async (
  merchantTransactionId: string,
  maxRetries = 3,
  retryDelay = 2000
): Promise<{ success: boolean; data?: PaymentResult; error?: string }> => {
  const verifyPayment = async (retryCount = 0): Promise<{ success: boolean; data?: PaymentResult; error?: string }> => {
    try {
      console.log(`[Payment Verification] Attempt ${retryCount + 1}/${maxRetries + 1} for merchant ID:`, merchantTransactionId);
      
      const verifyResponse = await publicServiceChargeService.verifyPhonePePayment({
        merchantTransactionId: merchantTransactionId
      });

      console.log('[Payment Verification] Full response:', verifyResponse);
      console.log('[Payment Verification] Response data:', verifyResponse.data);
      console.log('[Payment Verification] Response success:', verifyResponse.data?.success);
      
      // Check if verification was successful
      if (verifyResponse.data && verifyResponse.data.success) {
        console.log('[Payment Verification] PhonePe payment verified successfully');
        console.log('[Payment Verification] Payment result data:', verifyResponse.data.data);
        
        return { success: true, data: verifyResponse.data.data };
      } 
      
      // Check if payment is still pending (might need retry)
      const state = verifyResponse.data?.data?.state;
      const isPending = state === 'PENDING' || state === 'PROCESSING';
      
      if (isPending && retryCount < maxRetries) {
        console.log(`[Payment Verification] Payment still pending (${state}), retrying in ${retryDelay}ms...`);
        message.destroy();
        message.loading(`Payment is being processed... (Attempt ${retryCount + 2}/${maxRetries + 1})`, 0);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return verifyPayment(retryCount + 1);
      }
      
      // Payment failed or max retries reached
      console.error('[Payment Verification] PhonePe payment verification failed:', {
        response: verifyResponse.data,
        state,
        retryCount,
        maxRetries
      });
      
      return { success: false, error: 'Payment verification failed' };
      
    } catch (verifyError: any) {
      console.error(`[Payment Verification] Error on attempt ${retryCount + 1}:`, verifyError);
      
      // If it's a network error and we haven't exhausted retries
      if (retryCount < maxRetries && (verifyError.code === 'NETWORK_ERROR' || verifyError.message?.includes('fetch'))) {
        console.log(`[Payment Verification] Network error, retrying in ${retryDelay}ms...`);
        message.destroy();
        message.loading(`Connection error, retrying... (Attempt ${retryCount + 2}/${maxRetries + 1})`, 0);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return verifyPayment(retryCount + 1);
      }
      
      // Final error - no more retries
      return { success: false, error: verifyError.message || 'Payment verification failed' };
    }
  };

  return verifyPayment();
};

/**
 * Restore form data from service charge record
 */
export const restoreFormDataFromServiceCharge = async (
  serviceChargeId: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    console.log('[Payment Redirect] Restoring form data from service charge');
    
    if (!serviceChargeId) {
      console.error('[Payment Redirect] No service charge ID found for form restoration');
      return { success: false, error: 'No service charge ID found' };
    }
    
    // Fetch the service charge details
    const statusResponse = await publicServiceChargeService.getServiceChargeStatus(serviceChargeId);
    
    if (statusResponse.data.success) {
      const serviceCharge = statusResponse.data.data;
      
      console.log('[Payment Redirect] Service charge data retrieved for form restoration:', serviceCharge);
      
      // Restore form data from service charge record
      const restoredFormData = {
        vendorName: serviceCharge.vendorName || '',
        companyName: serviceCharge.companyName || '',
        exhibitorCompanyName: serviceCharge.exhibitorCompanyName || '',
        vendorPhone: serviceCharge.vendorPhone || '',
        stallNumber: serviceCharge.stallNumber || '',
        stallArea: serviceCharge.stallArea || 0, // ✅ CRITICAL FIX: Include stallArea for amount calculation
        serviceType: serviceCharge.serviceType || '',
        uploadedImage: serviceCharge.uploadedImage || '', // ✅ Also restore uploaded image
        originalAmount: serviceCharge.amount ? Number(serviceCharge.amount) : undefined, // ✅ Include originalAmount for retry scenarios
      };
      
      console.log('[Payment Redirect] Form data restoration completed');
      return { success: true, data: { formData: restoredFormData, serviceCharge } };
    } else {
      console.error('[Payment Redirect] Failed to fetch service charge for form restoration');
      return { success: false, error: 'Failed to fetch service charge' };
    }
  } catch (error: any) {
    console.error('[Payment Redirect] Error restoring form data:', error);
    return { success: false, error: error.message || 'Error restoring form data' };
  }
};

/**
 * Check if we're on a payment result page with valid parameters
 * ✅ Enhanced to prevent false positives after cancel operations
 */
export const isPaymentResultPage = (pathname: string, search: string): boolean => {
  const isPaymentResultPath = pathname === '/service-charge/payment-result' || 
                              pathname === '/service-charge/payment-success';
  
  const hasServiceChargeId = search.includes('serviceChargeId=');
  
  // Only consider it a payment result page if we have both the right path AND serviceChargeId
  // This prevents false triggering after cancel operations
  return isPaymentResultPath && hasServiceChargeId;
}; 