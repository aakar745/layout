import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { 
  syncPhonePeTransaction, 
  detectMissingTransactions, 
  bulkSyncTransactions 
} from '../controllers/sync.controller';

const router = express.Router();

/**
 * PhonePe Transaction Sync Routes - 2025 Enhanced
 * These routes require admin authentication
 */

// Sync a specific transaction by receipt number or PhonePe transaction ID
router.post('/phonepe/transaction', protect, syncPhonePeTransaction);

// Detect missing transactions by scanning receipt number gaps
router.post('/phonepe/detect-missing', protect, detectMissingTransactions);

// Bulk sync multiple transactions
router.post('/phonepe/bulk-sync', protect, bulkSyncTransactions);

export default router;
