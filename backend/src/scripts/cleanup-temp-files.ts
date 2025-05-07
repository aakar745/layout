/**
 * Cleanup script for temporary email attachment files
 * 
 * This script finds and removes temporary invoice files that may remain
 * if the email sending process fails. It only removes files that:
 * 1. Match the patterns 'temp-invoice-*.pdf' or 'invoice-*.pdf' in temp directories
 * 2. Are older than 24 hours
 * 
 * Usage: 
 * - Run manually: npx ts-node src/scripts/cleanup-temp-files.ts
 * - Set as a cron job to run daily
 */

import * as fs from 'fs';
import * as path from 'path';

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

// Find and remove old temporary invoice files
const cleanupTempFiles = async (): Promise<void> => {
  try {
    log('Starting temporary files cleanup');
    
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    let deletedCount = 0;
    let errorCount = 0;
    
    // Process each directory where temp files might be found
    for (const dir of TEMP_DIRS) {
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        log(`Directory doesn't exist, skipping: ${dir}`);
        continue;
      }
      
      log(`Checking directory: ${dir}`);
      
      // Read directory contents
      const files = await fs.promises.readdir(dir);
      
      // Process each file
      for (const file of files) {
        // Check if file is a temporary invoice file
        const isTempInvoice = file.startsWith('temp-invoice-') && file.endsWith('.pdf');
        const isInvoice = file.startsWith('invoice-') && file.endsWith('.pdf');
        
        // Only process temp directories for regular 'invoice-*.pdf' files to avoid deleting important invoices
        const shouldProcess = isTempInvoice || 
          (isInvoice && dir !== ROOT_DIR); // Only delete invoice-*.pdf in temp directories
        
        if (shouldProcess) {
          const filePath = path.join(dir, file);
          
          try {
            // Get file stats
            const stats = await fs.promises.stat(filePath);
            
            // Check if file is older than one day
            if (now - stats.mtime.getTime() > ONE_DAY_MS) {
              // Delete the file
              await fs.promises.unlink(filePath);
              log(`Deleted old temporary file: ${filePath}`);
              deletedCount++;
            } else {
              log(`Skipping file that is not old enough: ${filePath} (Modified: ${stats.mtime.toISOString()})`);
            }
          } catch (fileError) {
            log(`Error processing file ${filePath}: ${fileError instanceof Error ? fileError.message : String(fileError)}`);
            errorCount++;
          }
        }
      }
    }
    
    log(`Cleanup completed. Deleted ${deletedCount} files. Encountered ${errorCount} errors.`);
  } catch (error) {
    log(`Error during cleanup: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Execute the cleanup
cleanupTempFiles()
  .then(() => log('Cleanup script execution completed'))
  .catch(error => log(`Failed to execute cleanup: ${error instanceof Error ? error.message : String(error)}`)); 