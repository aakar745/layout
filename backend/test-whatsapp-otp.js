/**
 * Test WhatsApp OTP Functionality
 * 
 * This script tests the WhatsApp OTP integration for exhibitor registration
 */

require('dotenv').config();
const axios = require('axios');

// Test configuration
const testConfig = {
  whatsappApiUrl: process.env.WHATSAPP_API_URL || 'https://wa20.nuke.co.in',
  whatsappApiToken: process.env.WHATSAPP_API_TOKEN,
  testPhoneNumber: '9876543210', // Replace with a test number
  testCompanyName: 'Test Company Ltd',
  testOTP: '123456'
};

/**
 * Test WhatsApp OTP Template Sending
 */
async function testWhatsAppOTPSending() {
  console.log('🔄 Testing WhatsApp OTP Template Sending...');
  
  try {
    const templatePayload = {
      message: "OTP verification for exhibitor registration - TEST",
      brodcast_service: "whatsapp_credits",
      broadcast_name: `test_exhibitor_otp_${Date.now()}`,
      template_id: "exhibitor_otp_verification", // ✅ APPROVED TEMPLATE
      schedule_date: new Date().toISOString().split('T')[0],
      schedule_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      contacts: testConfig.testPhoneNumber,
      // Template parameters for approved template
      attribute2: testConfig.testCompanyName,  // {{1}} - Company name
      attribute3: testConfig.testOTP,          // {{2}} - OTP code
      attribute4: "10"                         // {{3}} - Expiry minutes
    };

    console.log('📤 Sending payload:', JSON.stringify(templatePayload, null, 2));

    const response = await axios.post(
      `${testConfig.whatsappApiUrl}/v5/api/index.php/addbroadcast`,
      templatePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': testConfig.whatsappApiToken
        }
      }
    );

    console.log('✅ WhatsApp OTP sent successfully!');
    console.log('📋 Response:', response.data);
    
    if (response.data && response.data.request_id) {
      console.log(`🆔 Request ID: ${response.data.request_id}`);
      console.log(`📊 Status URL: https://goshort.in/api/broadcast_status.php?request_id=${response.data.request_id}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error testing WhatsApp OTP:', error.message);
    if (error.response) {
      console.error('📋 Error response:', error.response.data);
      console.error('🔢 Status code:', error.response.status);
    }
    return false;
  }
}

/**
 * Test API Endpoint Integration
 */
async function testAPIEndpoint() {
  console.log('\n🔄 Testing API Endpoint Integration...');
  
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    const payload = {
      phone: testConfig.testPhoneNumber,
      companyName: testConfig.testCompanyName
    };

    console.log('📤 Testing endpoint:', `${backendUrl}/api/exhibitors/send-whatsapp-otp`);
    console.log('📤 Payload:', payload);

    const response = await axios.post(
      `${backendUrl}/api/exhibitors/send-whatsapp-otp`,
      payload
    );

    console.log('✅ API endpoint working!');
    console.log('📋 Response:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error testing API endpoint:', error.message);
    if (error.response) {
      console.error('📋 Error response:', error.response.data);
      console.error('🔢 Status code:', error.response.status);
    }
    return false;
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting WhatsApp OTP Tests...\n');

  // Check configuration
  if (!testConfig.whatsappApiToken) {
    console.error('❌ WHATSAPP_API_TOKEN not configured');
    return;
  }

  console.log('⚙️ Configuration:');
  console.log(`   API URL: ${testConfig.whatsappApiUrl}`);
  console.log(`   Test Phone: ${testConfig.testPhoneNumber}`);
  console.log(`   Test Company: ${testConfig.testCompanyName}`);
  console.log(`   Test OTP: ${testConfig.testOTP}\n`);

  // Test 1: Direct WhatsApp API
  const test1Success = await testWhatsAppOTPSending();

  // Test 2: API Endpoint (optional - requires backend running)
  // const test2Success = await testAPIEndpoint();

  console.log('\n📊 Test Results:');
  console.log(`   Direct WhatsApp API: ${test1Success ? '✅ PASS' : '❌ FAIL'}`);
  // console.log(`   API Endpoint: ${test2Success ? '✅ PASS' : '❌ FAIL'}`);

  console.log('\n📝 Next Steps:');
  console.log('1. Get WhatsApp template "exhibitor_otp_verification" approved');
  console.log('2. Test with real phone numbers');
  console.log('3. Implement frontend integration');
  console.log('4. Add phone number validation and formatting');
}

// Run tests
runTests(); 