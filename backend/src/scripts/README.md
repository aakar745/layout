# Temporary Files Cleanup Scripts

This directory contains scripts for managing temporary files used in the Exhibition Management System.

## Email Attachment Cleanup

When invoices are shared via email, temporary PDF files are created on the server. These scripts help clean up those temporary files to prevent disk space issues on production servers.

### Available Scripts

1. **cleanup-temp-files.ts** - The main cleanup script that removes temporary invoice files older than 24 hours
2. **test-cleanup.ts** - A test script that creates sample temporary files and verifies the cleanup works correctly
3. **setup-cron.ts** - A utility script that compiles the cleanup script and provides instructions for setting up as a cron job

### Usage

#### Running the Cleanup Manually

```bash
cd backend
npx ts-node src/scripts/cleanup-temp-files.ts
```

This will find and remove any temporary invoice files older than 24 hours.

#### Testing the Cleanup

```bash
cd backend
npx ts-node src/scripts/test-cleanup.ts
```

This creates test files with timestamps set 25 hours in the past, then runs the cleanup script to verify they're removed.

#### Setting Up as a Cron Job

```bash
cd backend
npx ts-node src/scripts/setup-cron.ts
```

This compiles the TypeScript cleanup script to JavaScript and provides instructions for setting up a cron job on your server.

### Temporary Files Pattern

The script looks for the following file patterns:

1. `temp-invoice-*.pdf` in all directories
2. `invoice-*.pdf` in temp directories only (NOT in the root directory for safety)

The script checks in these locations:

- Root project directory (only for `temp-invoice-*.pdf`)
- `/temp` directory
- `/src/temp` directory
- `/dist/temp` directory

### Safety Precautions

To prevent accidental deletion of important files:
- The script only removes files older than 24 hours
- For `invoice-*.pdf` pattern, files are only removed if they're in temp directories, not the root directory
- Each operation is logged with timestamps for audit purposes

### Benefits

- Prevents disk space issues in production
- Ensures privacy by removing temporary files with sensitive information
- Runs automatically without manual intervention
- Only removes files older than 24 hours to allow for email delivery delays
- Includes safety checks to prevent deleting important files

### Configuration

The cleanup script automatically runs on files older than 24 hours. This timeout period can be adjusted by modifying the `ONE_DAY_MS` constant in the script. 