import axios from 'axios';
import crypto from 'crypto';
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
  private baseUrl: string;
  private isDevelopmentMode: boolean;

  constructor() {
    this.clientId = process.env.PHONEPE_CLIENT_ID || '';
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET || '';
    this.clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');
    this.env = (process.env.PHONEPE_ENV as 'SANDBOX' | 'PRODUCTION') || 'SANDBOX';
    
    // Set base URL based on environment
    this.baseUrl = this.env === 'PRODUCTION' 
      ? 'https://api.phonepe.com/apis/hermes' 
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    
    // Development mode check - more explicit conditions
    this.isDevelopmentMode = this.clientId === 'phonepe_test_development_mode' || 
                           !this.clientId || 
                           !this.clientSecret ||
                           this.clientId === '' ||
                           this.clientSecret === '';

    // Enhanced logging for better debugging
    console.log('[PhonePe] Service Initialization:', {
      environment: this.env,
      baseUrl: this.baseUrl,
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
    } else {
      console.log(`[PhonePe] Initialized in ${this.env} mode with client ID: ${this.clientId.substring(0, 10)}...`);
      
      // Additional validation for production mode
      if (this.env === 'PRODUCTION' && this.baseUrl.includes('preprod')) {
        console.warn('[PhonePe] WARNING: Environment is set to PRODUCTION but using sandbox URL!');
      }
      
      if (this.clientId.length < 10) {
        console.warn('[PhonePe] WARNING: Client ID seems too short for production use');
      }
    }
  }

  /**
   * Generate X-VERIFY header for PhonePe API requests
   */
  private generateXVerifyHeader(payload: string, endpoint: string): string {
    const data = payload + endpoint + this.clientSecret;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash + '###' + this.clientVersion;
  }

  /**
   * Create a payment order
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

    // Production mode - make actual API call
    const merchantTransactionId = params.receiptId;
    const endpoint = '/pg/v1/pay';
    let payloadBase64 = '';
    let xVerifyHeader = '';
    
    try {
      const paymentPayload = {
        merchantId: this.clientId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: `USER_${Date.now()}`,
        amount: Math.round(params.amount * 100), // Convert to paise
        redirectUrl: params.redirectUrl,
        redirectMode: 'POST',
        callbackUrl: params.callbackUrl,
        mobileNumber: '',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const payloadString = JSON.stringify(paymentPayload);
      payloadBase64 = Buffer.from(payloadString).toString('base64');
      xVerifyHeader = this.generateXVerifyHeader(payloadBase64, endpoint);

      const response = await axios.post(
        `${this.baseUrl}${endpoint}`,
        {
          request: payloadBase64
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerifyHeader
          }
        }
      );

      console.log('[PhonePe] Order created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[PhonePe] Order creation failed:', error);
      
      // Enhanced error handling for common PhonePe API errors
      if (error.response?.data) {
        const apiError = error.response.data;
        console.error('[PhonePe] API Error Details:', apiError);
        console.error('[PhonePe] Request Details:', {
          url: `${this.baseUrl}${endpoint}`,
          merchantId: this.clientId,
          environment: this.env,
          xVerifyHeaderLength: xVerifyHeader.length,
          payloadSize: payloadBase64.length
        });
        
        if (apiError.code === 'KEY_NOT_CONFIGURED') {
          const errorMsg = `PhonePe configuration error: Merchant key not found.\n` +
                          `Current Configuration:\n` +
                          `- Merchant ID: ${this.clientId}\n` +
                          `- Environment: ${this.env}\n` +
                          `- Base URL: ${this.baseUrl}\n` +
                          `- Client Secret Present: ${!!this.clientSecret}\n` +
                          `\nPossible Solutions:\n` +
                          `1. Verify your merchant ID is correct in PhonePe dashboard\n` +
                          `2. Ensure your merchant account is activated for ${this.env} environment\n` +
                          `3. Check if API keys are properly configured\n` +
                          `4. Verify the client secret is correct\n` +
                          `5. Contact PhonePe support if the issue persists`;
          throw new Error(errorMsg);
        } else if (apiError.code === 'INVALID_REQUEST') {
          throw new Error(`PhonePe request error: ${apiError.message || 'Invalid request format'}\nPlease check your request payload and headers.`);
        } else if (apiError.code === 'MERCHANT_NOT_FOUND') {
          throw new Error(`PhonePe merchant error: Merchant ID '${this.clientId}' not found. Please verify your merchant ID is correct.`);
        } else if (apiError.code === 'INVALID_MERCHANT') {
          throw new Error(`PhonePe merchant error: Invalid merchant configuration. Please check your merchant setup in PhonePe dashboard.`);
        } else {
          throw new Error(`PhonePe API error: ${apiError.message || 'Unknown API error'} (Code: ${apiError.code || 'unknown'})`);
        }
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error(`PhonePe network error: Unable to connect to PhonePe servers. Please check your internet connection and try again.`);
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error(`PhonePe timeout error: Request timed out. Please try again later.`);
      }
      
      throw new Error(`Failed to create PhonePe order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check order status
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

      // Production mode - check actual status
      const endpoint = `/pg/v1/status/${this.clientId}/${merchantTransactionId}`;
      const xVerifyHeader = this.generateXVerifyHeader('', endpoint);

      const response = await axios.get(
        `${this.baseUrl}${endpoint}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerifyHeader
          }
        }
      );

      console.log('[PhonePe] Order status retrieved successfully');
      return response.data;
    } catch (error) {
      console.error('[PhonePe] Order status check failed:', error);
      throw new Error(`Failed to check PhonePe order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify payment callback
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

      // Production mode - verify actual callback
      const expectedAuth = crypto.createHash('sha256')
        .update(username + password + responseBody)
        .digest('hex');
      
      if (authorization !== expectedAuth) {
        throw new Error('Invalid callback signature');
      }

      const callbackData = JSON.parse(responseBody);
      console.log('[PhonePe] Callback verified successfully');
      
      return {
        success: true,
        payload: callbackData.payload || callbackData
      };
    } catch (error) {
      console.error('[PhonePe] Callback verification failed:', error);
      throw new Error(`Failed to verify PhonePe callback: ${error instanceof Error ? error.message : 'Unknown error'}`);
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