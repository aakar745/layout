import Razorpay from 'razorpay';
import crypto from 'crypto';

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: string | number;
  amount_paid: string | number;
  amount_due: string | number;
  currency: string;
  receipt?: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface CreateOrderParams {
  amount: number;
  receiptId: string;
  currency?: string;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export class RazorpayService {
  private razorpay: Razorpay | null = null;
  private isDevelopmentMode: boolean;
  
  constructor() {
    // Check if we're in development mode (no valid Razorpay credentials)
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    // Detect placeholder/invalid credentials
    const isPlaceholderCredentials = 
      !keyId || 
      !keySecret || 
      keyId === 'rzp_test_1234567890' ||
      keySecret === 'your_razorpay_key_secret_here' ||
      keyId.includes('placeholder') ||
      keySecret.includes('placeholder') ||
      keyId.includes('your_') ||
      keySecret.includes('your_');
    
    this.isDevelopmentMode = isPlaceholderCredentials;
    
    if (this.isDevelopmentMode) {
      console.log('[Razorpay] Running in DEVELOPMENT MODE - using mock responses');
      console.log('[Razorpay] Detected placeholder/missing credentials');
    } else {
      console.log('[Razorpay] Running in PRODUCTION MODE - using real Razorpay API');
      this.razorpay = new Razorpay({
        key_id: keyId!,
        key_secret: keySecret!
      });
    }
  }
  
  /**
   * Create a new order in Razorpay
   * @param params Order creation parameters
   * @returns Razorpay order response
   */
  async createOrder(params: CreateOrderParams): Promise<RazorpayOrderResponse> {
    try {
      const options = {
        amount: Math.round(params.amount * 100), // Amount in paise (multiply by 100)
        currency: params.currency || 'INR',
        receipt: params.receiptId,
        payment_capture: 1 // Auto capture payment
      };
      
      console.log('[Razorpay] Creating order with options:', options);
      
      // Development mode - return mock response
      if (this.isDevelopmentMode) {
        const mockOrder: RazorpayOrderResponse = {
          id: `order_dev_${Date.now()}`,
          entity: 'order',
          amount: options.amount,
          amount_paid: 0,
          amount_due: options.amount,
          currency: options.currency,
          receipt: options.receipt,
          status: 'created',
          attempts: 0,
          created_at: Math.floor(Date.now() / 1000)
        };
        
        console.log('[Razorpay] Mock order created successfully:', mockOrder.id);
        return mockOrder;
      }
      
      // Production mode - use real Razorpay API
      const order = await this.razorpay!.orders.create(options);
      
      console.log('[Razorpay] Order created successfully:', order.id);
      
      return order;
    } catch (error) {
      console.error('[Razorpay] Order creation failed:', error);
      throw new Error(`Failed to create Razorpay order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Verify payment signature
   * @param params Payment verification parameters
   * @returns Boolean indicating if signature is valid
   */
  verifySignature(params: VerifyPaymentParams): boolean {
    try {
      const { orderId, paymentId, signature } = params;
      
      console.log('[Razorpay] Verifying signature for order:', orderId);
      
      // Development mode - always return true for testing
      if (this.isDevelopmentMode) {
        console.log('[Razorpay] Development mode - signature verification: SUCCESS (mock)');
        return true;
      }
      
      // Production mode - verify actual signature
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');
      
      console.log('[Razorpay] Expected signature:', expectedSignature);
      console.log('[Razorpay] Received signature:', signature);
      
      const isValid = expectedSignature === signature;
      
      console.log('[Razorpay] Signature verification:', isValid ? 'SUCCESS' : 'FAILED');
      
      return isValid;
    } catch (error) {
      console.error('[Razorpay] Signature verification error:', error);
      return false;
    }
  }
  
    /**
   * Get payment details from Razorpay
   * @param paymentId Razorpay payment ID
   * @returns Payment details
   */
  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      console.log('[Razorpay] Fetching payment details for:', paymentId);
      
      // Development mode - return mock payment details
      if (this.isDevelopmentMode) {
        const mockPayment = {
          id: paymentId,
          entity: 'payment',
          amount: 200000,
          currency: 'INR',
          status: 'captured',
          method: 'card',
          created_at: Math.floor(Date.now() / 1000)
        };
        console.log('[Razorpay] Mock payment details returned');
        return mockPayment;
      }
      
      // Production mode - fetch real payment details
      const payment = await this.razorpay!.payments.fetch(paymentId);
      
      console.log('[Razorpay] Payment details fetched successfully');
      
      return payment;
    } catch (error) {
      console.error('[Razorpay] Failed to fetch payment details:', error);
      throw new Error(`Failed to fetch payment details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get order details from Razorpay
   * @param orderId Razorpay order ID
   * @returns Order details
   */
  async getOrderDetails(orderId: string): Promise<any> {
    try {
      console.log('[Razorpay] Fetching order details for:', orderId);
      
      // Development mode - return mock order details
      if (this.isDevelopmentMode) {
        const mockOrder = {
          id: orderId,
          entity: 'order',
          amount: 200000,
          currency: 'INR',
          status: 'paid',
          created_at: Math.floor(Date.now() / 1000)
        };
        console.log('[Razorpay] Mock order details returned');
        return mockOrder;
      }
      
      // Production mode - fetch real order details
      const order = await this.razorpay!.orders.fetch(orderId);
      
      console.log('[Razorpay] Order details fetched successfully');
      
      return order;
    } catch (error) {
      console.error('[Razorpay] Failed to fetch order details:', error);
      throw new Error(`Failed to fetch order details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refund a payment
   * @param paymentId Razorpay payment ID
   * @param amount Amount to refund (optional, full refund if not provided)
   * @returns Refund details
   */
  async refundPayment(paymentId: string, amount?: number): Promise<any> {
    try {
      console.log('[Razorpay] Processing refund for payment:', paymentId);
      
      // Development mode - return mock refund details
      if (this.isDevelopmentMode) {
        const mockRefund = {
          id: `rfnd_dev_${Date.now()}`,
          entity: 'refund',
          amount: amount ? Math.round(amount * 100) : 200000,
          currency: 'INR',
          payment_id: paymentId,
          status: 'processed',
          created_at: Math.floor(Date.now() / 1000)
        };
        console.log('[Razorpay] Mock refund processed successfully:', mockRefund.id);
        return mockRefund;
      }
      
      // Production mode - process real refund
      const refundOptions: any = {};
      if (amount) {
        refundOptions.amount = Math.round(amount * 100); // Amount in paise
      }
      
      const refund = await this.razorpay!.payments.refund(paymentId, refundOptions);
      
      console.log('[Razorpay] Refund processed successfully:', refund.id);
      
      return refund;
    } catch (error) {
      console.error('[Razorpay] Refund processing failed:', error);
      throw new Error(`Failed to process refund: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Razorpay public key for frontend
   * @returns Razorpay key ID
   */
  getPublicKey(): string {
    // Return mock key for development mode
    if (this.isDevelopmentMode) {
      return 'rzp_test_development_mode';
    }
    
    return process.env.RAZORPAY_KEY_ID!;
  }
}

// Export singleton instance
export const razorpayService = new RazorpayService(); 