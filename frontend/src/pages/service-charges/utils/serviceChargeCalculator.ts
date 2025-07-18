import { ExhibitionConfig, ServiceChargeStall, FormData } from '../types';

/**
 * Calculate service charge amount based on stall area or service type
 */
export const calculateServiceCharge = (
  exhibition: ExhibitionConfig | null,
  stalls: ServiceChargeStall[],
  selectedStall: ServiceChargeStall | null,
  formData: FormData
): number => {
  // ✅ CRITICAL FIX: Use original amount for payment retry scenarios
  if (formData.originalAmount && formData.originalAmount > 0) {
    console.log('[Service Charge Calculator] Using original amount for retry:', formData.originalAmount, 'Full formData:', {
      stallArea: formData.stallArea,
      stallNumber: formData.stallNumber,
      hasOriginalAmount: !!formData.originalAmount
    });
    return formData.originalAmount;
  }
  
  if (!exhibition?.config) return 0;

  // New stall-based pricing system - use actual pricing rules from exhibition settings
  if (stalls.length > 0 && (selectedStall || formData.stallArea)) {
    const stallArea = selectedStall?.stallArea || formData.stallArea || 0;
    
    console.log('[Service Charge Calculator] Stall-based calculation:', {
      stallsLength: stalls.length,
      selectedStall: selectedStall?.stallNumber,
      formDataStallArea: formData.stallArea,
      calculatedStallArea: stallArea,
      exhibitionConfig: !!exhibition?.config,
      pricingRules: exhibition?.config?.pricingRules
    });
    
    // Use pricing rules from exhibition configuration
    const pricingRules = exhibition.config.pricingRules;
    if (pricingRules) {
      const threshold = pricingRules.smallStallThreshold || 50;
      const smallPrice = pricingRules.smallStallPrice || 2000;
      const largePrice = pricingRules.largeStallPrice || 2500;
      
      const calculatedAmount = stallArea <= threshold ? smallPrice : largePrice;
      console.log('[Service Charge Calculator] Calculated amount:', calculatedAmount, 'for stallArea:', stallArea);
      return calculatedAmount;
    } else {
      // Fallback to default pricing if no rules configured
      const fallbackAmount = stallArea <= 50 ? 2000 : 2500;
      console.log('[Service Charge Calculator] Using fallback pricing:', fallbackAmount);
      return fallbackAmount;
    }
  }

  // Legacy service type system
  if (exhibition.config.serviceTypes && formData.serviceType) {
    const selectedService = exhibition.config.serviceTypes.find(
      service => service.type === formData.serviceType
    );
    return selectedService ? selectedService.amount : 0;
  }

  // ✅ WARNING: This should rarely happen - log for debugging
  console.warn('[Service Charge Calculator] Returning 0 - this may indicate a configuration issue:', {
    hasExhibition: !!exhibition,
    hasConfig: !!exhibition?.config,
    stallsLength: stalls.length,
    hasSelectedStall: !!selectedStall,
    formDataStallArea: formData.stallArea,
    formDataServiceType: formData.serviceType,
    formDataOriginalAmount: formData.originalAmount,
    serviceTypes: exhibition?.config?.serviceTypes?.length || 0
  });
  
  return 0;
};

/**
 * Format dimensions string for display
 */
export const formatDimensions = (dimensions?: { width: number; height: number }): string => {
  if (!dimensions) return 'Not specified';
  return `${dimensions.width}m × ${dimensions.height}m`;
};

/**
 * Get pricing info text for display
 */
export const getPricingInfo = (exhibition: ExhibitionConfig | null) => {
  if (!exhibition?.config?.pricingRules) {
    return {
      threshold: 50,
      smallPrice: 2000,
      largePrice: 2500
    };
  }

  const pricingRules = exhibition.config.pricingRules;
  return {
    threshold: pricingRules.smallStallThreshold || 50,
    smallPrice: pricingRules.smallStallPrice || 2000,
    largePrice: pricingRules.largeStallPrice || 2500
  };
};

/**
 * Check if exhibition is in development mode
 */
export const isDevelopmentMode = (exhibition: ExhibitionConfig | null): boolean => {
  return exhibition?.config.phonePeConfig?.clientId === 'phonepe_test_development_mode';
}; 