import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServiceCharge from '../models/serviceCharge.model';
import Exhibition from '../models/exhibition.model';
import { phonePeService } from '../services/phonepe.service';
import { serviceChargeReceiptService } from '../services/serviceChargeReceipt.service';
import { serviceChargeNotificationService } from '../services/serviceChargeNotification.service';

/**
 * Sync missing or stuck transactions from PhonePe - 2025 Enhanced Version
 * Handles ALL transaction states: COMPLETED, FAILED, PENDING, INITIATED, PROCESSING
 */
export const syncPhonePeTransaction = async (req: Request, res: Response) => {
  console.log('🔄 [SYNC] ===== PHONEPE TRANSACTION SYNC STARTED =====');
  console.log('🔄 [SYNC] Timestamp:', new Date().toISOString());
  
  try {
    const { receiptNumber, phonePeTransactionId } = req.body;

    console.log('🔄 [SYNC] Sync request details:', {
      receiptNumber,
      phonePeTransactionId,
      requestedBy: req.user?.email || 'Unknown'
    });

    // Validate input
    if (!receiptNumber && !phonePeTransactionId) {
      return res.status(400).json({
        success: false,
        message: 'Either receipt number or PhonePe transaction ID is required'
      });
    }

    const merchantTransactionId = receiptNumber || phonePeTransactionId;
    
    console.log('📡 [SYNC] Calling PhonePe API to get transaction status...');
    console.log('📡 [SYNC] Merchant Transaction ID:', merchantTransactionId);

    // Check transaction status with PhonePe
    const paymentStatus = await phonePeService.getOrderStatus(merchantTransactionId);
    
    console.log('📡 [SYNC] PhonePe API response:', JSON.stringify(paymentStatus, null, 2));

    if (!paymentStatus.success && paymentStatus.code === 'PAYMENT_STATUS_CHECK_FAILED') {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found in PhonePe system',
        details: paymentStatus.message
      });
    }

    const phonePeData = paymentStatus.data;
    if (!phonePeData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid response from PhonePe API'
      });
    }

    console.log('🔍 [SYNC] Checking if service charge already exists...');
    
    // Check if service charge already exists
    let serviceCharge = await ServiceCharge.findOne({
      $or: [
        { phonePeMerchantTransactionId: merchantTransactionId },
        { receiptNumber: merchantTransactionId },
        { phonePeTransactionId: phonePeData.transactionId }
      ]
    }).populate('exhibitionId', 'name venue');

    let wasCreated = false;
    let wasUpdated = false;
    let previousStatus = '';

    if (serviceCharge) {
      console.log('✅ [SYNC] Found existing service charge:', {
        id: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        currentPaymentStatus: serviceCharge.paymentStatus,
        currentStatus: serviceCharge.status
      });
      
      previousStatus = serviceCharge.paymentStatus;
    } else {
      console.log('❌ [SYNC] No existing service charge found');
      
      // Check if we have vendor details to create missing record
      const { vendorDetails } = req.body;
      
      if (!vendorDetails || !vendorDetails.vendorName || !vendorDetails.companyName || !vendorDetails.stallNumber) {
        console.log('❌ [SYNC] Cannot create record - missing vendor details');
        return res.status(404).json({
          success: false,
          message: 'Service charge record not found in system.',
          suggestion: 'To create missing record, provide vendorDetails: { vendorName, companyName, vendorPhone, stallNumber, exhibitionId }',
          phonePeData: phonePeData // Return PhonePe data for reference
        });
      }
      
      console.log('🔧 [SYNC] Creating missing service charge record from PhonePe data...');
      
      // Create missing service charge record
      try {
        const newServiceChargeData = {
          exhibitionId: vendorDetails.exhibitionId,
          vendorName: vendorDetails.vendorName,
          vendorPhone: vendorDetails.vendorPhone || 'Unknown',
          companyName: vendorDetails.companyName,
          exhibitorCompanyName: vendorDetails.exhibitorCompanyName,
          stallNumber: vendorDetails.stallNumber,
          stallArea: vendorDetails.stallArea,
          serviceType: vendorDetails.serviceType || 'Service Charge',
          amount: phonePeData.amount / 100, // Convert from paise to rupees
          paymentGateway: 'phonepe',
          paymentStatus: 'pending', // Will be updated below based on PhonePe status
          status: 'submitted',
          receiptNumber: merchantTransactionId,
          phonePeMerchantTransactionId: merchantTransactionId,
          phonePeTransactionId: phonePeData.transactionId,
          adminNotes: `Created from PhonePe sync on ${new Date().toISOString()} - Original order was missing from database`
        };
        
        serviceCharge = new ServiceCharge(newServiceChargeData);
        await serviceCharge.save();
        
        console.log('✅ [SYNC] Created missing service charge record:', {
          id: serviceCharge._id,
          receiptNumber: serviceCharge.receiptNumber,
          amount: serviceCharge.amount
        });
        
        wasCreated = true;
        previousStatus = 'missing';
        
      } catch (createError) {
        console.error('❌ [SYNC] Failed to create missing service charge:', createError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create missing service charge record',
          error: (createError as Error).message
        });
      }
    }

    // Update service charge based on PhonePe status
    console.log('💾 [SYNC] Updating service charge with PhonePe data...');
    
    serviceCharge.phonePeTransactionId = phonePeData.transactionId;
    serviceCharge.phonePeMerchantTransactionId = phonePeData.merchantTransactionId;

    const phonePeState = phonePeData.state;
    const phonepeResponseCode = phonePeData.responseCode;

    console.log('🔍 [SYNC] Processing PhonePe state:', {
      state: phonePeState,
      responseCode: phonepeResponseCode,
      previousPaymentStatus: previousStatus
    });

    // Enhanced state handling for 2025 compliance
    if (phonePeState === 'COMPLETED' && phonepeResponseCode === 'SUCCESS') {
      if (serviceCharge.paymentStatus !== 'paid') {
        console.log('✅ [SYNC] Payment successful - updating to paid status');
        serviceCharge.paymentStatus = 'paid';
        serviceCharge.status = 'paid';
        serviceCharge.paidAt = new Date();
        wasUpdated = true;
      } else {
        console.log('ℹ️ [SYNC] Payment already marked as paid - no update needed');
      }
    } else if (phonePeState === 'FAILED' && phonepeResponseCode === 'FAILED') {
      if (serviceCharge.paymentStatus !== 'failed') {
        console.log('❌ [SYNC] Payment failed - updating to failed status');
        serviceCharge.paymentStatus = 'failed';
        serviceCharge.status = 'cancelled';
        serviceCharge.adminNotes = `Synced from PhonePe: Payment failed`;
        wasUpdated = true;
      } else {
        console.log('ℹ️ [SYNC] Payment already marked as failed - no update needed');
      }
    } else if (['PENDING', 'INITIATED', 'PROCESSING'].includes(phonePeState)) {
      console.log('⏳ [SYNC] Payment is still pending/processing in PhonePe');
      serviceCharge.adminNotes = `Synced from PhonePe: Payment ${phonePeState.toLowerCase()} as of ${new Date().toISOString()}`;
      wasUpdated = true;
    } else {
      console.log('⚠️ [SYNC] Unknown PhonePe state - logging for investigation');
      serviceCharge.adminNotes = `Synced from PhonePe: Unknown state ${phonePeState} with responseCode ${phonepeResponseCode}`;
      wasUpdated = true;
    }

    // Save the updated service charge
    console.log('💾 [SYNC] Saving updated service charge...');
    await serviceCharge.save();
    console.log('✅ [SYNC] Service charge saved successfully');

    // Handle post-payment processing for successful payments
    if (serviceCharge.paymentStatus === 'paid' && previousStatus !== 'paid') {
      console.log('🎯 [SYNC] Payment newly marked as paid, starting post-payment processing...');
      
      try {
        const exhibition = await Exhibition.findById(serviceCharge.exhibitionId);
        
        if (exhibition) {
          // Generate receipt if not already generated
          if (!serviceCharge.receiptGenerated) {
            console.log('📄 [SYNC] Generating receipt...');
            try {
              const receiptPath = await serviceChargeReceiptService.generateReceipt({
                serviceCharge,
                exhibition
              });

              serviceCharge.receiptPath = receiptPath;
              serviceCharge.receiptGenerated = true;
              await serviceCharge.save();

              console.log('✅ [SYNC] Receipt generated successfully:', receiptPath);
            } catch (receiptError) {
              console.error('❌ [SYNC] Receipt generation failed:', receiptError);
            }
          }

          // Send notifications
          console.log('📧 [SYNC] Processing notifications...');
          try {
            await serviceChargeNotificationService.notifyNewServiceCharge(serviceCharge, exhibition);
            console.log('✅ [SYNC] Notifications sent successfully');
          } catch (notificationError) {
            console.error('❌ [SYNC] Notification sending failed:', notificationError);
          }
        }
      } catch (postProcessingError) {
        console.error('❌ [SYNC] Post-payment processing failed:', postProcessingError);
      }
    }

    const responseData = {
      success: true,
      message: wasCreated ? 'Service charge created from PhonePe data' : 
               wasUpdated ? 'Service charge synced successfully' : 
               'Service charge was already up to date',
      data: {
        serviceChargeId: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        phonePeTransactionId: serviceCharge.phonePeTransactionId,
        phonePeMerchantTransactionId: serviceCharge.phonePeMerchantTransactionId,
        paymentStatus: serviceCharge.paymentStatus,
        status: serviceCharge.status,
        paidAt: serviceCharge.paidAt,
        amount: serviceCharge.amount,
        vendorName: serviceCharge.vendorName,
        stallNumber: serviceCharge.stallNumber,
        receiptGenerated: serviceCharge.receiptGenerated,
        exhibition: {
          name: (serviceCharge.exhibitionId as any).name,
          venue: (serviceCharge.exhibitionId as any).venue
        },
        phonePeDetails: {
          state: phonePeData.state,
          responseCode: phonePeData.responseCode,
          amount: phonePeData.amount,
          paymentInstrument: phonePeData.paymentInstrument
        }
      },
      changes: {
        wasCreated,
        wasUpdated,
        previousStatus,
        newStatus: serviceCharge.paymentStatus
      }
    };

    console.log('📤 [SYNC] Sync completed successfully:', {
      serviceChargeId: serviceCharge._id,
      wasCreated,
      wasUpdated,
      finalStatus: serviceCharge.paymentStatus
    });
    console.log('🔄 [SYNC] ===== PHONEPE TRANSACTION SYNC COMPLETED =====');

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ [SYNC] Error syncing PhonePe transaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Error syncing transaction with PhonePe',
      error: (error as Error).message
    });
  }
};

