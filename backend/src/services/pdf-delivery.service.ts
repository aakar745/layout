/**
 * PDF Delivery Service
 * 
 * Handles the delivery of PDFs via different channels:
 * - Email
 * - WhatsApp
 */

import { Request, Response } from 'express';
import { join } from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import axios from 'axios';
import { getEmailTransporter } from '../config/email.config';

// WhatsApp configuration
const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;

/**
 * Send a PDF via email
 */
export const sendPdfByEmail = async (
  pdfBuffer: Buffer,
  recipientEmail: string,
  subject: string,
  message: string,
  filename: string
): Promise<boolean> => {
  try {
    // Generate a temporary file path
    const tempFilePath = join(process.cwd(), `temp-${filename}.pdf`);
    
    // Write the PDF to a temporary file
    writeFileSync(tempFilePath, pdfBuffer);
    
    // Get the email transporter
    const { transporter, isTestMode, getTestMessageUrl } = await getEmailTransporter();
    
    // Send the email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER || '"Exhibition Management" <no-reply@exhibition-management.com>',
      to: recipientEmail,
      subject: subject,
      text: message,
      attachments: [
        {
          filename: filename,
          path: tempFilePath,
        },
      ],
    });
    
    // Log test message URL if in test mode
    if (isTestMode && getTestMessageUrl) {
      console.log('Preview URL: %s', getTestMessageUrl(info));
    }
    
    // Clean up the temporary file
    unlinkSync(tempFilePath);
    
    return true;
  } catch (error) {
    console.error('[ERROR] Failed to send PDF by email:', error);
    return false;
  }
};

/**
 * Send a PDF via WhatsApp
 */
export const sendPdfByWhatsApp = async (
  pdfBuffer: Buffer,
  phoneNumber: string,
  message: string,
  pdfUrl: string
): Promise<boolean> => {
  try {
    if (!whatsappApiUrl || !whatsappApiToken) {
      throw new Error('WhatsApp API configuration missing');
    }
    
    // Send message with PDF URL
    await axios.post(whatsappApiUrl, {
      phone: phoneNumber,
      message: `${message}: ${pdfUrl}`,
    }, {
      headers: {
        'Authorization': `Bearer ${whatsappApiToken}`
      }
    });
    
    return true;
  } catch (error) {
    console.error('[ERROR] Failed to send PDF by WhatsApp:', error);
    return false;
  }
}; 