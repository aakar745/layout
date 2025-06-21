/**
 * PDF Delivery Service
 * 
 * Handles the delivery of PDFs via different channels:
 * - Email
 * - WhatsApp
 */

import { Request, Response } from 'express';
import { join } from 'path';
import { writeFileSync, unlinkSync, existsSync, mkdirSync, createReadStream } from 'fs';
import axios from 'axios';
import { getEmailTransporter } from '../config/email.config';

// WhatsApp configuration
const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;

/**
 * Sanitize filename to ensure it's safe for file system operations
 * Replaces characters that are problematic in filenames
 */
const sanitizeFilename = (filename: string): string => {
  // Replace slashes, backslashes, colons, and other invalid filename characters
  return filename.replace(/[\/\\:*?"<>|]/g, '_');
};

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
  let tempFilePath = '';
  try {
    console.log(`[INFO] Attempting to send email to ${recipientEmail} with subject: ${subject}`);
    
    // Create temp directory if it doesn't exist
    const tempDir = join(process.cwd(), 'temp');
    if (!existsSync(tempDir)) {
      console.log(`[DEBUG] Creating temp directory at ${tempDir}`);
      mkdirSync(tempDir, { recursive: true });
    }
    
    // Sanitize filename to avoid path issues
    const safeFilename = sanitizeFilename(filename);
    console.log(`[DEBUG] Original filename: ${filename}, Sanitized: ${safeFilename}`);
    
    // Generate a temporary file path with unique identifier
    const timestamp = Date.now();
    tempFilePath = join(tempDir, `temp-${timestamp}-${safeFilename}`);
    
    console.log(`[DEBUG] Writing PDF to temporary file: ${tempFilePath}`);
    
    // Write the PDF to a temporary file
    writeFileSync(tempFilePath, pdfBuffer);
    console.log(`[DEBUG] Successfully wrote ${pdfBuffer.length} bytes to temporary file`);
    
    // Get the email transporter
    console.log(`[DEBUG] Getting email transporter`);
    const { transporter, isTestMode, getTestMessageUrl } = await getEmailTransporter();
    
    // Log email configuration (without sensitive details)
    console.log(`[DEBUG] Email mode: ${isTestMode ? 'Test' : 'Production'}`);
    console.log(`[DEBUG] SMTP Host: ${process.env.SMTP_HOST || 'Not configured'}`);
    
    // Send the email
    console.log(`[DEBUG] Sending email to: ${recipientEmail}`);
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER || '"Exhibition Management" <no-reply@exhibition-management.com>',
      to: recipientEmail,
      subject: subject,
      text: message,
      attachments: [
        {
          filename: filename, // Use original filename for email attachment
          path: tempFilePath,
        },
      ],
    });
    
    console.log(`[INFO] Email sent successfully. Message ID: ${info.messageId}`);
    
    // Log test message URL if in test mode
    if (isTestMode && getTestMessageUrl) {
      console.log(`[INFO] Preview URL: ${getTestMessageUrl(info)}`);
    }
    
    // Clean up the temporary file
    console.log(`[DEBUG] Cleaning up temporary file: ${tempFilePath}`);
    unlinkSync(tempFilePath);
    
    return true;
  } catch (error) {
    console.error('[ERROR] Failed to send PDF by email:', error);
    
    // Add more detailed error information
    if (error instanceof Error) {
      console.error(`[ERROR] Error message: ${error.message}`);
      console.error(`[ERROR] Stack trace: ${error.stack}`);
    }
    
    // Check if temp file exists and remove it
    try {
      if (tempFilePath && existsSync(tempFilePath)) {
        console.log(`[DEBUG] Cleaning up temporary file after error: ${tempFilePath}`);
        unlinkSync(tempFilePath);
      }
    } catch (cleanupErr) {
      console.error('[ERROR] Failed to clean up temporary file:', cleanupErr);
    }
    
    return false;
  }
};

/**
 * Send a PDF via WhatsApp using Business Template with PDF attachment
 * Updated to match the working test file approach (JSON payload, direct URL)
 */
