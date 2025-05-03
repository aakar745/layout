/**
 * Test script for temporary file cleanup
 * 
 * This script:
 * 1. Creates sample temporary invoice files in different directories
 * 2. Sets their modified time to 25 hours ago
 * 3. Runs the cleanup script to verify it works correctly
 * 
 * Usage: npx ts-node src/scripts/test-cleanup.ts
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Root directory and temp directories to test
const ROOT_DIR = path.resolve(process.cwd());
const TEMP_DIRS = [
  ROOT_DIR,  // Main project directory
  path.join(ROOT_DIR, 'temp'),  // /temp directory
  path.join(ROOT_DIR, 'src', 'temp')  // /src/temp directory
];

// Log with timestamp
const log = (message: string): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Create test files in specified directory, ensuring directory exists
const createTestFileInDir = async (dir: string, pattern: 'temp-invoice' | 'invoice'): Promise<string | null> => {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create a test temporary file with the specified pattern
    const testFileName = `${pattern}-TEST-${Date.now()}-${dir.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
    const testFilePath = path.join(dir, testFileName);
    
    // Create empty file
    fs.writeFileSync(testFilePath, `This is a test file for cleanup in ${dir}`);
    log(`Created test file (${pattern}): ${testFilePath}`);
    
    // Set file timestamp to 25 hours ago (should be cleaned up)
    const pastTime = new Date(Date.now() - 25 * 60 * 60 * 1000);
    fs.utimesSync(testFilePath, pastTime, pastTime);
    log(`Set modified time to 25 hours ago: ${pastTime.toISOString()}`);
    
    // Verify file exists and has correct timestamp
    const stats = fs.statSync(testFilePath);
    log(`Test file created successfully with modified time: ${stats.mtime.toISOString()}`);
    
    return testFilePath;
  } catch (error) {
    log(`Error creating test file in ${dir}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

const runTest = async (): Promise<void> => {
  try {
    log('Starting cleanup test');
    
    // Track created test files
    const testFiles: string[] = [];
    
    // Create 'temp-invoice-*.pdf' files in all directories
    for (const dir of TEMP_DIRS) {
      const filePath = await createTestFileInDir(dir, 'temp-invoice');
      if (filePath) {
        testFiles.push(filePath);
      }
    }
    
    // Create 'invoice-*.pdf' files in temp directories only (not root)
    for (const dir of TEMP_DIRS.filter(d => d !== ROOT_DIR)) {
      const filePath = await createTestFileInDir(dir, 'invoice');
      if (filePath) {
        testFiles.push(filePath);
      }
    }
    
    // Create an 'invoice-*.pdf' in root that should NOT be removed (testing the safety check)
    const rootInvoiceFile = await createTestFileInDir(ROOT_DIR, 'invoice');
    
    if (testFiles.length === 0) {
      log('ERROR: Failed to create any test files. Test cannot continue.');
      return;
    }
    
    // Run the cleanup script
    log('Running cleanup script...');
    execSync('npx ts-node src/scripts/cleanup-temp-files.ts', { stdio: 'inherit' });
    
    // Check if files that should be removed were actually removed
    let allExpectedFilesRemoved = true;
    for (const filePath of testFiles) {
      if (fs.existsSync(filePath)) {
        log(`TEST FAILED: Test file was not removed: ${filePath}`);
        allExpectedFilesRemoved = false;
        
        // Clean up manually
        try {
          fs.unlinkSync(filePath);
          log(`Manually removed test file: ${filePath}`);
        } catch (cleanupError) {
          log(`Error manually removing file: ${filePath}`);
        }
      }
    }
    
    // Check that the root invoice file should NOT be removed (safety check)
    if (rootInvoiceFile && !fs.existsSync(rootInvoiceFile)) {
      log(`TEST FAILED: Root invoice file was incorrectly removed: ${rootInvoiceFile}`);
      allExpectedFilesRemoved = false;
    } else if (rootInvoiceFile) {
      log(`TEST PASSED: Root invoice file correctly preserved: ${rootInvoiceFile}`);
      // Cleanup this file manually
      fs.unlinkSync(rootInvoiceFile);
      log(`Manually removed root invoice test file: ${rootInvoiceFile}`);
    }
    
    if (allExpectedFilesRemoved) {
      log('TEST PASSED: All test files were correctly processed by cleanup script');
    }
    
    log('Test completed');
  } catch (error) {
    log(`Test error: ${error instanceof Error ? error.message : String(error)}`);
    
    // Attempt to clean up if anything goes wrong
    try {
      log('Attempting to clean up any remaining test files...');
      
      for (const dir of TEMP_DIRS) {
        if (fs.existsSync(dir)) {
          const testFiles = fs.readdirSync(dir).filter(f => 
            (f.includes('temp-invoice-TEST') || f.includes('invoice-TEST')));
          for (const file of testFiles) {
            const filePath = path.join(dir, file);
            fs.unlinkSync(filePath);
            log(`Cleaned up test file in error handler: ${filePath}`);
          }
        }
      }
    } catch (cleanupError) {
      log(`Failed to clean up test files: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`);
    }
  }
};

// Run the test
runTest()
  .then(() => log('Test script completed'))
  .catch(error => log(`Test execution failed: ${error instanceof Error ? error.message : String(error)}`)); 