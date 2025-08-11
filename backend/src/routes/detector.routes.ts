import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { 
  detectByReceiptGaps,
  detectOrphanedReceipts,
  comprehensiveDetection,
  dailyDetection
} from '../controllers/missingTransactionDetector.controller';

const router = express.Router();

/**
 * Missing Transaction Detection Routes - 2025 Enhanced
 * Proactively find transactions that exist in PhonePe but missing from database
 */

// Detect missing transactions by scanning receipt number gaps
router.post('/receipt-gaps', protect, detectByReceiptGaps);

// Detect orphaned receipts (higher numbers than latest in DB)
router.post('/orphaned-receipts', protect, detectOrphanedReceipts);

// Comprehensive detection (combines all methods)
router.post('/comprehensive', protect, comprehensiveDetection);

// Daily automated detection (for monitoring)
router.get('/daily', protect, dailyDetection);

export default router;
