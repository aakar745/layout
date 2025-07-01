const axios = require('axios');
require('dotenv').config();

/**
 * Test WhatsApp OTP API Integration
 * Testing with aakarnew27 template (OTP verification only)
 * Template: "{{1}}is your verification code."
 */

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;

// Test data for OTP template
const testData = {
  // OTP code (6-digit numeric only)
  otpCode: Math.floor(100000 + Math.random() * 900000).toString(), // Generate random 6-digit OTP
  // Alternative test OTPs for different scenarios (all 6-digit)
  testOTPs: [
    "123456", // Simple test OTP
    "789012", // Another test OTP
    "555666", // Easy to remember OTP
  ]
};

const testPhoneNumber = process.env.TEST_PHONE_NUMBER || "9558422743";

console.log('🔐 WhatsApp OTP API Test Started...\n');

// Function to validate OTP format
function validateOTP(otp) {
  const isValid = /^\d{6}$/.test(otp); // Exactly 6 digits
  console.log(`🔢 OTP validation: ${isValid ? '✅' : '❌'} "${otp}" ${isValid ? '(Valid 6-digit format)' : '(Invalid - must be exactly 6 digits)'}`);
  return isValid;
}

// Function to format phone number for API
function formatPhoneNumber(phoneNumber) {
  const cleanPhone = phoneNumber.replace(/[\s+\-]/g, '');
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone.substring(2) : cleanPhone;
  console.log(`📱 Phone number formatted: ${phoneNumber} → ${formattedPhone}`);
  return formattedPhone;
}

async function testWhatsAppOTP(otpCode = testData.otpCode, phoneNumber = testPhoneNumber) {
  try {
    // Check if environment variables are set
    if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN) {
      console.error('❌ Environment variables not set!');
      console.log('Please set:');
      console.log('WHATSAPP_API_URL=https://wa20.nuke.co.in');
      console.log('WHATSAPP_API_TOKEN=your_token_here');
      console.log('TEST_PHONE_NUMBER=your_test_number (optional)');
      return false;
    }

    console.log('✅ Environment variables found');
    console.log(`📡 API URL: ${WHATSAPP_API_URL}`);
    console.log(`🔑 Token: ${WHATSAPP_API_TOKEN.substring(0, 20)}...`);
    console.log(`📱 Test Number: ${phoneNumber}`);
    console.log(`🔢 OTP Code: ${otpCode}\n`);

    // Validate OTP format
    if (!validateOTP(otpCode)) {
      console.error('❌ Invalid OTP format! Must be exactly 6 digits.');
      return false;
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Prepare payload for OTP template
    const otpPayload = {
      message: "OTP verification code",
      brodcast_service: "whatsapp_credits",
      broadcast_name: `test_otp_${Date.now()}`,
      template_id: "aakarnew27", // ✅ APPROVED OTP TEMPLATE
      schedule_date: new Date().toISOString().split('T')[0],
      schedule_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      contacts: formattedPhone,
      // Template parameter: {{1}} - OTP code only (API maps attribute2 to {{1}})
      attribute2: otpCode  // {{1}} - The OTP verification code
    };

    console.log('📤 Sending OTP template...');
    console.log('🔄 Template: aakarnew27');
    console.log('📝 Template Body: "{{1}}is your verification code."');
    console.log('🔢 Parameter Mapping:');
    console.log(`  {{1}} (attribute2): "${otpPayload.attribute2}"`);
    console.log('📱 Expected WhatsApp Message: "' + otpCode + 'is your verification code."');
    console.log('ℹ️  Note: Only body text will be sent - no header, no footer');
    console.log('');

    // Debug: Show the complete payload
    console.log('🔍 Debug - Complete Payload:');
    console.log(JSON.stringify(otpPayload, null, 2));
    console.log('');

    // Send OTP template message
    const response = await axios.post(
      `${WHATSAPP_API_URL}/v5/api/index.php/addbroadcast`,
      otpPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': WHATSAPP_API_TOKEN
        }
      }
    );

    console.log('\n✅ API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    // Check for OTP-specific success indicators
    if (response.data) {
      if (response.data.success || response.data.status === 'success') {
        console.log('🎉 OTP sent successfully!');
      }
      
      // Check for any error messages
      if (response.data.error) {
        console.log('⚠️  Error in response:', response.data.error);
      }
      
      if (response.data.message && response.data.message.includes('template')) {
        console.log('📋 Template-related message:', response.data.message);
      }
    }

    // Check if we got a request_id for status tracking
    if (response.data && response.data.request_id) {
      console.log(`\n📊 Request ID: ${response.data.request_id}`);
      console.log('You can check status at:');
      console.log(`https://goshort.in/api/broadcast_status.php?request_id=${response.data.request_id}`);
      
      // Wait a bit and check status
      setTimeout(async () => {
        try {
          const statusResponse = await axios.get(
            `https://goshort.in/api/broadcast_status.php?request_id=${response.data.request_id}`,
            {
              headers: {
                'Authorization': WHATSAPP_API_TOKEN
              }
            }
          );
          console.log('\n📊 Status Check:');
          console.log(JSON.stringify(statusResponse.data, null, 2));
          
          // Check for OTP delivery status
          if (statusResponse.data && statusResponse.data.status) {
            const status = JSON.stringify(statusResponse.data.status).toLowerCase();
            if (status.includes('delivered') || status.includes('sent')) {
              console.log('🎉 OTP delivery confirmed!');
            } else if (status.includes('failed') || status.includes('error')) {
              console.log('❌ OTP delivery failed!');
            }
          }
        } catch (statusError) {
          console.log('\n⚠️  Status check failed:', statusError.message);
        }
      }, 3000); // Check status after 3 seconds
    }

    console.log('\n🎉 OTP test completed successfully!');
    console.log('Check your WhatsApp for the OTP verification message.');
    console.log('\n📱 Expected message:');
    console.log(`"${otpCode}is your verification code."`);
    console.log('\n📋 Template Details:');
    console.log('- Template Name: aakarnew27');
    console.log('- Category: Utility');
    console.log('- Status: Approved ✅');
    console.log('- Language: English (US)');
    console.log('- Header: None');
    console.log('- Body: {{1}}is your verification code.');
    console.log('- Footer: None');
    console.log('- Parameters: 1 (6-digit OTP code only)');
    console.log('- Message: Only body text sent to WhatsApp');

    return true;

  } catch (error) {
    console.error('\n❌ OTP test failed:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
      
      // Check for OTP-specific errors
      const responseStr = JSON.stringify(error.response.data).toLowerCase();
      if (responseStr.includes('template') || responseStr.includes('parameter')) {
        console.log('\n📋 ⚠️  This appears to be a template/parameter related error!');
        console.log('Possible solutions:');
        console.log('1. Verify template "aakarnew27" is approved and active');
        console.log('2. Check OTP parameter format (must be exactly 6 digits)');
        console.log('3. Ensure phone number is in correct format');
        console.log('4. Verify API token has template access');
      }
      
      if (responseStr.includes('phone') || responseStr.includes('number')) {
        console.log('\n📱 ⚠️  This appears to be a phone number related error!');
        console.log('Possible solutions:');
        console.log('1. Check phone number format (10 digits without +91)');
        console.log('2. Verify phone number is WhatsApp enabled');
        console.log('3. Try with different test phone number');
      }
    }
    
    return false;
  }
}

