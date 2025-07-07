import { StandardCheckoutClient, Env, StandardCheckoutPayRequest, OrderStatusResponse, CreateSdkOrderRequest } from 'pg-sdk-node';
import { randomUUID } from 'crypto';

export interface PhonePeOrderResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    instrumentResponse: {
      type: string;
      redirectInfo: {
        url: string;
        method: string;
      };
    };
  };
}

export interface PhonePeOrderStatusResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
    paymentInstrument: {
      type: string;
      [key: string]: any;
    };
  };
}

export interface CreateOrderParams {
  amount: number;
  receiptId: string;
  redirectUrl: string;
  callbackUrl?: string;
  currency?: string;
}

export interface VerifyPaymentParams {
  merchantTransactionId: string;
  transactionId: string;
}

export class PhonePeService {
  private clientId: string;
  private clientSecret: string;
  private clientVersion: number;
  private env: 'SANDBOX' | 'PRODUCTION';
  private isDevelopmentMode: boolean;
  private phonePeClient: any;

  constructor() {
    this.clientId = process.env.PHONEPE_CLIENT_ID || '';
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET || '';
    this.clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');
    this.env = (process.env.PHONEPE_ENV as 'SANDBOX' | 'PRODUCTION') || 'SANDBOX';
    
    // Development mode check - more explicit conditions
    this.isDevelopmentMode = this.clientId === 'phonepe_test_development_mode' || 
                           !this.clientId || 
                           !this.clientSecret ||
                           this.clientId === '' ||
                           this.clientSecret === '';

    // Enhanced logging for better debugging
    console.log('[PhonePe] Service Initialization:', {
      environment: this.env,
      clientIdPresent: !!this.clientId,
      clientIdLength: this.clientId.length,
      clientSecretPresent: !!this.clientSecret,
      clientSecretLength: this.clientSecret.length,
      clientVersion: this.clientVersion,
      isDevelopmentMode: this.isDevelopmentMode
    });

    if (this.isDevelopmentMode) {
      console.log('[PhonePe] Running in DEVELOPMENT MODE - payments will be simulated');
      console.log('[PhonePe] Development mode triggered by:', {
        clientIdEmpty: !this.clientId || this.clientId === '',
        clientSecretEmpty: !this.clientSecret || this.clientSecret === '',
        isDevelopmentKey: this.clientId === 'phonepe_test_development_mode'
      });
      this.phonePeClient = null; // No client needed for development mode
    } else {
      console.log(`[PhonePe] Initialized in ${this.env} mode with client ID: ${this.clientId.substring(0, 10)}...`);
      
      // Initialize official PhonePe SDK client
      try {
        const phonepeEnv = this.env === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;
        this.phonePeClient = StandardCheckoutClient.getInstance(
          this.clientId,
          this.clientSecret,
          this.clientVersion,
          phonepeEnv
        );
        console.log('[PhonePe] Official SDK client initialized successfully');
      } catch (error) {
        console.error('[PhonePe] Failed to initialize SDK client:', error);
        this.isDevelopmentMode = true; // Fallback to development mode
        console.log('[PhonePe] Falling back to development mode due to SDK initialization failure');
      }
    }
  }

  /**
   * Create a payment order using official PhonePe SDK
   */
  async createOrder(params: CreateOrderParams): Promise<PhonePeOrderResponse> {
    console.log('[PhonePe] Creating order with params:', params);

    // Development mode - return mock response
    if (this.isDevelopmentMode) {
      const mockResponse: PhonePeOrderResponse = {
        success: true,
        code: 'PAYMENT_INITIATED',
        message: 'Payment initiated successfully',
        data: {
          merchantId: 'MOCK_MERCHANT',
          merchantTransactionId: params.receiptId,
          instrumentResponse: {
            type: 'PAY_PAGE',
            redirectInfo: {
              url: `https://mock-phonepe-checkout.com/pay?merchantTransactionId=${params.receiptId}&amount=${params.amount}`,
              method: 'GET'
            }
          }
        }
      };
      
      console.log('[PhonePe] Mock order created successfully:', params.receiptId);
      return mockResponse;
    }

    // Production mode - use official SDK
    try {
      console.log('[PhonePe] Using official SDK for order creation');
      
      const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(params.receiptId)
        .amount(Math.round(params.amount * 100)) // Convert to paise
        .redirectUrl(params.redirectUrl)
        .build();

      const response = await this.phonePeClient.pay(request);
      
      console.log('[PhonePe] SDK order created successfully:', response);
      
      // Transform SDK response to our interface format
      const transformedResponse: PhonePeOrderResponse = {
        success: true,
        code: 'PAYMENT_INITIATED',
        message: 'Payment initiated successfully',
        data: {
          merchantId: this.clientId,
          merchantTransactionId: params.receiptId,
          instrumentResponse: {
            type: 'PAY_PAGE',
            redirectInfo: {
              url: response.redirectUrl,
              method: 'GET'
            }
          }
        }
      };
      
      return transformedResponse;
    } catch (error: any) {
      console.error('[PhonePe] SDK order creation failed:', error);
      
      // Enhanced error handling for PhonePe SDK errors
      if (error.message?.includes('KEY_NOT_CONFIGURED')) {
        throw new Error(`PhonePe configuration error: Merchant key not configured.\n` +
                       `Current Configuration:\n` +
                       `- Merchant ID: ${this.clientId}\n` +
                       `- Environment: ${this.env}\n` +
                       `\nSolutions:\n` +
                       `1. Contact PhonePe Integration team for sandbox access\n` +
                       `2. Verify merchant account is activated for ${this.env} environment\n` +
                       `3. Check PhonePe Business Dashboard for key status\n` +
                       `4. For testing, use development mode: PHONEPE_CLIENT_ID=phonepe_test_development_mode`);
      }
      
      throw new Error(`Failed to create PhonePe order: ${error.message || 'Unknown SDK error'}`);
    }
  }

