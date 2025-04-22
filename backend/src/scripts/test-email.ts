import { getEmailTransporter, emailConfig } from '../config/email.config';

/**
 * Simple script to test email sending
 * Run with: npx ts-node src/scripts/test-email.ts
 */
async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Email Config:', {
    host: emailConfig.smtp.host,
    port: emailConfig.smtp.port,
    secure: emailConfig.smtp.secure,
    user: emailConfig.smtp.auth.user,
    from: emailConfig.from,
    useTestMode: emailConfig.useTestMode
  });

  try {
    // Get email transport configuration
    const { transporter, isTestMode, getTestMessageUrl } = await getEmailTransporter();
    
    // Create a test OTP for the message
    const testOTP = '123456';
    
    // Send to the user's own email address for verification
    const testRecipient = 'aakar.modi@gmail.com';
    
    console.log(`Sending test email to ${testRecipient} ${isTestMode ? '(Test Mode)' : '(Real Delivery)'}`);
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: emailConfig.from,
      to: testRecipient,
      subject: 'Test Email - OTP Verification System',
      text: `This is a test email to verify SMTP configuration. Your test code is: ${testOTP}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #333; text-align: center;">Test Email</h1>
          <p style="font-size: 16px; line-height: 1.5;">This is a test email to verify that your SMTP configuration is working correctly.</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${testOTP}</div>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">If you received this email, your email configuration is working correctly!</p>
          <p style="font-size: 14px; color: #777; margin-top: 30px;">This is a test message. No action is required.</p>
        </div>
      `
    });
    
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // If in test mode, show preview URL
    if (isTestMode && getTestMessageUrl) {
      console.log('Preview URL:', getTestMessageUrl(info));
    } else {
      console.log('Email has been sent to the recipient');
    }
    
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Run the test
testEmail(); 