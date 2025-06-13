import ExhibitionLetter, { IExhibitionLetter } from '../models/exhibitionLetter.model';
import Exhibition from '../models/exhibition.model';
import Booking from '../models/booking.model';
import Exhibitor from '../models/exhibitor.model';
import Stall from '../models/stall.model';
import { getEmailTransporter } from '../config/email.config';
import { generateLetterPDF, createLetterFilename } from './letterPdf.service';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';

/**
 * Template variable replacement utility
 */
const replaceTemplateVariables = (template: string, variables: Record<string, string>): string => {
  let processedTemplate = template;
  
  // Replace all variables in the format {{VARIABLE_NAME}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processedTemplate = processedTemplate.replace(regex, value || '');
  });
  
  return processedTemplate;
};

/**
 * Generate letter content from template
 */
export const generateLetterContent = async (
  exhibitionId: string,
  bookingId: string,
  letterType: 'standPossession' | 'transport'
): Promise<{ subject: string; content: string; variables: Record<string, string> }> => {
  try {
    // Get exhibition with letter settings
    const exhibition = await Exhibition.findById(exhibitionId);
    if (!exhibition) {
      throw new Error('Exhibition not found');
    }

    // Get booking with populated data
    const booking = await Booking.findById(bookingId)
      .populate('exhibitorId')
      .populate('stallIds');
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Get stall details
    const stalls = await Stall.find({ _id: { $in: booking.stallIds } });
    const stallNumbers = stalls.map(stall => stall.number).join(', ');

    // Prepare template variables
    const variables = {
      COMPANY_NAME: booking.companyName || '',
      CUSTOMER_NAME: booking.customerName || '',
      REPRESENTATIVE_NAME: booking.customerName || '', // Same as customer name as per requirement
      STALL_NO: stallNumbers,
      MOBILE: booking.customerPhone || '',
      EMAIL: booking.customerEmail || '',
      EXHIBITION_NAME: exhibition.name || '',
      EXHIBITION_VENUE: exhibition.venue || '',
      EXHIBITION_START_DATE: exhibition.startDate ? new Date(exhibition.startDate).toLocaleDateString() : '',
      EXHIBITION_END_DATE: exhibition.endDate ? new Date(exhibition.endDate).toLocaleDateString() : '',
      CURRENT_DATE: new Date().toLocaleDateString(),
    };

    // Get letter template based on type
    const letterConfig = letterType === 'standPossession' 
      ? exhibition.letterSettings?.standPossessionLetter
      : exhibition.letterSettings?.transportLetter;

    if (!letterConfig || !letterConfig.isEnabled) {
      throw new Error(`${letterType} letter is not enabled for this exhibition`);
    }

    if (!letterConfig.template || !letterConfig.subject) {
      throw new Error(`${letterType} letter template or subject is not configured`);
    }

    // Process template
    const subject = replaceTemplateVariables(letterConfig.subject, variables);
    const content = replaceTemplateVariables(letterConfig.template, variables);

    return { subject, content, variables };
  } catch (error) {
    console.error('Error generating letter content:', error);
    throw error;
  }
};

/**
 * Create letter record in database
 */
export const createLetterRecord = async (
  exhibitionId: string,
  bookingId: string,
  letterType: 'standPossession' | 'transport',
  sendingMethod: 'automatic' | 'manual',
  sentBy?: string,
  scheduledFor?: Date
): Promise<IExhibitionLetter> => {
  try {
    // Generate letter content
    const { subject, content } = await generateLetterContent(exhibitionId, bookingId, letterType);

    // Get booking and exhibitor details
    const booking = await Booking.findById(bookingId).populate('exhibitorId');
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Get stall numbers
    const stalls = await Stall.find({ _id: { $in: booking.stallIds } });
    const stallNumbers = stalls.map(stall => stall.number);

    // Create letter record
    const letter = new ExhibitionLetter({
      exhibitionId,
      bookingId,
      exhibitorId: booking.exhibitorId,
      letterType,
      subject,
      content,
      recipientEmail: booking.customerEmail,
      recipientName: booking.customerName,
      companyName: booking.companyName,
      stallNumbers,
      sendingMethod,
      sentBy: sentBy ? new mongoose.Types.ObjectId(sentBy) : undefined,
      status: scheduledFor ? 'scheduled' : 'pending',
      scheduledFor,
    });

    await letter.save();
    return letter;
  } catch (error) {
    console.error('Error creating letter record:', error);
    throw error;
  }
};

