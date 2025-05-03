/**
 * Setup script for registering the cleanup script as a cron job
 * 
 * This script will:
 * 1. Create a compiled JavaScript version of the cleanup script
 * 2. Generate instructions for setting up a cron job
 * 
 * Usage: npx ts-node src/scripts/setup-cron.ts
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// Main execution function
const setupCron = async (): Promise<void> => {
  console.log('Setting up temporary files cleanup cron job...');
  
  // Paths
  const rootDir = path.resolve(process.cwd());
  const scriptSourcePath = path.join(rootDir, 'src', 'scripts', 'cleanup-temp-files.ts');
  const distDir = path.join(rootDir, 'dist', 'scripts');
  const scriptDistPath = path.join(distDir, 'cleanup-temp-files.js');
  
  try {
    // 1. Ensure the dist/scripts directory exists
    if (!fs.existsSync(distDir)) {
      console.log(`Creating directory: ${distDir}`);
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // 2. Compile the TypeScript script to JavaScript
    console.log('Compiling cleanup script to JavaScript...');
    exec(`npx tsc ${scriptSourcePath} --outDir ${distDir}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error compiling script: ${error.message}`);
        console.error(stderr);
        return;
      }
      
      if (stdout) {
        console.log(stdout);
      }
      
      // 3. Check if compilation was successful
      if (fs.existsSync(scriptDistPath)) {
        console.log(`Successfully compiled to: ${scriptDistPath}`);
        
        // 4. Generate cron job instructions
        const cronCommand = `0 0 * * * node ${scriptDistPath}`;
        const instructions = `
===============================================================
CRON JOB SETUP INSTRUCTIONS
===============================================================

The cleanup script has been compiled successfully. 
To set up the cron job on your server, follow these steps:

1. Open the crontab editor:
   $ crontab -e

2. Add the following line to run the cleanup script daily at midnight:
   ${cronCommand}

3. Save and exit the editor.

4. Verify the cron job has been added:
   $ crontab -l

The cleanup script will now run automatically every day at midnight
and remove any temporary invoice files older than 24 hours.

For testing, you can run the script manually with:
   $ node ${scriptDistPath}
===============================================================
`;
        console.log(instructions);
      } else {
        console.error(`Compilation seemed successful but could not find: ${scriptDistPath}`);
      }
    });
  } catch (error) {
    console.error(`Error setting up cron job: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Run the setup
setupCron().catch(error => {
  console.error(`Setup failed: ${error instanceof Error ? error.message : String(error)}`);
}); 