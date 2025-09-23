export interface BookingStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  gstNumber?: string;
}

export interface BookingAmenity {
  id: string;
  name: string;
  description: string;
  price: number;
  isSelected: boolean;
  quantity?: number;
}

export interface BookingData {
  exhibitionId: string;
  stallIds: string[];
  customerInfo: CustomerInfo;
  selectedAmenities: string[];
  notes?: string;
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
}

export interface BookingFormData {
  step: number;
  customerInfo: Partial<CustomerInfo>;
  selectedAmenities: string[];
  amenities?: { id: string; quantity: number }[];
  notes: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
}

export interface PaymentData {
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  paymentMethod?: string;
  transactionId?: string;
  paymentUrl?: string;
}

export interface BookingValidation {
  field: string;
  message: string;
  isValid: boolean;
}

export interface BookingSummary {
  stallsTotal: number;
  amenitiesTotal: number;
  discountAmount: number;
  taxAmount: number;
  finalTotal: number;
  breakdown: {
    stallId: string;
    stallNumber: string;
    price: number;
  }[];
  amenityBreakdown: {
    amenityId: string;
    name: string;
    price: number;
  }[];
}

// Booking status for tracking
export interface BookingStatus {
  id: string;
  status: 'draft' | 'pending_payment' | 'payment_processing' | 'confirmed' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  paymentStatus?: PaymentData['status'];
  confirmationNumber?: string;
  receiptUrl?: string;
}

// Form validation
export interface FormErrors {
  [key: string]: string;
}

// Booking configuration
export interface BookingConfig {
  maxStallsPerBooking: number;
  requiresApproval: boolean;
  allowGuestBooking: boolean;
  paymentMethods: string[];
  cancellationPolicy: string;
  termsAndConditions: string;
}