/**
 * Send letter via email with PDF attachment
 */
export const sendLetterEmail = async (letterId: string): Promise<boolean> => {
  let tempFilePath = '';
  try {
    const letter = await ExhibitionLetter.findById(letterId);
    if (!letter) {
      throw new Error('Letter not found');
    }

    if (letter.status === 'sent') {
      console.log(`Letter ${letterId} already sent`);
      return true;
    }

    // Get related data for PDF generation
    const exhibition = await Exhibition.findById(letter.exhibitionId);
    const booking = await Booking.findById(letter.bookingId)
      .populate('stallIds')
      .populate('exhibitionId');
    const exhibitor = await Exhibitor.findById(letter.exhibitorId);

    if (!exhibition || !booking || !exhibitor) {
      throw new Error('Missing required data for PDF generation');
    }

    // Generate PDF
    console.log(`[INFO] Generating PDF for letter ${letterId}`);
    const pdfBuffer = await generateLetterPDF(
      exhibition,
      booking,
      exhibitor,
      letter.letterType,
      letter.content,
      letter.stallNumbers
    );

    // Create temp directory if it doesn't exist
    const tempDir = join(process.cwd(), 'temp');
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }

    // Create temporary file for PDF attachment
    const filename = createLetterFilename(
      letter.letterType,
      letter.companyName,
      exhibition.name
    );
    const timestamp = Date.now();
    tempFilePath = join(tempDir, `temp-${timestamp}-${filename}`);
    
    // Write PDF to temporary file
    writeFileSync(tempFilePath, pdfBuffer);
    console.log(`[INFO] PDF written to temporary file: ${tempFilePath}`);

    // Get email transporter
    const { transporter, isTestMode, getTestMessageUrl } = await getEmailTransporter();

    // Send email with PDF attachment
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER || '"Exhibition Management" <no-reply@exhibition-management.com>',
      to: letter.recipientEmail,
      subject: letter.subject,
      text: letter.content,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="white-space: pre-line; font-size: 16px; line-height: 1.6;">
            ${letter.content.replace(/\n/g, '<br>')}
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 14px; color: #777; margin: 0;">
            This is an automated message from the Exhibition Management System.<br>
            Please find the attached letter for your records.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          path: tempFilePath,
        },
      ],
    });

    // Clean up temporary file
    if (existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
      console.log(`[INFO] Cleaned up temporary file: ${tempFilePath}`);
    }

    // Update letter status
    letter.status = 'sent';
    letter.sentAt = new Date();
    letter.emailMessageId = info.messageId;
    letter.isTestMode = isTestMode;
    await letter.save();

    // Log test message URL if in test mode
    if (isTestMode && getTestMessageUrl) {
      console.log(`Letter sent in test mode. Preview URL: ${getTestMessageUrl(info)}`);
    }

    console.log(`Letter ${letterId} sent successfully with PDF to ${letter.recipientEmail}`);
    return true;
  } catch (error) {
    console.error(`Error sending letter ${letterId}:`, error);
    
    // Clean up temporary file on error
    if (tempFilePath && existsSync(tempFilePath)) {
      try {
        unlinkSync(tempFilePath);
        console.log(`[INFO] Cleaned up temporary file after error: ${tempFilePath}`);
      } catch (cleanupError) {
        console.error('[ERROR] Failed to clean up temporary file:', cleanupError);
      }
    }
    
    // Update letter with failure status
    try {
      const letter = await ExhibitionLetter.findById(letterId);
      if (letter) {
        letter.status = 'failed';
        letter.failureReason = error instanceof Error ? error.message : 'Unknown error';
        letter.retryCount += 1;
        await letter.save();
      }
    } catch (updateError) {
      console.error('Error updating letter failure status:', updateError);
    }
    
    return false;
  }
};

/**
 * Send letters for a specific exhibition and letter type
 */
