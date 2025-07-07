import { publicApi } from './api';

export interface ServiceType {
  type: string;
  amount: number;
  description: string;
}

export interface ServiceChargeConfig {
  isEnabled: boolean;
  title: string;
  description: string;
  serviceTypes: ServiceType[];
  paymentGateway: 'razorpay' | 'phonepe';
  razorpayKeyId: string;
  phonePeConfig: {
    clientId: string;
    env: 'SANDBOX' | 'PRODUCTION';
  };
}

export interface PublicServiceChargeData {
  _id: string;
  slug?: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  config: ServiceChargeConfig;
}

export interface PublicServiceChargeResponse {
  success: boolean;
  data: PublicServiceChargeData;
}

const publicServiceChargeService = {
  // Get service charge configuration for an exhibition
  getServiceChargeConfig: (exhibitionIdOrSlug: string) =>
    publicApi.get<PublicServiceChargeResponse>(`/public/service-charge/config/${exhibitionIdOrSlug}`),
    
  // Create payment order for service charges
  createPaymentOrder: (paymentData: any) =>
    publicApi.post(`/public/service-charge/create-order`, paymentData),
    
  // Verify payment for service charges
  verifyPayment: (paymentData: any) =>
    publicApi.post(`/public/service-charge/verify-payment`, paymentData),
};

export default publicServiceChargeService; 