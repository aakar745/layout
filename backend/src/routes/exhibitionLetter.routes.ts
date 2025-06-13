import express from 'express';
import {
  sendLettersManually,
  getLetters,
  getStatistics,
  previewLetter,
  resendLetter,
  getUpcomingSchedules,
  deleteLetter,
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
 * @route DELETE /api/exhibition-letters/letter/:letterId
 * @desc Delete a letter record
 * @access Private (Admin)
 */
router.delete('/letter/:letterId', deleteLetter);

/**
 * @route GET /api/exhibition-letters/letter/:letterId/download
 * @desc Download letter as PDF
 * @access Private (Admin)
 */
router.get('/letter/:letterId/download', downloadLetterPDF);

export default router; 