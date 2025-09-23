// Service Charge Types for Next.js Public View

export interface ServiceChargeConfig {
  isEnabled: boolean;
  title: string;
  description: string;
  serviceTypes?: ServiceType[];
  pricingRules?: PricingRules;
  paymentGateway: 'phonepe';
  phonePeConfig: {
    clientId: string;
    env: 'SANDBOX' | 'PRODUCTION';
  };
}

export interface ServiceType {
  type: string;
  amount: number;
  description: string;
}

export interface PricingRules {
  smallStallThreshold: number;
  smallStallPrice: number;
  largeStallPrice: number;
}

export interface ServiceChargeExhibition {
  _id: string;
  slug?: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  config: ServiceChargeConfig;
}

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

export interface ServiceChargeFormData {
  vendorName: string;
  companyName: string;
  exhibitorCompanyName: string;
  vendorPhone: string;
  stallNumber: string;
  stallArea: number;
  serviceType: string;
  uploadedImage?: string;
}

export interface ServiceChargePayment {
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

export interface ServiceChargeResult {
  id: string;
  receiptNumber: string;
  vendorName: string;
  companyName: string;
  exhibitorCompanyName?: string;
  stallNumber: string;
  stallArea?: number;
  serviceType: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: string;
  paidAt?: string;
  createdAt: string;
  receiptGenerated: boolean;
  exhibition: {
    name: string;
    venue: string;
  };
}

export interface PaymentResult {
  serviceChargeId: string;
  receiptNumber: string;
  paymentId?: string;
  amount: number;
  paidAt?: string;
  state?: string;
  receiptGenerated?: boolean;
  receiptDownloadUrl?: string;
}

export interface ServiceChargeResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type PaymentStatus = 'idle' | 'processing' | 'failed' | 'success';

export interface ServiceChargeLookupParams {
  phone?: string;
  stallNumber?: string;
}
