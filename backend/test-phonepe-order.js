/**
 * PhonePe Order Creation Test
 * 
 * This script tests actual PhonePe order creation using the configured credentials
 */

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

class PhonePeAPITest {
  constructor() {
    this.clientId = process.env.PHONEPE_CLIENT_ID || '';
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET || '';
    this.clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || '1');
    this.env = (process.env.PHONEPE_ENV) || 'SANDBOX';
    
    // Set base URL based on environment
    this.baseUrl = this.env === 'PRODUCTION' 
      ? 'https://api.phonepe.com/apis/hermes' 
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  /**
   * Generate X-VERIFY header for PhonePe API requests
   */
  generateXVerifyHeader(payload, endpoint) {
    const data = payload + endpoint + this.clientSecret;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash + '###' + this.clientVersion;
  }

  /**
   * Test PhonePe order creation
   */
  async testCreateOrder() {
    try {
      console.log('🧪 Testing PhonePe Order Creation...\n');

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
        redirectUrl: 'https://webhook.site/redirect',
        redirectMode: 'POST',
        callbackUrl: 'https://webhook.site/callback',
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
          timeout: 30000 // 30 second timeout
        }
      );

      console.log('\n✅ SUCCESS! PhonePe Order Created Successfully');
      console.log('📋 Response:');
      console.log(JSON.stringify(response.data, null, 2));

      if (response.data.success && response.data.data?.instrumentResponse?.redirectInfo?.url) {
        console.log('\n🔗 Payment URL Generated:');
        console.log(response.data.data.instrumentResponse.redirectInfo.url);
        console.log('\n✨ Your PhonePe test credentials are working correctly!');
        console.log('🎉 You can now process payments through PhonePe sandbox');
      } else {
        console.log('\n⚠️  Order created but no payment URL received');
        console.log('Check the response above for details');
      }

      return { success: true, data: response.data };

    } catch (error) {
      console.log('\n❌ PhonePe Order Creation Failed');
      
      if (error.response) {
        console.log('📋 API Error Response:');
        console.log(`Status: ${error.response.status}`);
        console.log(`Data:`, JSON.stringify(error.response.data, null, 2));
        
        const apiError = error.response.data;
        
        if (apiError.code === 'KEY_NOT_CONFIGURED') {
          console.log('\n🔧 Issue: Merchant Key Not Configured');
          console.log('💡 Solutions:');
          console.log('   1. Verify your PHONEPE_CLIENT_ID in .env file');
          console.log('   2. Check if the merchant is approved in PhonePe dashboard');
          console.log('   3. Ensure the key is active for the selected environment');
          console.log('   4. Contact PhonePe support for key activation');
        } else if (apiError.code === 'INVALID_REQUEST') {
          console.log('\n🔧 Issue: Invalid Request Format');
          console.log('💡 Solutions:');
          console.log('   1. Check payload format');
          console.log('   2. Verify X-VERIFY header generation');
          console.log('   3. Ensure all required fields are present');
        } else if (apiError.code === 'AUTHENTICATION_ERROR') {
          console.log('\n🔧 Issue: Authentication Failed');
          console.log('💡 Solutions:');
          console.log('   1. Verify PHONEPE_CLIENT_SECRET in .env file');
          console.log('   2. Check if secret matches the one in PhonePe dashboard');
          console.log('   3. Ensure no extra spaces/characters in credentials');
        }
      } else if (error.request) {
        console.log('\n🔧 Issue: Network/Connection Error');
        console.log('💡 Solutions:');
        console.log('   1. Check internet connection');
        console.log('   2. Verify PhonePe API endpoints are accessible');
        console.log('   3. Check if firewall is blocking requests');
        console.log('\n📋 Error Details:', error.message);
      } else {
        console.log('\n📋 Unexpected Error:', error.message);
      }

      return { success: false, error: error.message };
    }
  }
}

// Run the test
const tester = new PhonePeAPITest();

console.log('🚀 PhonePe API Integration Test');
console.log('='.repeat(50));

tester.testCreateOrder()
  .then((result) => {
    if (result.success) {
      console.log('\n🎉 Test completed successfully!');
      console.log('Your PhonePe integration is ready to use.');
    } else {
      console.log('\n❌ Test failed. Please fix the issues above and try again.');
    }
  })
  .catch((error) => {
    console.log('\n💥 Unexpected test error:', error.message);
  }); 