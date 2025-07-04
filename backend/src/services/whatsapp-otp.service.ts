/**
 * WhatsApp OTP Service
 * 
 * Handles sending OTP via WhatsApp using Business API templates
 * Integrates with existing OTP verification system
 * Updated with enhanced error handling and validation
 */

import axios from 'axios';

// WhatsApp configuration
const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;

/**
 * Validate OTP format (must be exactly 6 digits)
 */
const validateOTP = (otp: string): boolean => {
  const isValid = /^\d{6}$/.test(otp);
  console.log(`[OTP] Validation: ${isValid ? '✅' : '❌'} "${otp}" ${isValid ? '(Valid 6-digit format)' : '(Invalid - must be exactly 6 digits)'}`);
  return isValid;
};

/**
 * Format phone number for WhatsApp API (with +91 prefix)
 */
const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanPhone = phoneNumber.replace(/[\s+\-]/g, '');
  let formattedPhone = cleanPhone;
  
  // Add 91 prefix if not present
  if (!formattedPhone.startsWith('91')) {
    // For 10-digit numbers, add 91 prefix
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }
  }
  
  console.log(`[PHONE] Formatted: ${phoneNumber} → ${formattedPhone}`);
  return formattedPhone;
};

/**
 * Send OTP via WhatsApp using Business Template
 */
export const sendOTPViaWhatsApp = async (
  phoneNumber: string,
  companyName: string,
  otp: string,
  expiryMinutes: number = 10
): Promise<boolean> => {
  console.log(`[DEBUG] ============ sendOTPViaWhatsApp CALLED ============`);
  console.log(`[DEBUG] Phone: ${phoneNumber}, Company: ${companyName}, OTP: ${otp}`);
  
  try {
    // Check environment configuration
    if (!whatsappApiUrl || !whatsappApiToken) {
      console.error('[ERROR] WhatsApp API configuration missing');
      console.error('Please set WHATSAPP_API_URL and WHATSAPP_API_TOKEN in environment variables');
      throw new Error('WhatsApp API configuration missing');
    }

    console.log('✅ Environment variables found');
    console.log(`📡 API URL: ${whatsappApiUrl}`);
    console.log(`🔑 Token: ${whatsappApiToken.substring(0, 20)}...`);

    // Validate OTP format (must be exactly 6 digits)
    if (!validateOTP(otp)) {
      console.error('[ERROR] Invalid OTP format! Must be exactly 6 digits.');
      return false;
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Prepare payload for OTP template (aakarnew27 - APPROVED TEMPLATE)
    const templatePayload = {
      message: "OTP verification for exhibitor registration",
      brodcast_service: "whatsapp_credits",
      broadcast_name: `exhibitor_otp_${Date.now()}`,
      template_id: "aakarnew27", // ✅ APPROVED OTP TEMPLATE
      schedule_date: new Date().toISOString().split('T')[0],
      schedule_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      contacts: formattedPhone,
      // Template parameter: {{1}} - OTP code only (API maps attribute2 to {{1}})
      attribute2: otp  // {{1}} - The OTP verification code
    };

    console.log('📤 Sending OTP template...');
    console.log('🔄 Template: aakarnew27');
    console.log('📝 Template Body: "{{1}}is your verification code."');
    console.log('🔢 Parameter Mapping:');
    console.log(`  {{1}} (attribute2): "${templatePayload.attribute2}"`);
    console.log('📱 Expected WhatsApp Message: "' + otp + 'is your verification code."');
    console.log('ℹ️  Note: Only body text will be sent - no header, no footer');

    // Debug: Show the complete payload
    console.log('🔍 Debug - Complete Payload:');
    console.log(JSON.stringify(templatePayload, null, 2));

    // Send template message using JSON payload
    const response = await axios.post(
      `${whatsappApiUrl}/v5/api/index.php/addbroadcast`,
      templatePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': whatsappApiToken
        }
      }
    );

    console.log('\n✅ API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    // Enhanced success detection
    let isSuccess = false;
    if (response.data) {
      // Check for various success indicators
      if (response.data.success || response.data.status === 'success') {
        console.log('🎉 OTP sent successfully!');
        isSuccess = true;
      }
      
      // Check for any error messages
      if (response.data.error) {
        console.log('⚠️  Error in response:', response.data.error);
        isSuccess = false;
      }
      
      if (response.data.message && response.data.message.includes('template')) {
        console.log('📋 Template-related message:', response.data.message);
      }

      // Log request_id for tracking if available
      if (response.data.request_id) {
        console.log(`📊 Request ID: ${response.data.request_id}`);
        console.log(`📊 Status tracking URL: https://goshort.in/api/broadcast_status.php?request_id=${response.data.request_id}`);
        
        // For high response status codes, consider it successful even without explicit success flag
        if (response.status === 200 || response.status === 201) {
          isSuccess = true;
        }
      }
    }

    // If we have a 200 response but no explicit success indicator, consider it successful
    if (response.status === 200 && response.data && !response.data.error) {
      isSuccess = true;
    }

    if (isSuccess) {
      console.log('\n🎉 WhatsApp OTP sent successfully!');
      console.log('📱 Expected message format: "' + otp + 'is your verification code."');
      
      // Return success with additional info
      return true;
    } else {
      console.log('❌ WhatsApp OTP sending may have failed - check response above');
      return false;
    }

  } catch (error: any) {
    console.error('\n❌ WhatsApp OTP sending failed:');
    console.error('[ERROR] Error:', error.message);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('[ERROR] Status:', error.response.status);
      console.error('[ERROR] Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Enhanced error analysis
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

      if (responseStr.includes('auth') || responseStr.includes('token')) {
        console.log('\n🔑 ⚠️  This appears to be an authentication error!');
        console.log('Possible solutions:');
        console.log('1. Verify WHATSAPP_API_TOKEN is correct');
        console.log('2. Check if token has expired');
        console.log('3. Verify API endpoint URL is correct');
      }
    }
    
    return false;
  }
};

