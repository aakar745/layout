export interface ServiceChargeStall {
  _id: string;
  stallNumber: string;
  exhibitorCompanyName: string;
  stallArea: number;
  dimensions?: {
    width: number;
    height: number;
  };
  isActive: boolean;
}

export interface ExhibitionConfig {
  _id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  config: {
    isEnabled: boolean;
    title: string;
    description: string;
    // Support both old and new pricing systems
    serviceTypes?: {
      type: string;
      amount: number;
    }[];
    pricingRules?: {
      smallStallThreshold: number;
      smallStallPrice: number;
      largeStallPrice: number;
    };
    paymentGateway: 'phonepe';
    phonePeConfig: {
      clientId: string;
      env: 'SANDBOX' | 'PRODUCTION';
    };
  };
}

export interface FormData {
  vendorName: string;
  companyName: string;
  exhibitorCompanyName?: string;
  vendorPhone: string;
  stallNumber: string;
  stallArea?: number;
  serviceType?: string; // Keep for backward compatibility
  uploadedImage?: string;
  originalAmount?: number; // Store original amount for failed payments
}

export interface PaymentResult {
  serviceChargeId: string;
  receiptNumber: string;
  paymentId?: string;
  amount: number;
  paidAt?: string;
  receiptGenerated: boolean;
  receiptDownloadUrl?: string;
  state?: string;
}

export type PaymentStatus = 'idle' | 'failed' | 'pending';

export interface PaymentData {
  exhibitionId: string;
  vendorName: string;
  vendorPhone: string;
  companyName: string;
  exhibitorCompanyName?: string;
  stallNumber: string;
  stallArea?: number;
  serviceType: string;
  amount: string;
  uploadedImage?: string;
}

export interface ServiceChargeFormProps {
  exhibition: ExhibitionConfig | null;
  stalls: ServiceChargeStall[];
  selectedStall: ServiceChargeStall | null;
  formData: FormData;
  paymentResult: PaymentResult | null;
  paymentStatus: PaymentStatus;
  currentStep: number;
  loading: boolean;
  submitting: boolean;
  verificationInProgress: boolean;
  paymentVerified: boolean;
  failedServiceChargeId: string | null;
}

export interface StepAction {
  handleNext: () => void;
  handlePrevious: () => void;
  handlePayment: () => Promise<void>;
  handleStallSelection: (stallNumber: string) => void;
  calculateServiceCharge: () => number;
  handleManualPaymentCheck: () => Promise<void>;
  handleCancelPayment: () => void;
}

export interface UploadState {
  fileList: any[];
  setFileList: (files: any[]) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
} 