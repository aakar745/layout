import express from 'express';
import {
  sendLettersManually,
  getLetters,
  getStatistics,
  previewLetter,
  resendLetter,
  resendBothLetters,
  getUpcomingSchedules,
  deleteLetter,
  bulkDeleteLetters,
  cleanOldLetters,
  getLetterById,
  downloadLetterPDF
} from '../controllers/exhibitionLetter.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route POST /api/exhibition-letters/:exhibitionId/send
 * @desc Send letters manually for an exhibition
 * @access Private (Admin)
 * @body { letterType: 'standPossession' | 'transport' }
 */
router.post('/:exhibitionId/send', sendLettersManually);

/**
 * @route GET /api/exhibition-letters/:exhibitionId
 * @desc Get letters for an exhibition with pagination and filtering
 * @access Private (Admin)
 * @query page, limit, letterType, status, search
 */
router.get('/:exhibitionId', getLetters);

/**
 * @route GET /api/exhibition-letters/:exhibitionId/statistics
 * @desc Get letter statistics for an exhibition
 * @access Private (Admin)
 */
router.get('/:exhibitionId/statistics', getStatistics);

/**
 * @route GET /api/exhibition-letters/:exhibitionId/preview/:bookingId
 * @desc Preview letter content before sending
 * @access Private (Admin)
 * @query letterType
 */
router.get('/:exhibitionId/preview/:bookingId', previewLetter);

/**
 * @route GET /api/exhibition-letters/schedules/upcoming
 * @desc Get upcoming letter schedules
 * @access Private (Admin)
 */
router.get('/schedules/upcoming', getUpcomingSchedules);

/**
 * @route GET /api/exhibition-letters/letter/:letterId
 * @desc Get letter details by ID
 * @access Private (Admin)
 */
router.get('/letter/:letterId', getLetterById);

/**
 * @route POST /api/exhibition-letters/letter/:letterId/resend
 * @desc Resend a failed letter
 * @access Private (Admin)
 */
router.post('/letter/:letterId/resend', resendLetter);

/**
 * @route POST /api/exhibition-letters/:exhibitionId/resend-both/:bookingId
 * @desc Resend specific letter types for a booking
 * @access Private (Admin)
 * @body { letterTypes: ['standPossession', 'transport'] } // Array of letter types to send
 */
router.post('/:exhibitionId/resend-both/:bookingId', resendBothLetters);

/**
 * @route DELETE /api/exhibition-letters/letter/:letterId
 * @desc Delete a letter record
 * @access Private (Admin)
 * @query force - Set to 'true' to force delete sent letters
 */
router.delete('/letter/:letterId', deleteLetter);

/**
 * @route POST /api/exhibition-letters/:exhibitionId/bulk-delete
 * @desc Bulk delete letters for an exhibition
 * @access Private (Admin)
 * @body { status: string[], letterType?: string, olderThanDays?: number, force?: boolean }
 */
router.post('/:exhibitionId/bulk-delete', bulkDeleteLetters);

/**
 * @route POST /api/exhibition-letters/:exhibitionId/clean-old
 * @desc Clean old letters (convenience endpoint)
 * @access Private (Admin)
 * @body { daysOld?: number, includeSent?: boolean }
 */
router.post('/:exhibitionId/clean-old', cleanOldLetters);

/**
 * @route GET /api/exhibition-letters/letter/:letterId/download
 * @desc Download letter as PDF
 * @access Private (Admin)
 */
router.get('/letter/:letterId/download', downloadLetterPDF);

export default router; 