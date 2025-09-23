import { 
  ServiceChargeExhibition, 
  ServiceChargeStall, 
  ServiceChargePayment, 
  ServiceChargeResult, 
  ServiceChargeResponse,
  ServiceChargeLookupParams,
  PaymentResult
} from '@/lib/types/serviceCharge';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ServiceChargeAPI {
  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/public/service-charge${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Enhanced error handling for race conditions
      if (response.status === 409) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Conflict - resource already exists or is being processed');
        (error as any).response = { status: 409, data: errorData };
        throw error;
      }
      
      if (response.status === 429) {
        throw new Error('Too many requests - please wait before trying again');
      }
      
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get service charge configuration for an exhibition
   */
  async getExhibitionConfig(exhibitionId: string): Promise<ServiceChargeResponse<ServiceChargeExhibition>> {
    return this.fetchAPI(`/config/${exhibitionId}`);
  }

  /**
   * Get available stalls for auto-fill functionality
   */
  async getExhibitionStalls(exhibitionId: string): Promise<ServiceChargeResponse<ServiceChargeStall[]>> {
    return this.fetchAPI(`/stalls/${exhibitionId}`);
  }

  /**
   * Create payment order and get PhonePe redirect URL
   * Enhanced with race condition protection
   */
  async createPaymentOrder(
    paymentData: ServiceChargePayment, 
    abortSignal?: AbortSignal
  ): Promise<ServiceChargeResponse<{
    serviceChargeId: string;
    receiptNumber: string;
    orderId: string;
    redirectUrl: string;
  }>> {
    return this.fetchAPI('/create-order', {
      method: 'POST',
      body: JSON.stringify(paymentData),
      signal: abortSignal, // Support request cancellation
    });
  }

  /**
   * Verify PhonePe payment status
   */
  async verifyPayment(merchantTransactionId: string): Promise<ServiceChargeResponse<PaymentResult>> {
    return this.fetchAPI('/verify-phonepe-payment', {
      method: 'POST',
      body: JSON.stringify({ merchantTransactionId }),
    });
  }

  /**
   * Get service charge status by ID
   */
  async getServiceChargeStatus(serviceChargeId: string): Promise<ServiceChargeResponse<any>> {
    return this.fetchAPI(`/status/${serviceChargeId}`);
  }

  /**
   * Lookup service charges by phone or stall number
   */
  async lookupServiceCharges(
    exhibitionId: string, 
    searchData: ServiceChargeLookupParams
  ): Promise<ServiceChargeResponse<ServiceChargeResult[]>> {
    return this.fetchAPI(`/lookup/${exhibitionId}`, {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  }

  /**
   * Download receipt PDF
   */
  async downloadReceipt(serviceChargeId: string): Promise<Blob> {
    const url = `${API_BASE_URL}/public/service-charge/receipt/${serviceChargeId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Receipt download failed: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Upload image file
   */
  async uploadImage(file: File): Promise<{
    success: boolean;
    path: string;
    url: string;
    message: string;
    fileInfo?: {
      originalName: string;
      size: number;
      mimetype: string;
    };
  }> {
    const formData = new FormData();
    formData.append('uploadedImage', file);

    const url = `${API_BASE_URL}/public/service-charge/upload`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async cancelServiceCharge(serviceChargeId: string, reason?: string): Promise<ServiceChargeResponse<{
    serviceChargeId: string;
    receiptNumber: string;
    status: string;
    paymentStatus: string;
  }>> {
    return this.fetchAPI(`/cancel/${serviceChargeId}`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }
}

export const serviceChargeAPI = new ServiceChargeAPI();
export default serviceChargeAPI;