export const sendLettersForExhibition = async (
  exhibitionId: string,
  letterType: 'standPossession' | 'transport',
  sendingMethod: 'automatic' | 'manual',
  sentBy?: string
): Promise<{ sent: number; failed: number; total: number }> => {
  try {
    console.log(`Starting ${letterType} letter sending for exhibition ${exhibitionId}`);

    // Get all confirmed/approved bookings for this exhibition
    const bookings = await Booking.find({
      exhibitionId,
      status: { $in: ['confirmed', 'approved'] }
    }).populate('exhibitorId');

    if (bookings.length === 0) {
      console.log(`No confirmed bookings found for exhibition ${exhibitionId}`);
      return { sent: 0, failed: 0, total: 0 };
    }

    let sentCount = 0;
    let failedCount = 0;

    // Process each booking
    for (const booking of bookings) {
      try {
        // Check if letter already exists for this booking and type
        const existingLetter = await ExhibitionLetter.findOne({
          bookingId: booking._id,
          letterType,
          status: 'sent'
        });

        if (existingLetter) {
          console.log(`${letterType} letter already sent for booking ${booking._id}`);
          continue;
        }

        // Create and send letter
        const letter = await createLetterRecord(
          exhibitionId,
          booking._id.toString(),
          letterType,
          sendingMethod,
          sentBy
        );

        const success = await sendLetterEmail(letter._id.toString());
        if (success) {
          sentCount++;
        } else {
          failedCount++;
        }
      } catch (bookingError) {
        console.error(`Error processing booking ${booking._id}:`, bookingError);
        failedCount++;
      }
    }

    console.log(`${letterType} letter sending completed for exhibition ${exhibitionId}. Sent: ${sentCount}, Failed: ${failedCount}, Total: ${bookings.length}`);
    return { sent: sentCount, failed: failedCount, total: bookings.length };
  } catch (error) {
    console.error(`Error sending letters for exhibition ${exhibitionId}:`, error);
    throw error;
  }
};

/**
 * Get letters for an exhibition with pagination and filtering
 */
export const getExhibitionLetters = async (
  exhibitionId: string,
  options: {
    page?: number;
    limit?: number;
    letterType?: 'standPossession' | 'transport';
    status?: string;
    search?: string;
  } = {}
) => {
  try {
    const {
      page = 1,
      limit = 10,
      letterType,
      status,
      search
    } = options;

    // Build query
    const query: any = { exhibitionId };
    
    if (letterType) {
      query.letterType = letterType;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { recipientName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { recipientEmail: { $regex: search, $options: 'i' } },
        { stallNumbers: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [letters, total] = await Promise.all([
      ExhibitionLetter.find(query)
        .populate('bookingId', 'customerName companyName')
        .populate('exhibitorId', 'contactPerson companyName')
        .populate('sentBy', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ExhibitionLetter.countDocuments(query)
    ]);

    return {
      letters,
      pagination: {
        current: page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting exhibition letters:', error);
    throw error;
  }
};

/**
 * Get letter statistics for an exhibition
 */
export const getLetterStatistics = async (exhibitionId: string) => {
  try {
    const [
      standPossessionStats,
      transportStats,
      totalBookings
    ] = await Promise.all([
      ExhibitionLetter.aggregate([
        { $match: { exhibitionId: new mongoose.Types.ObjectId(exhibitionId), letterType: 'standPossession' } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      ExhibitionLetter.aggregate([
        { $match: { exhibitionId: new mongoose.Types.ObjectId(exhibitionId), letterType: 'transport' } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Booking.countDocuments({
        exhibitionId,
        status: { $in: ['confirmed', 'approved'] }
      })
    ]);

    // Process statistics
    const processStats = (stats: any[]) => {
      const result = { sent: 0, pending: 0, failed: 0, scheduled: 0 };
      stats.forEach(stat => {
        if (stat._id in result) {
          result[stat._id as keyof typeof result] = stat.count;
        }
      });
      return result;
    };

    return {
      standPossession: processStats(standPossessionStats),
      transport: processStats(transportStats),
      totalEligibleBookings: totalBookings
    };
  } catch (error) {
    console.error('Error getting letter statistics:', error);
    throw error;
  }
}; 