export const sendPdfByWhatsApp = async (
  pdfBuffer: Buffer,
  phoneNumber: string,
  templateData: {
    customerName: string;
    exhibitionName: string;
    invoiceNumber: string;
    supportContact: string;
    companyName: string;
  },
  filename: string
): Promise<boolean> => {
  console.log(`[DEBUG] ============ sendPdfByWhatsApp CALLED ============`);
  console.log(`[DEBUG] Phone: ${phoneNumber}, Filename: ${filename}`);
  console.log(`[DEBUG] Template data:`, templateData);
  try {
    if (!whatsappApiUrl || !whatsappApiToken) {
      throw new Error('WhatsApp API configuration missing');
    }

    // Clean phone number format (remove + and spaces, remove country code for this API)
    const cleanPhoneNumber = phoneNumber.replace(/[\s+\-]/g, '');
    const formattedPhone = cleanPhoneNumber.startsWith('91') ? cleanPhoneNumber.substring(2) : cleanPhoneNumber;

    console.log(`[INFO] Sending WhatsApp template to: ${formattedPhone}`);
    console.log(`[DEBUG] PDF buffer size: ${pdfBuffer.length} bytes`);
    console.log(`[DEBUG] Filename: ${filename}`);

    // Create temporary file for PDF access
    const whatsappTempDir = join(process.cwd(), 'temp');
    console.log(`[DEBUG] WhatsApp temp directory: ${whatsappTempDir}`);
    if (!existsSync(whatsappTempDir)) {
      console.log(`[DEBUG] Creating WhatsApp temp directory: ${whatsappTempDir}`);
      mkdirSync(whatsappTempDir, { recursive: true });
    }

    const whatsappTimestamp = Date.now();
    const whatsappTempFilePath = join(whatsappTempDir, `whatsapp-${whatsappTimestamp}-${sanitizeFilename(filename)}`);
    console.log(`[DEBUG] Creating WhatsApp temp file: ${whatsappTempFilePath}`);
    writeFileSync(whatsappTempFilePath, pdfBuffer);
    console.log(`[DEBUG] WhatsApp temp file created successfully, size: ${pdfBuffer.length} bytes`);

    // Create public URL for PDF access
    const baseUrl = process.env.BASE_URL || process.env.BACKEND_URL || 'http://localhost:5000';
    const publicPdfUrl = `${baseUrl}/temp/whatsapp-${whatsappTimestamp}-${sanitizeFilename(filename)}`;
    
    // Create actual download link for the specific invoice (same as the PDF URL)
    const actualDownloadLink = publicPdfUrl;

    // Prepare JSON payload (matching test file approach)
    const templatePayload = {
      message: "Invoice notification",
      brodcast_service: "whatsapp_credits",
      broadcast_name: `invoice_${templateData.invoiceNumber}`,
      template_id: "new_perfoma",
      schedule_date: new Date().toISOString().split('T')[0],
      schedule_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      contacts: formattedPhone,
      // Header document parameter (PDF attachment)
      uploaded_image1: publicPdfUrl,
      // Body text parameters - mapping based on API structure (attribute2 = {{1}}, etc.)
      attribute2: templateData.customerName,    // {{1}} - Customer name
      attribute3: templateData.exhibitionName,  // {{2}} - Event name  
      attribute4: templateData.invoiceNumber,   // {{3}} - Invoice number
      attribute5: templateData.supportContact,  // {{4}} - Support contact
      attribute6: templateData.companyName,     // {{5}} - Company name
      attribute7: actualDownloadLink            // {{6}} - Download link (actual PDF URL)
    };

    console.log(`[DEBUG] Template payload:`, templatePayload);

    // Send template message using JSON payload (not FormData)
    const templateResponse = await axios.post(
      `${whatsappApiUrl}/v5/api/index.php/addbroadcast`,
      templatePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': whatsappApiToken
        }
      }
    );

    console.log(`[INFO] Template message sent successfully:`, templateResponse.data);
    
    // Log request_id for tracking
    if (templateResponse.data && templateResponse.data.request_id) {
      console.log(`[INFO] WhatsApp Request ID: ${templateResponse.data.request_id}`);
      console.log(`[INFO] Status tracking URL: https://goshort.in/api/broadcast_status.php?request_id=${templateResponse.data.request_id}`);
    }

    // Schedule file cleanup after WhatsApp API has time to fetch it
    // Use a longer delay to ensure WhatsApp API has enough time to fetch the PDF
    setTimeout(() => {
      try {
        if (existsSync(whatsappTempFilePath)) {
          unlinkSync(whatsappTempFilePath);
          console.log(`[INFO] Cleaned up WhatsApp temporary file after delay: ${whatsappTempFilePath}`);
        }
      } catch (cleanupErr) {
        console.error('[ERROR] Failed to clean up WhatsApp temporary file after delay:', cleanupErr);
      }
    }, 300000); // Wait 5 minutes before cleanup (increased from 30 seconds)
    
    console.log(`[INFO] WhatsApp PDF will be cleaned up in 5 minutes: ${whatsappTempFilePath}`);

    // Template with document header should be sufficient

    return true;
  } catch (error) {
    console.error('[ERROR] Failed to send PDF by WhatsApp:', error);
    if (axios.isAxiosError(error)) {
      console.error('[ERROR] Response data:', error.response?.data);
      console.error('[ERROR] Response status:', error.response?.status);
    }
    
    // Clean up temporary file on error
    try {
      const whatsappTimestamp = Date.now();
      const errorTempFilePath = join(process.cwd(), 'temp', `whatsapp-${whatsappTimestamp}-${sanitizeFilename(filename)}`);
      if (existsSync(errorTempFilePath)) {
        unlinkSync(errorTempFilePath);
        console.log(`[INFO] Cleaned up WhatsApp temporary file after error: ${errorTempFilePath}`);
      }
    } catch (cleanupErr) {
      console.error('[ERROR] Failed to clean up WhatsApp temporary file after error:', cleanupErr);
    }
    
    return false;
  }
}; 