import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  BookingStep, 
  BookingFormData, 
  BookingSummary, 
  PaymentData, 
  FormErrors,
  CustomerInfo,
  BookingValidation
} from '@/lib/types/booking';
import { Stall } from '@/lib/types/layout';

interface BookingState {
  // Current booking data
  exhibitionId: string | null;
  selectedStalls: Stall[];
  formData: BookingFormData;
  summary: BookingSummary | null;
  
  // UI State
  currentStep: number;
  steps: BookingStep[];
  isLoading: boolean;
  errors: FormErrors;
  
  // Payment
  paymentData: PaymentData | null;
  
  // Actions
  initializeBooking: (exhibitionId: string, stalls: Stall[]) => void;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<BookingFormData>) => void;
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  toggleAmenity: (amenityId: string) => void;
  validateStep: (step: number) => BookingValidation[];
  calculateSummary: () => void;
  setLoading: (loading: boolean) => void;
  setErrors: (errors: FormErrors) => void;
  clearErrors: () => void;
  setPaymentData: (payment: PaymentData) => void;
  resetBooking: () => void;
  
  // Stall management
  removeStall: (stallId: string) => void;
  clearSelection: () => void;
  
  // Navigation
  canProceedToStep: (step: number) => boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const initialSteps: BookingStep[] = [
  {
    id: 'review',
    title: 'Review Selection',
    description: 'Review your booking details',
    isComplete: false,
    isActive: true
  },
  {
    id: 'amenities',
    title: 'Add-on Services',
    description: 'Select additional amenities',
    isComplete: false,
    isActive: false
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Complete your booking',
    isComplete: false,
    isActive: false
  }
];

const initialFormData: BookingFormData = {
  step: 0,
  customerInfo: {},
  selectedAmenities: [],
  notes: '',
  termsAccepted: false,
  marketingConsent: false
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      exhibitionId: null,
      selectedStalls: [],
      formData: initialFormData,
      summary: null,
      currentStep: 0,
      steps: initialSteps,
      isLoading: false,
      errors: {},
      paymentData: null,

      // Initialize booking with stalls
      initializeBooking: (exhibitionId, stalls) => {
        set({
          exhibitionId,
          selectedStalls: stalls,
          currentStep: 0,
          steps: initialSteps.map((step, index) => ({
            ...step,
            isActive: index === 0,
            isComplete: false
          })),
          formData: initialFormData,
          errors: {},
          paymentData: null
        });
        
        // Calculate initial summary
        get().calculateSummary();
      },

      // Step navigation
      setCurrentStep: (step) => {
        set(state => ({
          currentStep: step,
          steps: state.steps.map((s, index) => ({
            ...s,
            isActive: index === step,
            isComplete: index < step
          }))
        }));
      },

      // Form data updates
      updateFormData: (data) => {
        set(state => ({
          formData: { ...state.formData, ...data }
        }));
      },

      updateCustomerInfo: (info) => {
        set(state => ({
          formData: {
            ...state.formData,
            customerInfo: { ...state.formData.customerInfo, ...info }
          }
        }));
      },

      toggleAmenity: (amenityId) => {
        set(state => {
          const amenities = state.formData.selectedAmenities;
          const newAmenities = amenities.includes(amenityId)
            ? amenities.filter(id => id !== amenityId)
            : [...amenities, amenityId];
          
          return {
            formData: {
              ...state.formData,
              selectedAmenities: newAmenities
            }
          };
        });
        
        // Recalculate summary when amenities change
        get().calculateSummary();
      },

      // Validation
      validateStep: (step) => {
        const { formData, selectedStalls } = get();
        const validations: BookingValidation[] = [];

        switch (step) {
          case 0: // Review step
            if (!selectedStalls || selectedStalls.length === 0) {
              validations.push({
                field: 'stalls',
                message: 'At least one stall must be selected',
                isValid: false
              });
            }
            break;
            
          case 1: // Amenities step (no required validation - amenities are optional)
            // Amenities are optional, so no validation required
            break;
            
          case 2: // Payment step
            if (!formData.termsAccepted) {
              validations.push({
                field: 'termsAccepted',
                message: 'Please accept the terms and conditions',
                isValid: false
              });
            }
            break;
        }

        return validations;
      },

      // Calculate booking summary
      calculateSummary: () => {
        const { selectedStalls, formData } = get();
        
        const stallsTotal = selectedStalls.reduce((sum, stall) => sum + stall.price, 0);
        
        // Mock amenities pricing - in real app, fetch from API
        const amenitiesPricing: Record<string, number> = {
          'wifi': 1000,
          'power': 2000,
          'cleaning': 1500,
          'security': 3000
        };
        
        const amenitiesTotal = formData.selectedAmenities.reduce(
          (sum, amenityId) => sum + (amenitiesPricing[amenityId] || 0), 
          0
        );
        
        const subtotal = stallsTotal + amenitiesTotal;
        const discountAmount = 0; // Apply discount logic
        const taxAmount = subtotal * 0.18; // 18% GST
        const finalTotal = subtotal - discountAmount + taxAmount;
        
        const summary: BookingSummary = {
          stallsTotal,
          amenitiesTotal,
          discountAmount,
          taxAmount,
          finalTotal,
          breakdown: selectedStalls.map(stall => ({
            stallId: stall._id,
            stallNumber: stall.stallNumber,
            price: stall.price
          })),
          amenityBreakdown: formData.selectedAmenities.map(amenityId => ({
            amenityId,
            name: amenityId.charAt(0).toUpperCase() + amenityId.slice(1),
            price: amenitiesPricing[amenityId] || 0
          }))
        };
        
        set({ summary });
      },

      // UI state
      setLoading: (loading) => set({ isLoading: loading }),
      
      setErrors: (errors) => set({ errors }),
      
      clearErrors: () => set({ errors: {} }),

      // Payment
      setPaymentData: (payment) => set({ paymentData: payment }),

      // Reset
      resetBooking: () => set({
        exhibitionId: null,
        selectedStalls: [],
        formData: initialFormData,
        summary: null,
        currentStep: 0,
        steps: initialSteps,
        isLoading: false,
        errors: {},
        paymentData: null
      }),

      // Navigation helpers
      canProceedToStep: (step) => {
        const { validateStep } = get();
        
        // Check if all previous steps are valid
        for (let i = 0; i < step; i++) {
          const validations = validateStep(i);
          if (validations.some(v => !v.isValid)) {
            return false;
          }
        }
        
        return true;
      },

      goToNextStep: () => {
        const { currentStep, steps, canProceedToStep } = get();
        const nextStep = currentStep + 1;
        
        if (nextStep < steps.length && canProceedToStep(nextStep)) {
          get().setCurrentStep(nextStep);
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          get().setCurrentStep(currentStep - 1);
        }
      },

      // Stall management
      removeStall: (stallId: string) => {
        set(state => ({
          selectedStalls: state.selectedStalls.filter(stall => stall._id !== stallId)
        }));
        
        // Recalculate summary
        get().calculateSummary();
      },

      clearSelection: () => {
        set({
          selectedStalls: [],
          summary: null
        });
      }
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        exhibitionId: state.exhibitionId,
        selectedStalls: state.selectedStalls,
        formData: state.formData,
        currentStep: state.currentStep
      })
    }
  )
);

// Selectors for performance
export const useBookingStalls = () => useBookingStore(state => state.selectedStalls);
export const useBookingStep = () => useBookingStore(state => state.currentStep);
export const useBookingSummary = () => useBookingStore(state => state.summary);
export const useBookingLoading = () => useBookingStore(state => state.isLoading);
