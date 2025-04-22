import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Email Configuration
 * 
 * These settings can be configured via environment variables
 * For production, set these in your deployment environment
 */
export const emailConfig = {
  // SMTP settings
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  },
  
  // Default from address
  from: process.env.EMAIL_FROM || '"Exhibition Management" <no-reply@exhibition-management.com>',
  
  // Use test mode if SMTP credentials not provided
  useTestMode: !process.env.SMTP_USER || !process.env.SMTP_PASS,
};

/**
 * Get email sender configuration
 * Returns test configuration if SMTP not configured
 */
export const getEmailTransporter = async () => {
  const nodemailer = require('nodemailer');
  
  // If SMTP credentials are not provided, use ethereal for testing
  if (emailConfig.useTestMode) {
    console.log('SMTP credentials not provided. Using ethereal test account.');
    const testAccount = await nodemailer.createTestAccount();
    
    return {
      transporter: nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      }),
      isTestMode: true,
      getTestMessageUrl: nodemailer.getTestMessageUrl
    };
  }
  
  // Use configured SMTP settings
  return {
    transporter: nodemailer.createTransport({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: {
        user: emailConfig.smtp.auth.user,
        pass: emailConfig.smtp.auth.pass
      }
    }),
    isTestMode: false
  };
};

export default emailConfig; 