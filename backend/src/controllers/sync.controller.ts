import { Request, Response } from 'express';
import ServiceCharge from '../models/serviceCharge.model';
import { phonePeService } from '../services/phonepe.service';

/**
 * Simplified sync function - only checks PhonePe status, doesn't create or update records
 * Enhanced for 2025 compliance - handles ALL transaction states properly
 * Handles ALL transaction states: COMPLETED, FAILED, PENDING, INITIATED, PROCESSING
 */
export const syncPhonePeTransaction = async (req: Request, res: Response) => {
  console.log('🔄 [SYNC] ===== PHONEPE TRANSACTION STATUS CHECK STARTED =====');
  console.log('🔄 [SYNC] Timestamp:', new Date().toISOString());
  
  try {
    const { receiptNumber, phonePeTransactionId } = req.body;

    if (!receiptNumber && !phonePeTransactionId) {
      return res.status(400).json({
        success: false,
        message: 'Either receiptNumber or phonePeTransactionId is required'
      });
    }

    console.log('📝 [SYNC] Request data:', {
      receiptNumber: receiptNumber || 'Not provided',
      phonePeTransactionId: phonePeTransactionId || 'Not provided'
    });

    // Use receiptNumber as merchantTransactionId if provided, otherwise use phonePeTransactionId
    const merchantTransactionId = receiptNumber || phonePeTransactionId;

    console.log('🔍 [SYNC] Checking PhonePe status for:', merchantTransactionId);

    // Get status from PhonePe
    const phonePeResponse = await phonePeService.getOrderStatus(merchantTransactionId);
    
    if (!phonePeResponse.success) {
      console.log('❌ [SYNC] PhonePe API call failed:', phonePeResponse.message);
      return res.status(400).json({
        success: false,
        message: phonePeResponse.message || 'Failed to get status from PhonePe'
      });
    }

    const phonePeData = phonePeResponse.data;
    
    if (!phonePeData) {
      console.log('❌ [SYNC] No data returned from PhonePe');
      return res.status(400).json({
        success: false,
        message: 'No transaction data returned from PhonePe'
      });
    }
    
    console.log('📋 [SYNC] PhonePe response data:', {
      merchantTransactionId: phonePeData.merchantTransactionId,
      transactionId: phonePeData.transactionId,
      amount: phonePeData.amount,
      state: phonePeData.state,
      responseCode: phonePeData.responseCode
    });

    console.log('🔍 [SYNC] Checking if service charge exists in database...');
    
    // Check if service charge exists in our database
    const serviceCharge = await ServiceCharge.findOne({
      $or: [
        { phonePeMerchantTransactionId: merchantTransactionId },
        { receiptNumber: merchantTransactionId },
        { phonePeTransactionId: phonePeData.transactionId }
      ]
    }).populate('exhibitionId', 'name venue');

    if (serviceCharge) {
      console.log('✅ [SYNC] Found existing service charge:', {
        id: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        currentPaymentStatus: serviceCharge.paymentStatus,
        currentStatus: serviceCharge.status
      });
      
      // Return PhonePe status as primary status
      return res.json({
        success: true,
        message: `PhonePe Status: ${phonePeData.state}`,
        data: {
          receiptNumber: serviceCharge.receiptNumber,
          amount: phonePeData.amount, // Use PhonePe amount (already in paise)
          currentStatus: phonePeData.state, // Show PhonePe status as primary
          localStatus: serviceCharge.paymentStatus, // Show local status for reference
          phonePeTransactionId: phonePeData.transactionId,
          merchantTransactionId: phonePeData.merchantTransactionId,
          paymentMethod: phonePeData.paymentInstrument?.type,
          lastUpdated: serviceCharge.updatedAt
        },
        phonePeData: phonePeData
      });
    } else {
      console.log('❌ [SYNC] No existing service charge found in database');
      return res.status(404).json({
        success: false,
        message: `PhonePe Status: ${phonePeData.state} - Record not found in local database`,
        data: {
          currentStatus: phonePeData.state, // Show PhonePe status as primary
          amount: phonePeData.amount,
          phonePeTransactionId: phonePeData.transactionId,
          merchantTransactionId: phonePeData.merchantTransactionId,
          paymentMethod: phonePeData.paymentInstrument?.type
        },
        phonePeData: phonePeData // Return PhonePe data for reference
      });
    }
  } catch (error) {
    console.error('❌ [SYNC] Error in syncPhonePeTransaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during sync',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Server error'
    });
  }
};

/**
 * Detect missing transactions (disabled in simplified version)
 */
export const detectMissingTransactions = async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Detection feature disabled in simplified version'
  });
};

/**
 * Bulk sync transactions (disabled in simplified version)
 */
export const bulkSyncTransactions = async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Bulk sync feature disabled in simplified version'
  });
};