/**
 * Detect and sync missing transactions by scanning receipt number gaps
 */
export const detectMissingTransactions = async (req: Request, res: Response) => {
  console.log('🔍 [DETECT] ===== MISSING TRANSACTION DETECTION STARTED =====');
  
  try {
    const { exhibitionId, startDate, endDate, maxToCheck = 10 } = req.body;

    if (!exhibitionId || !mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid exhibition ID is required'
      });
    }

    // Get all service charges for the exhibition in date range
    const query: any = { exhibitionId };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    console.log('🔍 [DETECT] Finding existing service charges...');
    const existingCharges = await ServiceCharge.find(query)
      .select('receiptNumber phonePeMerchantTransactionId createdAt')
      .sort({ receiptNumber: 1 });

    console.log('🔍 [DETECT] Found', existingCharges.length, 'existing service charges');

    if (existingCharges.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No existing service charges found for the specified criteria',
        data: { missing: [], checked: 0 }
      });
    }

    // Extract receipt numbers and find gaps
    const receiptNumbers = existingCharges
      .map(charge => charge.receiptNumber)
      .filter(Boolean)
      .map(receipt => parseInt(receipt!.replace('SC', '')))
      .sort((a, b) => a - b);

    console.log('🔍 [DETECT] Receipt number range:', {
      min: receiptNumbers[0],
      max: receiptNumbers[receiptNumbers.length - 1],
      count: receiptNumbers.length
    });

    // Find gaps in the sequence
    const missingNumbers = [];
    for (let i = receiptNumbers[0]; i <= receiptNumbers[receiptNumbers.length - 1]; i++) {
      if (!receiptNumbers.includes(i)) {
        missingNumbers.push(`SC${String(i).padStart(10, '0')}`);
      }
    }

    console.log('🔍 [DETECT] Found', missingNumbers.length, 'potential missing receipt numbers');

    // Limit the number to check (to prevent API rate limits)
    const toCheck = missingNumbers.slice(0, Math.min(maxToCheck, missingNumbers.length));
    console.log('🔍 [DETECT] Will check', toCheck.length, 'missing receipt numbers');

    const results = [];
    let checkedCount = 0;

    for (const receiptNumber of toCheck) {
      try {
        console.log('📡 [DETECT] Checking receipt number:', receiptNumber);
        
        // Check with PhonePe API
        const paymentStatus = await phonePeService.getOrderStatus(receiptNumber);
        checkedCount++;

        if (paymentStatus.success || paymentStatus.data) {
          console.log('✅ [DETECT] Found missing transaction:', receiptNumber);
          results.push({
            receiptNumber,
            phonePeData: paymentStatus.data,
            status: paymentStatus.data?.state,
            amount: paymentStatus.data?.amount,
            found: true
          });
        } else {
          console.log('❌ [DETECT] No transaction found for:', receiptNumber);
          results.push({
            receiptNumber,
            found: false,
            error: paymentStatus.message
          });
        }

        // Add delay to respect rate limits (90 seconds between checks as per 2025 rules)
        if (checkedCount < toCheck.length) {
          console.log('⏳ [DETECT] Waiting 90 seconds before next check (2025 compliance)...');
          await new Promise(resolve => setTimeout(resolve, 90000));
        }

      } catch (error) {
        console.error('❌ [DETECT] Error checking receipt number:', receiptNumber, error);
        results.push({
          receiptNumber,
          found: false,
          error: (error as Error).message
        });
      }
    }

    console.log('📤 [DETECT] Detection completed:', {
      totalMissing: missingNumbers.length,
      checked: checkedCount,
      found: results.filter(r => r.found).length
    });

    return res.status(200).json({
      success: true,
      message: `Checked ${checkedCount} missing receipt numbers, found ${results.filter(r => r.found).length} in PhonePe`,
      data: {
        missing: results,
        totalMissingInSequence: missingNumbers.length,
        checkedCount,
        foundCount: results.filter(r => r.found).length,
        remainingToCheck: Math.max(0, missingNumbers.length - maxToCheck)
      }
    });

  } catch (error) {
    console.error('❌ [DETECT] Error detecting missing transactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Error detecting missing transactions',
      error: (error as Error).message
    });
  }
};

