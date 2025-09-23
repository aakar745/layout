/**
 * Cleanup Service
 * 
 * Responsible for scheduling automatic cleanup tasks for:
 * - Temporary email attachment files
 * - Abandoned service charge payment attempts
 * 
 * This service ensures that cleanup jobs run automatically at scheduled intervals
 * without requiring external cron jobs or scheduled tasks.
 */

import * as fs from 'fs';
import * as path from 'path';
import ServiceCharge from '../models/serviceCharge.model';

// Root directory and temp directories to check
const ROOT_DIR = path.resolve(process.cwd());
const TEMP_DIRS = [
  ROOT_DIR,  // Main project directory
  path.join(ROOT_DIR, 'temp'),  // /temp directory
  path.join(ROOT_DIR, 'src', 'temp'),  // /src/temp directory
  path.join(ROOT_DIR, 'dist', 'temp')  // /dist/temp directory
];

// Log with timestamp
const log = (message: string): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Clean up abandoned service charge payment attempts
export const cleanupAbandonedServiceCharges = async (): Promise<void> => {
  try {
    log('[INFO] Starting abandoned service charge cleanup');
    
    const now = new Date();
    const FIFTEEN_MINUTES_AGO = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago
    const FIVE_MINUTES_AGO = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
    
    // Find service charges that are:
    // 1. Failed payments older than 5 minutes (user had time to retry)
    // 2. Pending payments older than 15 minutes (PhonePe timeout + buffer)
    const query = {
      $or: [
        {
          paymentStatus: 'failed',
          updatedAt: { $lt: FIVE_MINUTES_AGO },
          status: { $ne: 'cancelled' } // Don't re-process already cancelled
        },
        {
          paymentStatus: 'pending', 
          createdAt: { $lt: FIFTEEN_MINUTES_AGO },
          status: { $ne: 'cancelled' } // Don't re-process already cancelled
        }
      ]
    };
    
    // Update abandoned service charges to 'cancelled' status
    const result = await ServiceCharge.updateMany(
      query,
      { 
        $set: { 
          status: 'cancelled',
          adminNotes: 'Auto-cancelled due to abandoned payment session',
          updatedAt: now
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      log(`[INFO] Marked ${result.modifiedCount} abandoned service charges as cancelled`);
      
      // Log details of what was cleaned up
      const cleanedRecords = await ServiceCharge.find({
        status: 'cancelled',
        adminNotes: 'Auto-cancelled due to abandoned payment session',
        updatedAt: { $gte: new Date(now.getTime() - 1000) } // Within last second
      }).select('receiptNumber paymentStatus createdAt stallNumber exhibitorCompanyName');
      
      cleanedRecords.forEach(record => {
        log(`[INFO] Cancelled: ${record.receiptNumber} | ${record.paymentStatus} | Stall: ${record.stallNumber} | Created: ${record.createdAt?.toISOString()}`);
      });
    } else {
      log('[INFO] No abandoned service charges found for cleanup');
    }
    
    // Additional cleanup: Remove very old failed attempts (older than 7 days) to prevent database bloat
    const SEVEN_DAYS_AGO = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oldRecordsQuery = {
      status: 'cancelled',
      paymentStatus: { $in: ['failed', 'pending'] },
      updatedAt: { $lt: SEVEN_DAYS_AGO }
    };
    
    const deleteResult = await ServiceCharge.deleteMany(oldRecordsQuery);
    
    if (deleteResult.deletedCount > 0) {
      log(`[INFO] Permanently deleted ${deleteResult.deletedCount} old cancelled service charge records (>7 days old)`);
    }
    
    log('[INFO] Service charge cleanup completed successfully');
    
  } catch (error) {
    log(`[ERROR] Error during service charge cleanup: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

// Find and remove old temporary invoice files
export const cleanupTempFiles = async (): Promise<void> => {
  try {
    log('[INFO] Starting temporary email attachment files cleanup');
    
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    let deletedCount = 0;
    let errorCount = 0;
    
    // Process each directory where temp files might be found
    for (const dir of TEMP_DIRS) {
      // Skip if directory doesn't exist
      if (!fs.existsSync(dir)) {
        log(`[INFO] Directory doesn't exist, skipping: ${dir}`);
        continue;
      }
      
      log(`[INFO] Checking directory: ${dir}`);
      
      // Read directory contents
      const files = await fs.promises.readdir(dir);
      
      // Process each file
      for (const file of files) {
        // Check if file is a temporary invoice file
        const isTempInvoice = file.startsWith('temp-invoice-') && file.endsWith('.pdf');
        const isInvoice = file.startsWith('invoice-') && file.endsWith('.pdf');
        const isWhatsAppTemp = file.startsWith('whatsapp-') && file.endsWith('.pdf');
        
        // Only process temp directories for regular 'invoice-*.pdf' files to avoid deleting important invoices
        const shouldProcess = isTempInvoice || isWhatsAppTemp ||
          (isInvoice && dir !== ROOT_DIR); // Only delete invoice-*.pdf in temp directories
        
        if (shouldProcess) {
          const filePath = path.join(dir, file);
          
          try {
            // Get file stats
            const stats = await fs.promises.stat(filePath);
            
            // Different cleanup times for different file types
            const isWhatsAppFile = file.startsWith('whatsapp-');
            const cleanupAge = isWhatsAppFile ? 60 * 60 * 1000 : ONE_DAY_MS; // 1 hour for WhatsApp files, 24 hours for others
            
            // Check if file is older than cleanup age
            if (now - stats.mtime.getTime() > cleanupAge) {
              // Delete the file
              await fs.promises.unlink(filePath);
              log(`[INFO] Deleted old temporary file: ${filePath}`);
              deletedCount++;
            } else {
              log(`[DEBUG] Skipping file that is not old enough: ${filePath} (Modified: ${stats.mtime.toISOString()})`);
            }
          } catch (fileError) {
            log(`[ERROR] Error processing file ${filePath}: ${fileError instanceof Error ? fileError.message : String(fileError)}`);
            errorCount++;
          }
        }
      }
    }
    
    log(`[INFO] Email attachment cleanup completed. Deleted ${deletedCount} files. Encountered ${errorCount} errors.`);
    
    // Return a summary for logging
    return Promise.resolve();
  } catch (error) {
    log(`[ERROR] Error during email attachment cleanup: ${error instanceof Error ? error.message : String(error)}`);
    return Promise.reject(error);
  }
};

/**
 * Initialize the cleanup service and schedule recurring cleanup tasks
 */
export const initializeCleanupService = (): void => {
  try {
    log('[INFO] Initializing cleanup service...');
    
    // Run initial cleanups on startup
    Promise.all([
      cleanupTempFiles(),
      cleanupAbandonedServiceCharges()
    ])
      .then(() => {
        log('[INFO] Initial cleanup tasks completed successfully.');
      })
      .catch(error => {
        log(`[ERROR] Initial cleanup tasks failed: ${error instanceof Error ? error.message : String(error)}`);
      });
    
    // Schedule service charge cleanup every 5 minutes (more frequent for payment abandonment)
    const FIVE_MINUTES = 5 * 60 * 1000;
    setInterval(() => {
      cleanupAbandonedServiceCharges()
        .then(() => {
          log('[INFO] Scheduled service charge cleanup completed successfully.');
        })
        .catch(error => {
          log(`[ERROR] Scheduled service charge cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
        });
    }, FIVE_MINUTES);
    
    // Schedule temp file cleanup to run every 24 hours (at midnight)
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    
    setInterval(() => {
      cleanupTempFiles()
        .then(() => {
          log('[INFO] Scheduled email attachment cleanup completed successfully.');
        })
        .catch(error => {
          log(`[ERROR] Scheduled email attachment cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
        });
    }, TWENTY_FOUR_HOURS);
    
    // Calculate time until next midnight for temp file cleanup
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setDate(now.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    const timeUntilMidnight = nextMidnight.getTime() - now.getTime();
    
    // Schedule first temp file cleanup at midnight
    setTimeout(() => {
      cleanupTempFiles()
        .then(() => {
          log('[INFO] Midnight email attachment cleanup completed successfully.');
        })
        .catch(error => {
          log(`[ERROR] Midnight email attachment cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
        });
    }, timeUntilMidnight);
    
    log(`[INFO] Cleanup service initialized.`);
    log(`[INFO] Service charge cleanup: Every 5 minutes`);
    log(`[INFO] Temp file cleanup: Every 24 hours, first at midnight (${nextMidnight.toISOString()})`);
  } catch (error) {
    log(`[ERROR] Failed to initialize cleanup service: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export default {
  initializeCleanupService,
  cleanupTempFiles,
  cleanupAbandonedServiceCharges
}; 