/**
 * Send credentials via WhatsApp when admin creates exhibitor
 */
export const sendCredentialsViaWhatsApp = async (
  phoneNumber: string,
  companyName: string,
  email: string,
  password: string
): Promise<boolean> => {
  console.log(`[DEBUG] ============ sendCredentialsViaWhatsApp CALLED ============`);
  console.log(`[DEBUG] Phone: ${phoneNumber}, Company: ${companyName}, Email: ${email}`);
  
  try {
    if (!whatsappApiUrl || !whatsappApiToken) {
      console.error('[ERROR] WhatsApp API configuration missing');
      throw new Error('WhatsApp API configuration missing');
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    console.log(`[INFO] Sending WhatsApp credentials to: ${formattedPhone}`);

    // Prepare JSON payload for credentials template
    const templatePayload = {
      message: "Exhibitor account credentials",
      brodcast_service: "whatsapp_credits",
      broadcast_name: `exhibitor_credentials_${Date.now()}`,
      template_id: "exhibitor_credentials", // Template to be approved
      schedule_date: new Date().toISOString().split('T')[0],
      schedule_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      contacts: formattedPhone,
      // Template parameters for credentials
      attribute2: companyName || 'Exhibitor',        // {{1}} - Company name
      attribute3: email,                             // {{2}} - Email/Username
      attribute4: password,                          // {{3}} - Password
      attribute5: process.env.FRONTEND_URL || 'https://portal.aakarexhibition.com'  // {{4}} - Login URL
    };

    console.log(`[DEBUG] WhatsApp credentials template payload:`, templatePayload);

    // Send template message
    const response = await axios.post(
      `${whatsappApiUrl}/v5/api/index.php/addbroadcast`,
      templatePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': whatsappApiToken
        }
      }
    );

    console.log(`[INFO] WhatsApp credentials API response:`, response.data);
    
    // Enhanced success detection for credentials
    let isSuccess = false;
    if (response.data) {
      if (response.data.success || response.data.status === 'success' || response.status === 200) {
        isSuccess = true;
      }
      
      if (response.data.request_id) {
        console.log(`[INFO] WhatsApp Credentials Request ID: ${response.data.request_id}`);
        isSuccess = true; // Having request_id usually indicates successful submission
      }
    }

    if (isSuccess) {
      console.log('🎉 WhatsApp credentials sent successfully!');
      return true;
    } else {
      console.log('❌ WhatsApp credentials sending may have failed');
      return false;
    }

  } catch (error: any) {
    console.error('[ERROR] Failed to send credentials via WhatsApp:', error);
    if (axios.isAxiosError(error)) {
      console.error('[ERROR] Response data:', error.response?.data);
      console.error('[ERROR] Response status:', error.response?.status);
    }
    return false;
  }
};

export default {
  sendOTPViaWhatsApp,
  sendCredentialsViaWhatsApp
}; 