// Test multiple OTP scenarios
async function runOTPTests() {
  console.log('🧪 Starting WhatsApp OTP API tests with aakarnew27 template...\n');
  
  // Test 1: Default random OTP
  console.log('🔄 Test 1: Random Generated OTP');
  console.log('=' .repeat(50));
  const test1Success = await testWhatsAppOTP();
  
  // Wait between tests
  console.log('\n⏳ Waiting 5 seconds before next test...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test 2: Predefined test OTP (6-digit)
  console.log('🔄 Test 2: Predefined Test OTP');
  console.log('=' .repeat(50));
  const test2Success = await testWhatsAppOTP("123456");
  
  // Test 3: Another 6-digit OTP
  console.log('\n⏳ Waiting 5 seconds before next test...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('🔄 Test 3: Different 6-Digit OTP');
  console.log('=' .repeat(50));
  const test3Success = await testWhatsAppOTP("789012");
  
  // Summary
  console.log('\n📋 Test Summary:');
  console.log('=' .repeat(50));
  console.log(`1. Random 6-Digit OTP Test: ${test1Success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`2. Predefined OTP Test (123456): ${test2Success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`3. Different 6-Digit OTP Test (789012): ${test3Success ? '✅ PASSED' : '❌ FAILED'}`);
  
  const totalPassed = [test1Success, test2Success, test3Success].filter(Boolean).length;
  console.log(`\n🎯 Overall Result: ${totalPassed}/3 tests passed`);
  
  console.log('\n🔧 Template Configuration:');
  console.log('- Template ID: aakarnew27');
  console.log('- Category: Utility (OTP verification)');
  console.log('- Status: Approved ✅');
  console.log('- Language: English (US)');
  console.log('- Parameters: 1 (6-digit OTP code only)');
  console.log('- Body Format: "{{1}}is your verification code."');
  console.log('- Header: None');
  console.log('- Footer: None');
  
  console.log('\n📱 Message Details:');
  console.log('- Only body text will be sent to WhatsApp');
  console.log('- No header, no footer, no buttons');
  console.log('- OTP must be exactly 6 digits');
  console.log('- Example: "123456is your verification code."');
  console.log('- Simple, fast delivery for authentication');
  console.log('- Perfect for mobile verification workflows');
  
  console.log('\n🚀 Next Steps:');
  console.log('- Integrate with exhibitor registration system');
  console.log('- Add OTP expiration handling (10 minutes recommended)');
  console.log('- Implement rate limiting for OTP requests');
  console.log('- Test with production phone numbers');
  console.log('- Monitor delivery success rates');
}

// Run the OTP tests
runOTPTests().catch(console.error); 