  /**
   * Check order status using official SDK
   */
  async getOrderStatus(merchantTransactionId: string): Promise<PhonePeOrderStatusResponse> {
    try {
      console.log('[PhonePe] Checking order status for:', merchantTransactionId);

      // Development mode - return mock status
      if (this.isDevelopmentMode) {
        const mockStatus: PhonePeOrderStatusResponse = {
          success: true,
          code: 'PAYMENT_SUCCESS',
          message: 'Payment completed successfully',
          data: {
            merchantId: 'MOCK_MERCHANT',
            merchantTransactionId: merchantTransactionId,
            transactionId: `TXN_${Date.now()}`,
            amount: 200000,
            state: 'COMPLETED',
            responseCode: 'SUCCESS',
            paymentInstrument: {
              type: 'UPI'
            }
          }
        };
        
        console.log('[PhonePe] Mock status returned');
        return mockStatus;
      }

      // Production mode - use official SDK
      const response: OrderStatusResponse = await this.phonePeClient.getOrderStatus(merchantTransactionId);
      
      console.log('[PhonePe] SDK order status retrieved successfully');
      
      // Transform SDK response to our interface format
      const transformedResponse: PhonePeOrderStatusResponse = {
        success: response.state === 'COMPLETED',
        code: response.state === 'COMPLETED' ? 'PAYMENT_SUCCESS' : 'PAYMENT_PENDING',
        message: response.state === 'COMPLETED' ? 'Payment completed successfully' : 'Payment pending',
        data: {
          merchantId: this.clientId,
          merchantTransactionId: merchantTransactionId,
          transactionId: merchantTransactionId,
          amount: response.amount || 0,
          state: response.state,
          responseCode: response.state === 'COMPLETED' ? 'SUCCESS' : 'PENDING',
          paymentInstrument: {
            type: 'UPI'
          }
        }
      };
      
      return transformedResponse;
    } catch (error) {
      console.error('[PhonePe] SDK order status check failed:', error);
      throw new Error(`Failed to check PhonePe order status: ${error instanceof Error ? error.message : 'Unknown SDK error'}`);
    }
  }

  /**
   * Verify payment callback using official SDK
   */
  verifyCallback(username: string, password: string, authorization: string, responseBody: string): any {
    try {
      console.log('[PhonePe] Verifying callback');

      // Development mode - return mock verification
      if (this.isDevelopmentMode) {
        const mockCallback = {
          success: true,
          payload: {
            orderId: 'MOCK_ORDER_ID',
            state: 'COMPLETED',
            transactionId: `TXN_${Date.now()}`,
            amount: 200000
          }
        };
        
        console.log('[PhonePe] Mock callback verification successful');
        return mockCallback;
      }

      // Production mode - use official SDK
      const callbackResponse = this.phonePeClient.validateCallback(
        username,
        password,
        authorization,
        responseBody
      );
      
      console.log('[PhonePe] SDK callback verified successfully');
      
      return {
        success: true,
        payload: callbackResponse.payload || callbackResponse
      };
    } catch (error) {
      console.error('[PhonePe] SDK callback verification failed:', error);
      throw new Error(`Failed to verify PhonePe callback: ${error instanceof Error ? error.message : 'Unknown SDK error'}`);
    }
  }

  /**
   * Get public key/merchant ID for frontend
   */
  getPublicKey(): string {
    return this.isDevelopmentMode ? 'phonepe_test_development_mode' : this.clientId;
  }

  /**
   * Check if service is in development mode
   */
  isInDevelopmentMode(): boolean {
    return this.isDevelopmentMode;
  }
}

// Export singleton instance
export const phonePeService = new PhonePeService(); 