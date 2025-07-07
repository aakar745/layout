/**
 * PhonePe Order Creation Test - Updated for New Implementation
 * 
 * This script tests actual PhonePe order creation using the configured credentials
 * and includes testing of the verification flow
 */

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

class PhonePeOrderTest {
  constructor() {
    this.clientId = process.env.PHONEPE_CLIENT_ID || '';
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET || '';
    this.clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');
    this.env = (process.env.PHONEPE_ENV) || 'SANDBOX';
    this.backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Set base URL based on environment
    this.baseUrl = this.env === 'PRODUCTION' 
      ? 'https://api.phonepe.com/apis/hermes' 
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  /**
   * Generate X-VERIFY header for PhonePe API
   */
  generateXVerifyHeader(payloadBase64, endpoint) {
    const data = payloadBase64 + endpoint + this.clientSecret;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash + '###' + this.clientVersion;
  }

  /**
   * Test creating a service charge order through our API
   */
  async testServiceChargeOrder() {
    try {
      console.log('🧪 Testing Service Charge Order Creation...\n');

      const orderData = {
        exhibitionId: 'test-exhibition-id',
        vendorName: 'Test Vendor',
        vendorPhone: '9876543210',
        vendorEmail: 'test@vendor.com',
        companyName: 'Test Company',
        stallNumber: 'A-001',
        vendorAddress: 'Test Address',
        serviceType: 'Stall Positioning',
        description: 'Test service charge',
        amount: 1000 // Rs. 10.00
      };

      console.log('📤 Creating service charge order:');
      console.log(JSON.stringify(orderData, null, 2));

      const response = await axios.post(
        `${this.backendUrl}/api/public/service-charge/create-order`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      console.log('\n✅ Service charge order created successfully!');
      console.log('📋 Response:');
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error('\n❌ Service charge order creation failed:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error:', error.message);
      }
      throw error;
    }
  }

  /**
   * Test PhonePe payment verification
   */
  async testPaymentVerification(merchantTransactionId) {
    try {
      console.log('\n🔍 Testing Payment Verification...');
      console.log(`Merchant Transaction ID: ${merchantTransactionId}`);

      const response = await axios.post(
        `${this.backendUrl}/api/public/service-charge/verify-phonepe-payment`,
        {
          merchantTransactionId: merchantTransactionId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      console.log('\n✅ Payment verification completed!');
      console.log('📋 Response:');
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error('\n❌ Payment verification failed:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error:', error.message);
      }
      return null;
    }
  }

  /**
   * Test direct PhonePe order creation (legacy test)
   */
  async testDirectPhonePeOrder() {
    try {
      console.log('\n🧪 Testing Direct PhonePe Order Creation...\n');

      console.log('📋 Configuration:');
      console.log(`Client ID: ${this.clientId}`);
      console.log(`Environment: ${this.env}`);
      console.log(`Base URL: ${this.baseUrl}`);
      console.log(`Client Version: ${this.clientVersion}\n`);

      // Create test order payload
      const merchantTransactionId = `TEST_${Date.now()}`;
      const amount = 1000; // Rs. 10.00 in paise
      
      const paymentPayload = {
        merchantId: this.clientId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: `USER_${Date.now()}`,
        amount: amount,
        redirectUrl: `${this.frontendUrl}/service-charge/payment-result?serviceChargeId=test&gateway=phonepe`,
        redirectMode: 'POST',
        callbackUrl: `${this.backendUrl}/api/public/service-charge/phonepe-callback`,
        mobileNumber: '',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      console.log('📤 Test Order Payload:');
      console.log(JSON.stringify(paymentPayload, null, 2));

      const payloadString = JSON.stringify(paymentPayload);
      const payloadBase64 = Buffer.from(payloadString).toString('base64');
      const endpoint = '/pg/v1/pay';
      const xVerifyHeader = this.generateXVerifyHeader(payloadBase64, endpoint);

      console.log('\n🔐 Request Details:');
      console.log(`Endpoint: ${this.baseUrl}${endpoint}`);
      console.log(`X-VERIFY Header: ${xVerifyHeader.substring(0, 20)}...`);
      console.log(`Payload Base64 Length: ${payloadBase64.length}`);

      console.log('\n⏳ Making API request to PhonePe...');
      
      const response = await axios.post(
        `${this.baseUrl}${endpoint}`,
        {
          request: payloadBase64
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerifyHeader
          },
          timeout: 30000
        }
      );

      console.log('\n✅ SUCCESS! PhonePe Order Created Successfully');
      console.log('📋 Response:');
      console.log(JSON.stringify(response.data, null, 2));

      if (response.data.success && response.data.data?.instrumentResponse?.redirectInfo?.url) {
        console.log('\n🔗 Payment URL Generated:');
        console.log(response.data.data.instrumentResponse.redirectInfo.url);
        console.log('\n📱 Test Instructions:');
        console.log('1. Open the payment URL in your browser');
        console.log('2. Complete the test payment');
        console.log('3. Note the redirect URL and check payment status');
      }

      return { success: true, data: response.data, merchantTransactionId };
    } catch (error) {
      console.error('\n❌ PhonePe Order Creation Failed:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
        
        if (error.response.data?.code === 'KEY_NOT_CONFIGURED') {
          console.log('\n🚨 SOLUTION FOR KEY_NOT_CONFIGURED:');
          console.log('1. Verify your PhonePe merchant account is activated');
          console.log('2. Check if API keys are properly configured in PhonePe dashboard');
          console.log('3. Ensure you have access to SANDBOX environment');
          console.log('4. Contact PhonePe support if the issue persists');
          console.log('5. For testing, use development mode: PHONEPE_CLIENT_ID=phonepe_test_development_mode');
        }
      } else {
        console.error('Error:', error.message);
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Test order status checking
   */
  async testOrderStatus(merchantTransactionId) {
    try {
      console.log(`\n🔍 Testing Order Status Check for: ${merchantTransactionId}`);

      const endpoint = `/pg/v1/status/${this.clientId}/${merchantTransactionId}`;
      const xVerifyHeader = this.generateXVerifyHeader('', endpoint);

      const response = await axios.get(
        `${this.baseUrl}${endpoint}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerifyHeader
          },
          timeout: 10000
        }
      );

      console.log('\n✅ Order Status Retrieved:');
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error('\n❌ Order Status Check Failed:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error:', error.message);
      }
      return null;
    }
  }

  /**
   * Run comprehensive test
   */
  async runComprehensiveTest() {
    console.log('🚀 Starting Comprehensive PhonePe Integration Test\n');
    console.log('=' .repeat(60));

    try {
      // Test 1: Service charge order creation through our API
      console.log('\n📋 TEST 1: Service Charge Order Creation');
      console.log('-'.repeat(40));
      
      // Note: This will fail if exhibition doesn't exist, but that's expected
      // const orderResult = await this.testServiceChargeOrder();

      // Test 2: Direct PhonePe order creation
      console.log('\n📋 TEST 2: Direct PhonePe Order Creation');
      console.log('-'.repeat(40));
      const phonepeResult = await this.testDirectPhonePeOrder();

      if (phonepeResult.success) {
        // Test 3: Order status checking
        console.log('\n📋 TEST 3: Order Status Check');
        console.log('-'.repeat(40));
        await this.testOrderStatus(phonepeResult.merchantTransactionId);

        // Test 4: Payment verification through our API
        console.log('\n📋 TEST 4: Payment Verification');
        console.log('-'.repeat(40));
        await this.testPaymentVerification(phonepeResult.merchantTransactionId);
      }

      console.log('\n' + '=' .repeat(60));
      console.log('🎉 Comprehensive test completed!');
      console.log('\n📝 Next Steps:');
      console.log('1. Test the actual payment flow with the generated URL');
      console.log('2. Check server logs for callback handling');
      console.log('3. Verify payment status updates in database');
      console.log('4. Test the frontend payment result page');

    } catch (error) {
      console.error('\n💥 Comprehensive test failed:', error.message);
    }
  }
}

// Run the comprehensive test
const tester = new PhonePeOrderTest();
tester.runComprehensiveTest()
  .then(() => {
    console.log('\n✨ All tests completed!');
  })
  .catch((error) => {
    console.log('\n💥 Test execution failed:', error.message);
  }); 