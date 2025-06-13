import { Request, Response } from 'express';
import {
  sendLettersForExhibition,
  getExhibitionLetters,
  getLetterStatistics,
  generateLetterContent,
  createLetterRecord,
  sendLetterEmail
} from '../services/exhibitionLetter.service';
import { getUpcomingLetterSchedules } from '../services/letterScheduler.service';
import { generateLetterPDFFromRecord, createLetterFilename } from '../services/letterPdf.service';
import ExhibitionLetter from '../models/exhibitionLetter.model';
import Exhibition from '../models/exhibition.model';
import mongoose from 'mongoose';

/**
 * Send letters manually for an exhibition
 */
export const sendLettersManually = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { letterType } = req.body;

    // Validate inputs
    if (!exhibitionId || !mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    if (!letterType || !['standPossession', 'transport'].includes(letterType)) {
      return res.status(400).json({ message: 'Invalid letter type. Must be "standPossession" or "transport"' });
    }

    // Check if exhibition exists
    const exhibition = await Exhibition.findById(exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    // Check if letter type is enabled
    const letterConfig = letterType === 'standPossession' 
      ? exhibition.letterSettings?.standPossessionLetter
      : exhibition.letterSettings?.transportLetter;

    if (!letterConfig || !letterConfig.isEnabled) {
      return res.status(400).json({ 
        message: `${letterType} letter is not enabled for this exhibition` 
      });
    }

    // Send letters
    const result = await sendLettersForExhibition(
      exhibitionId,
      letterType,
      'manual',
      req.user?._id?.toString()
    );

    res.json({
      message: `${letterType} letters sent successfully`,
      result
    });
  } catch (error) {
    console.error('Error sending letters manually:', error);
    res.status(500).json({ 
      message: 'Error sending letters', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Get letters for an exhibition with pagination and filtering
 */
export const getLetters = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      letterType, 
      status, 
      search 
    } = req.query;

    // Validate exhibition ID
    if (!exhibitionId || !mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    // Get letters
    const result = await getExhibitionLetters(exhibitionId, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      letterType: letterType as 'standPossession' | 'transport',
      status: status as string,
      search: search as string
    });

    res.json(result);
  } catch (error) {
    console.error('Error getting letters:', error);
    res.status(500).json({ 
      message: 'Error getting letters', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Get letter statistics for an exhibition
 */
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;

    // Validate exhibition ID
    if (!exhibitionId || !mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    // Get statistics
    const stats = await getLetterStatistics(exhibitionId);

    res.json(stats);
  } catch (error) {
    console.error('Error getting letter statistics:', error);
    res.status(500).json({ 
      message: 'Error getting letter statistics', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Preview letter content before sending
 */
export const previewLetter = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, bookingId } = req.params;
    const { letterType } = req.query;

    // Validate inputs
    if (!exhibitionId || !mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    if (!letterType || !['standPossession', 'transport'].includes(letterType as string)) {
      return res.status(400).json({ message: 'Invalid letter type' });
    }

    // Generate letter content
    const letterContent = await generateLetterContent(
      exhibitionId,
      bookingId,
      letterType as 'standPossession' | 'transport'
    );

    res.json(letterContent);
  } catch (error) {
    console.error('Error previewing letter:', error);
    res.status(500).json({ 
      message: 'Error previewing letter', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Resend a failed letter
 */
export const resendLetter = async (req: Request, res: Response) => {
  try {
    const { letterId } = req.params;

    // Validate letter ID
    if (!letterId || !mongoose.Types.ObjectId.isValid(letterId)) {
      return res.status(400).json({ message: 'Invalid letter ID' });
    }

    // Check if letter exists
    const letter = await ExhibitionLetter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    // Only allow resending failed letters
    if (letter.status !== 'failed') {
      return res.status(400).json({ 
        message: 'Only failed letters can be resent' 
      });
    }

    // Reset letter status
    letter.status = 'pending';
    letter.failureReason = undefined;
    await letter.save();

    // Resend letter
    const success = await sendLetterEmail(letterId);

    if (success) {
      res.json({ message: 'Letter resent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to resend letter' });
    }
  } catch (error) {
    console.error('Error resending letter:', error);
    res.status(500).json({ 
      message: 'Error resending letter', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Get upcoming letter schedules
 */
export const getUpcomingSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await getUpcomingLetterSchedules();
    res.json(schedules);
  } catch (error) {
    console.error('Error getting upcoming schedules:', error);
    res.status(500).json({ 
      message: 'Error getting upcoming schedules', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Delete a letter record
 */
export const deleteLetter = async (req: Request, res: Response) => {
  try {
    const { letterId } = req.params;

    // Validate letter ID
    if (!letterId || !mongoose.Types.ObjectId.isValid(letterId)) {
      return res.status(400).json({ message: 'Invalid letter ID' });
    }

    // Check if letter exists
    const letter = await ExhibitionLetter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    // Only allow deleting failed or pending letters
    if (!['failed', 'pending'].includes(letter.status)) {
      return res.status(400).json({ 
        message: 'Only failed or pending letters can be deleted' 
      });
    }

    // Delete letter
    await ExhibitionLetter.findByIdAndDelete(letterId);

    res.json({ message: 'Letter deleted successfully' });
  } catch (error) {
    console.error('Error deleting letter:', error);
    res.status(500).json({ 
      message: 'Error deleting letter', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Get letter details by ID
 */
export const getLetterById = async (req: Request, res: Response) => {
  try {
    const { letterId } = req.params;

    // Validate letter ID
    if (!letterId || !mongoose.Types.ObjectId.isValid(letterId)) {
      return res.status(400).json({ message: 'Invalid letter ID' });
    }

    // Get letter with populated data
    const letter = await ExhibitionLetter.findById(letterId)
      .populate('exhibitionId', 'name venue startDate endDate')
      .populate('bookingId', 'customerName companyName customerEmail customerPhone')
      .populate('exhibitorId', 'contactPerson companyName email phone')
      .populate('sentBy', 'username');

    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    res.json(letter);
  } catch (error) {
    console.error('Error getting letter details:', error);
    res.status(500).json({ 
      message: 'Error getting letter details', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Download letter as PDF
 */
export const downloadLetterPDF = async (req: Request, res: Response) => {
  try {
    const { letterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(letterId)) {
      return res.status(400).json({ message: 'Invalid letter ID' });
    }

    const letter = await ExhibitionLetter.findById(letterId)
      .populate('exhibitionId');

    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    // Generate PDF
    const pdfBuffer = await generateLetterPDFFromRecord(letter);

    // Create filename
    const exhibition = letter.exhibitionId as any;
    const filename = createLetterFilename(
      letter.letterType,
      letter.companyName,
      exhibition?.name || 'Exhibition'
    );

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Send the PDF
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error downloading letter PDF:', error);
    res.status(500).json({ 
      message: 'Error generating letter PDF', 
      error: error.message 
    });
  }
}; 