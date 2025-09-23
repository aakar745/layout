'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export interface ServiceChargeConflictError {
  message: string;
  conflictType?: 'duplicate_payment' | 'concurrent_request' | 'stall_unavailable';
  action?: string;
}

export interface UseAtomicServiceChargeOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  debounceMs?: number;
  cooldownMs?: number;
  maxRetries?: number;
}

export interface UseAtomicServiceChargeReturn {
  executeOperation: (operationFn: () => Promise<any>) => Promise<void>;
  isProcessing: boolean;
  isInCooldown: boolean;
  isDisabled: boolean;
  attemptCount: number;
  getStatusMessage: () => string;
  reset: () => void;
  canRetry: boolean;
  shouldShowCooldown: boolean;
  remainingCooldownMs: number;
}

/**
 * Custom hook for handling atomic service charge operations with race condition protection
 * 
 * Features:
 * - Debouncing to prevent rapid-fire clicks/form submissions
 * - Cooldown period after failed attempts
 * - Request cancellation with AbortController
 * - Duplicate payment prevention
 * - Optimistic UI updates
 * - Comprehensive error handling for payment conflicts
 * - Support for high-concurrency scenarios
 */
const useAtomicServiceCharge = (options: UseAtomicServiceChargeOptions = {}): UseAtomicServiceChargeReturn => {
  const {
    onSuccess,
    onError,
    debounceMs = 1000, // 1 second debounce for payments (longer than booking)
    cooldownMs = 3000, // 3 second cooldown after failures
    maxRetries = 3
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Refs for debouncing, cleanup, and request cancellation
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const operationIdRef = useRef<string | null>(null);

  /**
   * Clear all timeouts and abort ongoing requests
   */
  const cleanup = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    operationIdRef.current = null;
  }, []);

  /**
   * Start cooldown period to prevent rapid retries
   */
  const startCooldown = useCallback(() => {
    setIsInCooldown(true);
    
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }
    
    cooldownTimeoutRef.current = setTimeout(() => {
      setIsInCooldown(false);
      setAttemptCount(0); // Reset attempt count after cooldown
      cooldownTimeoutRef.current = null;
    }, cooldownMs);
  }, [cooldownMs]);

  /**
   * Handle service charge operation errors with user-friendly messaging
   */
  const handleOperationError = useCallback((error: any) => {
    console.error('🚨 [ATOMIC SERVICE CHARGE] Operation failed:', error);
    
    setAttemptCount(prev => prev + 1);

    // Handle different types of errors
    const isDuplicatePaymentError = error.response?.status === 409 || 
                                  error.message?.includes('already paid') ||
                                  error.message?.includes('duplicate payment') ||
                                  error.response?.data?.message?.includes('already paid');
    
    const isConcurrentError = error.message?.includes('concurrent') ||
                            error.message?.includes('too many requests') ||
                            error.response?.status === 429;
    
    const isValidationError = error.response?.status === 400;
    const isAuthError = error.response?.status === 401;
    const isServerError = error.response?.status >= 500;

    if (isDuplicatePaymentError) {
      // Duplicate payment error
      const conflictError: ServiceChargeConflictError = error.response?.data || {};
      
      toast.error('This service charge has already been paid. Please check your payment status or refresh the page.', {
        duration: 6000,
      });
      
      if (onError) {
        onError({
          type: 'duplicate_payment',
          ...conflictError
        });
      }
      
    } else if (isConcurrentError) {
      // Concurrent request error
      toast.error('Multiple payment requests detected. Please wait a moment and try again.', {
        duration: 4000,
      });
      
      // Force cooldown for concurrent errors
      startCooldown();
      
    } else if (isValidationError) {
      // Validation error
      toast.error(error.response?.data?.message || 'Invalid payment data. Please check your form data and try again.', {
        duration: 4000,
      });
      
    } else if (isAuthError) {
      // Authentication error (shouldn't happen in public view, but handle gracefully)
      toast.error('Session expired. Please refresh the page and try again.', {
        duration: 4000,
      });
      
    } else if (isServerError) {
      // Server error
      toast.error('Payment gateway is temporarily unavailable. Please try again in a few moments.', {
        duration: 5000,
      });
      
    } else {
      // Network or unknown error
      toast.error('Unable to process payment due to network issues. Please check your connection and try again.', {
        duration: 4000,
      });
    }

    // Start cooldown if too many failures
    if (attemptCount >= maxRetries - 1) {
      startCooldown();
      toast.warning(`Too many attempts. Please wait ${cooldownMs / 1000} seconds before trying again.`, {
        duration: 3000,
      });
    }

    if (onError) {
      onError(error);
    }
  }, [attemptCount, onError, startCooldown, cooldownMs, maxRetries]);

  /**
   * Main operation function with debouncing and race condition protection
   */
  const executeOperation = useCallback(async (operationFn: () => Promise<any>) => {
    const now = Date.now();
    const operationId = `op_${now}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prevent rapid clicks (debouncing)
    if (now - lastAttempt < debounceMs && debounceTimeoutRef.current) {
      console.log('🛑 [ATOMIC SERVICE CHARGE] Debouncing - ignoring rapid click');
      return;
    }

    // Check if in cooldown period
    if (isInCooldown) {
      toast.warning('Please wait before trying again.', {
        duration: 2000,
      });
      return;
    }

    // Check if already processing
    if (isProcessing) {
      console.log('🛑 [ATOMIC SERVICE CHARGE] Already processing - ignoring click');
      toast.info('Payment is already being processed. Please wait.', {
        duration: 2000,
      });
      return;
    }

    setLastAttempt(now);
    operationIdRef.current = operationId;

    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    // Debounce the actual operation execution
    debounceTimeoutRef.current = setTimeout(async () => {
      // Double-check we're still the current operation (prevent race conditions)
      if (operationIdRef.current !== operationId) {
        console.log('🛑 [ATOMIC SERVICE CHARGE] Operation superseded - cancelling');
        return;
      }

      try {
        setIsProcessing(true);
        
        // Create abort controller for this request
        abortControllerRef.current = new AbortController();
        
        console.log('💳 [ATOMIC SERVICE CHARGE] Executing payment operation...', operationId);
        
        // Show optimistic loading message
        const loadingToast = toast.loading('Processing your payment...', {
          duration: Infinity,
        });

        // Execute the operation function
        const result = await operationFn();
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        // Show success message
        toast.success('Payment successful! Your service charge payment has been processed successfully.', {
          duration: 4000,
        });
        
        // Reset attempt count on success
        setAttemptCount(0);
        
        console.log('✅ [ATOMIC SERVICE CHARGE] Operation completed successfully', operationId);
        
        if (onSuccess) {
          onSuccess(result);
        }
        
      } catch (error) {
        // Dismiss any loading toast
        toast.dismiss();
        
        // Only handle error if this is still the current operation
        if (operationIdRef.current === operationId) {
          handleOperationError(error);
        }
      } finally {
        // Only clean up if this is still the current operation
        if (operationIdRef.current === operationId) {
          setIsProcessing(false);
          abortControllerRef.current = null;
          debounceTimeoutRef.current = null;
          operationIdRef.current = null;
        }
      }
    }, debounceMs);

  }, [isProcessing, isInCooldown, lastAttempt, debounceMs, onSuccess, handleOperationError]);

  /**
   * Reset all states (useful when component unmounts or needs reset)
   */
  const reset = useCallback(() => {
    cleanup();
    setIsProcessing(false);
    setIsInCooldown(false);
    setAttemptCount(0);
    setLastAttempt(0);
  }, [cleanup]);

  /**
   * Check if operation should be disabled
   */
  const isDisabled = isProcessing || isInCooldown || attemptCount >= maxRetries;

  /**
   * Get current status message for UI feedback
   */
  const getStatusMessage = useCallback(() => {
    if (isProcessing) return 'Processing payment...';
    if (isInCooldown) return `Please wait ${Math.ceil(cooldownMs / 1000)} seconds`;
    if (attemptCount > 0 && attemptCount < maxRetries) return `Retry attempt ${attemptCount + 1}`;
    if (attemptCount >= maxRetries) return 'Maximum attempts reached';
    return '';
  }, [isProcessing, isInCooldown, attemptCount, cooldownMs, maxRetries]);

  /**
   * Calculate remaining cooldown time
   */
  const remainingCooldownMs = isInCooldown ? cooldownMs : 0;

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    executeOperation,
    isProcessing,
    isInCooldown,
    isDisabled,
    attemptCount,
    getStatusMessage,
    reset,
    
    // Additional state for UI feedback
    canRetry: !isDisabled && attemptCount > 0 && attemptCount < maxRetries,
    shouldShowCooldown: isInCooldown,
    remainingCooldownMs
  } as const;
};

export { useAtomicServiceCharge };
export default useAtomicServiceCharge;
