# Cleanup Services

This directory contains services for automatic maintenance of the application, including cleaning up temporary files.

## Temporary Email Attachments Cleanup

The `cleanup.service.ts` file implements automatic cleanup of temporary email attachment files. This prevents disk space issues in production environments.

### What it cleans

- `temp-invoice-*.pdf` files in all directories
- `invoice-*.pdf` files in temp directories only (NOT in the root directory for safety)
- Only files older than 24 hours are removed

### How it works

1. **Automatic Initialization**: The service is automatically initialized when the server starts
2. **Built-in Scheduling**: No external cron jobs needed - uses Node.js `setInterval` and `setTimeout`
3. **Three Cleanup Schedules**:
   - Immediate cleanup on server startup
   - Daily cleanup at midnight
   - Backup cleanup every 24 hours from startup time

### Benefits

- No external dependencies or cron jobs required
- Works on any OS (Windows, Linux, macOS)
- Provides detailed logging
- Built-in safety checks to prevent removing important files
- Automatically recovers from errors

### Monitoring

Check server logs for:
- `[INFO] Initializing cleanup service...` - confirms service started
- `[INFO] Email attachment cleanup completed. Deleted X files.` - shows successful cleanup
- `[ERROR]` prefixed messages indicate issues that should be addressed

### Configuration

The cleanup parameters are set in the `cleanup.service.ts` file:
- `ONE_DAY_MS`: Time threshold for file deletion (24 hours by default)
- `TEMP_DIRS`: Directories to scan for temporary files

## Other Cleanup Services

Similar to the email attachments cleanup, the application also includes PDF cache cleanup in `invoice.controller.ts` which follows a similar pattern but for cached invoice PDFs. 