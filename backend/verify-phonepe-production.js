const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

/**
 * PhonePe Production Configuration Diagnostic Tool
 * Run this script to verify your PhonePe configuration
 */

async function verifyPhonePeConfiguration() {
  console.log('🔍 PhonePe Production Configuration Diagnostic');
  console.log('=' .repeat(50));

  // 1. Check environment variables
  console.log('\n1. Environment Variables Check:');
  const requiredEnvVars = {
    PHONEPE_CLIENT_ID: process.env.PHONEPE_CLIENT_ID,
    PHONEPE_CLIENT_SECRET: process.env.PHONEPE_CLIENT_SECRET,
    PHONEPE_CLIENT_VERSION: process.env.PHONEPE_CLIENT_VERSION,
    PHONEPE_ENV: process.env.PHONEPE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL
  };

  let allEnvVarsPresent = true;
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    const status = value ? '✅' : '❌';
    console.log(`   ${status} ${key}: ${value || 'NOT SET'}`);
    if (!value) allEnvVarsPresent = false;
  }

  if (!allEnvVarsPresent) {
    console.log('\n❌ Missing required environment variables!');
    console.log('Please set all required variables in your .env file.');
    return;
  }

  // 2. Check PhonePe environment configuration
  console.log('\n2. PhonePe Environment Configuration:');
  const env = process.env.PHONEPE_ENV;
  const clientId = process.env.PHONEPE_CLIENT_ID;
  
  if (env === 'PRODUCTION') {
    console.log('   ✅ Environment: PRODUCTION');
    console.log('   🔗 Base URL: https://api.phonepe.com/apis/hermes');
  } else {
    console.log('   ⚠️  Environment: SANDBOX');
    console.log('   🔗 Base URL: https://api-preprod.phonepe.com/apis/pg-sandbox');
  }

  console.log(`   🏪 Merchant ID: ${clientId}`);
  console.log(`   📱 Client Version: ${process.env.PHONEPE_CLIENT_VERSION}`);

  // 3. Test PhonePe API connectivity
  console.log('\n3. PhonePe API Connectivity Test:');
  
  try {
    const baseUrl = env === 'PRODUCTION' 
      ? 'https://api.phonepe.com/apis/hermes' 
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    
    // Create a test payload
    const testPayload = {
      merchantId: clientId,
      merchantTransactionId: `TEST_${Date.now()}`,
      merchantUserId: `USER_${Date.now()}`,
      amount: 100, // 1 rupee in paise
      redirectUrl: `${process.env.FRONTEND_URL}/test-redirect`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.BACKEND_URL}/api/test-callback`,
      mobileNumber: '',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const payloadString = JSON.stringify(testPayload);
    const payloadBase64 = Buffer.from(payloadString).toString('base64');
    const endpoint = '/pg/v1/pay';
    
    // Generate X-VERIFY header
    const data = payloadBase64 + endpoint + process.env.PHONEPE_CLIENT_SECRET;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    const xVerifyHeader = hash + '###' + process.env.PHONEPE_CLIENT_VERSION;

    console.log('   🔄 Testing API connection...');
    console.log(`   📡 Request URL: ${baseUrl}${endpoint}`);
    console.log(`   🔑 X-VERIFY Header: ${xVerifyHeader.substring(0, 20)}...`);

    const response = await axios.post(
      `${baseUrl}${endpoint}`,
      {
        request: payloadBase64
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerifyHeader
        },
        timeout: 10000
      }
    );

    console.log('   ✅ API Connection: SUCCESS');
    console.log('   📊 Response Status:', response.status);
    console.log('   📋 Response Data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('   ❌ API Connection: FAILED');
    
    if (error.response) {
      console.log('   📊 Response Status:', error.response.status);
      console.log('   📋 Response Data:', JSON.stringify(error.response.data, null, 2));
      
      const errorData = error.response.data;
      if (errorData.code === 'KEY_NOT_CONFIGURED') {
        console.log('\n🚨 SOLUTION FOR KEY_NOT_CONFIGURED:');
        console.log('   1. Verify your merchant ID is correct');
        console.log('   2. Ensure your merchant account is activated in PhonePe dashboard');
        console.log('   3. Check if API keys are properly configured');
        console.log('   4. Contact PhonePe support if the issue persists');
      }
    } else {
      console.log('   📋 Error:', error.message);
    }
  }

  // 4. URL Configuration Test
  console.log('\n4. URL Configuration Test:');
  console.log(`   🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`   🔗 Backend URL: ${process.env.BACKEND_URL}`);
  console.log(`   ✅ Redirect URL: ${process.env.FRONTEND_URL}/service-charge/payment-success`);
  console.log(`   ✅ Callback URL: ${process.env.BACKEND_URL}/api/public/service-charge/phonepe-callback`);

  // 5. Development Mode Check
  console.log('\n5. Development Mode Check:');
  const isDevelopmentMode = clientId === 'phonepe_test_development_mode' || 
                           !clientId || 
                           !process.env.PHONEPE_CLIENT_SECRET ||
                           clientId === '' ||
                           process.env.PHONEPE_CLIENT_SECRET === '';

  if (isDevelopmentMode) {
    console.log('   ⚠️  Currently in DEVELOPMENT MODE');
    console.log('   💡 To use production mode, set proper PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET');
  } else {
    console.log('   ✅ Currently in PRODUCTION MODE');
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Summary:');
  console.log('   - Check the API connectivity test results above');
  console.log('   - Ensure all environment variables are properly set');
  console.log('   - Verify your merchant account is activated in PhonePe dashboard');
  console.log('   - Contact PhonePe support if KEY_NOT_CONFIGURED persists');
}

// Run the diagnostic
verifyPhonePeConfiguration().catch(console.error); 