/**
 * Bulk sync multiple transactions
 */
export const bulkSyncTransactions = async (req: Request, res: Response) => {
  console.log('🔄📦 [BULK_SYNC] ===== BULK TRANSACTION SYNC STARTED =====');
  
  try {
    const { receiptNumbers } = req.body;

    if (!Array.isArray(receiptNumbers) || receiptNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Array of receipt numbers is required'
      });
    }

    if (receiptNumbers.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 transactions can be synced at once (2025 rate limit compliance)'
      });
    }

    console.log('🔄📦 [BULK_SYNC] Syncing', receiptNumbers.length, 'transactions');

    const results = [];
    let syncedCount = 0;
    let errorCount = 0;

    for (const receiptNumber of receiptNumbers) {
      try {
        console.log('🔄 [BULK_SYNC] Processing:', receiptNumber);

        // Simulate the single sync logic
        const paymentStatus = await phonePeService.getOrderStatus(receiptNumber);
        
        if (paymentStatus.success || paymentStatus.data) {
          // Find and update the service charge
          const serviceCharge = await ServiceCharge.findOne({
            $or: [
              { phonePeMerchantTransactionId: receiptNumber },
              { receiptNumber: receiptNumber }
            ]
          });

          if (serviceCharge) {
            // Update based on PhonePe status
            const previousStatus = serviceCharge.paymentStatus;
            const phonePeState = paymentStatus.data!.state;

            if (phonePeState === 'COMPLETED' && previousStatus !== 'paid') {
              serviceCharge.paymentStatus = 'paid';
              serviceCharge.status = 'paid';
              serviceCharge.paidAt = new Date();
              serviceCharge.phonePeTransactionId = paymentStatus.data!.transactionId;
              await serviceCharge.save();
              syncedCount++;
            }

            results.push({
              receiptNumber,
              success: true,
              previousStatus,
              newStatus: serviceCharge.paymentStatus,
              phonePeState
            });
          } else {
            results.push({
              receiptNumber,
              success: false,
              error: 'Service charge not found in database'
            });
            errorCount++;
          }
        } else {
          results.push({
            receiptNumber,
            success: false,
            error: 'Transaction not found in PhonePe'
          });
          errorCount++;
        }

        // Rate limiting - wait between checks
        if (receiptNumbers.indexOf(receiptNumber) < receiptNumbers.length - 1) {
          console.log('⏳ [BULK_SYNC] Waiting 90 seconds before next check...');
          await new Promise(resolve => setTimeout(resolve, 90000));
        }

      } catch (error) {
        console.error('❌ [BULK_SYNC] Error processing:', receiptNumber, error);
        results.push({
          receiptNumber,
          success: false,
          error: (error as Error).message
        });
        errorCount++;
      }
    }

    console.log('📤 [BULK_SYNC] Bulk sync completed:', {
      total: receiptNumbers.length,
      synced: syncedCount,
      errors: errorCount
    });

    return res.status(200).json({
      success: true,
      message: `Bulk sync completed: ${syncedCount} synced, ${errorCount} errors`,
      data: {
        results,
        summary: {
          total: receiptNumbers.length,
          synced: syncedCount,
          errors: errorCount,
          successRate: Math.round((syncedCount / receiptNumbers.length) * 100)
        }
      }
    });

  } catch (error) {
    console.error('❌ [BULK_SYNC] Error in bulk sync:', error);
    return res.status(500).json({
      success: false,
      message: 'Error in bulk sync operation',
      error: (error as Error).message
    });
  }
};
