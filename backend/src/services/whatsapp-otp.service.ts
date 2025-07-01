/**
 * WhatsApp OTP Service
 * 
 * Handles sending OTP via WhatsApp using Business API templates
 * Integrates with existing OTP verification system
 */

import axios from 'axios';

// WhatsApp configuration
const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;

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
    if (!whatsappApiUrl || !whatsappApiToken) {
      throw new Error('WhatsApp API configuration missing');
    }

    // Clean phone number format (remove + and spaces, handle country code)
    const cleanPhoneNumber = phoneNumber.replace(/[\s+\-]/g, '');
    const formattedPhone = cleanPhoneNumber.startsWith('91') ? 
      cleanPhoneNumber.substring(2) : cleanPhoneNumber;

    console.log(`[INFO] Sending WhatsApp OTP to: ${formattedPhone}`);

    // Prepare JSON payload for OTP template (NEW APPROVED VERSION)
    const templatePayload = {
      message: "OTP verification for exhibitor registration",
      brodcast_service: "whatsapp_credits",
      broadcast_name: `exhibitor_otp_${Date.now()}`,
      template_id: "aakarnew27", // ✅ NEW APPROVED TEMPLATE
      schedule_date: new Date().toISOString().split('T')[0],
      schedule_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      contacts: formattedPhone,
      // Template parameters for approved template (text-only, no header, no buttons)
      // Template body: "{{1}}is your verification code."
      // API maps attribute2 to {{1}}, attribute3 to {{2}}, etc.
      attribute2: otp  // {{1}} - OTP code only
    };

    console.log(`[DEBUG] WhatsApp OTP template payload:`, templatePayload);

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

    console.log(`[INFO] WhatsApp OTP sent successfully:`, response.data);
    
    // Log request_id for tracking
    if (response.data && response.data.request_id) {
      console.log(`[INFO] WhatsApp OTP Request ID: ${response.data.request_id}`);
      console.log(`[INFO] Status tracking URL: https://goshort.in/api/broadcast_status.php?request_id=${response.data.request_id}`);
    }

    return true;
  } catch (error) {
    console.error('[ERROR] Failed to send OTP via WhatsApp:', error);
    if (axios.isAxiosError(error)) {
      console.error('[ERROR] Response data:', error.response?.data);
      console.error('[ERROR] Response status:', error.response?.status);
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
      throw new Error('WhatsApp API configuration missing');
    }

    // Clean phone number format
    const cleanPhoneNumber = phoneNumber.replace(/[\s+\-]/g, '');
    const formattedPhone = cleanPhoneNumber.startsWith('91') ? 
      cleanPhoneNumber.substring(2) : cleanPhoneNumber;

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

    console.log(`[INFO] WhatsApp credentials sent successfully:`, response.data);
    
    if (response.data && response.data.request_id) {
      console.log(`[INFO] WhatsApp Credentials Request ID: ${response.data.request_id}`);
    }

    return true;
  } catch (error) {
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