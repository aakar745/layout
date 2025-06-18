# Clear Logs Feature Documentation

## Overview
The Clear Logs feature allows system administrators to permanently delete activity logs from the database. This feature is designed with multiple security layers to prevent accidental data loss.

## Security Features

### 1. Permission Requirements
- **Admin Only**: Only users with admin role can access this feature
- **Super Admin Permission**: Requires `manage_system` permission level
- **Route Protection**: Backend route is protected with enhanced authorization

### 2. Confirmation Requirements
- **Confirmation Text**: User must type exactly `CLEAR ALL LOGS` to confirm
- **Visual Warnings**: Multiple warning messages about permanent data loss
- **Statistics Display**: Shows current log counts before clearing
- **Disabled Actions**: Clear button is disabled until confirmation text is entered correctly

### 3. Audit Trail
- **Pre-Clear Logging**: The clear action is logged BEFORE logs are cleared
- **Detailed Metadata**: Includes total count, user information, and operation details
- **Error Logging**: Failed attempts are also logged

## Implementation Details

### Backend Components

#### 1. Service Function (`backend/src/services/activity.service.ts`)
```typescript
export const clearActivityLogs = async (options?: {
  beforeDate?: Date;
  keepDays?: number;
}) => {
  // Implementation with query building and safe deletion
}
```

**Features:**
- Optional date filtering (clear logs before specific date)
- Optional retention period (keep logs for X days)
- Count tracking for reporting
- Error handling and logging

#### 2. Controller Function (`backend/src/controllers/activity.controller.ts`)
```typescript
export const clearLogs = async (req: Request, res: Response) => {
  // Confirmation text validation
  // Pre-clear logging
  // Log clearing execution
  // Response handling
}
```

**Security Checks:**
- Validates confirmation text exactly matches `CLEAR ALL LOGS`
- Logs the action before clearing
- Provides detailed response with deletion counts

#### 3. Route (`backend/src/routes/activity.routes.ts`)
```typescript
router.delete('/clear', authorize('admin', 'manage_system', '*'), clearLogs);
```

**Protection:**
- Requires authentication (`protect` middleware)
- Requires admin role with `manage_system` permission
- Uses DELETE HTTP method for destructive operation

### Frontend Components

#### 1. Service Function (`frontend/src/services/activity.service.ts`)
```typescript
clearLogs: async (options: {
  confirmText: string;
  beforeDate?: string;
  keepDays?: number;
}) => {
  // API call to clear logs endpoint
}
```

#### 2. UI Components (`frontend/src/pages/activity/index.tsx`)

**Clear Logs Button:**
- Red danger button with delete icon
- Positioned with other action buttons
- Opens confirmation modal on click

**Confirmation Modal:**
- Warning title with exclamation icon
- Multiple warning messages
- Current statistics display
- Confirmation text input field
- Disabled OK button until correct text is entered
- Loading state during operation

## Usage Instructions

### For Administrators

1. **Access the Activity Page**
   - Navigate to System Activity page
   - Ensure you have admin privileges

2. **Initiate Clear Logs**
   - Click the red "Clear Logs" button
   - Review the warning messages carefully

3. **Confirm the Action**
   - Type exactly: `CLEAR ALL LOGS`
   - Verify the current statistics
   - Click "Clear All Logs" button

4. **Verify Completion**
   - Success modal will show deletion count
   - Activity page will refresh automatically
   - Statistics will update to reflect changes

### Safety Recommendations

1. **Database Backup**
   - Always backup the database before clearing logs
   - Consider exporting important logs for archival

2. **Selective Clearing** (Future Enhancement)
   - Consider implementing date-range clearing
   - Allow clearing by specific criteria (action, resource, etc.)

3. **Regular Maintenance**
   - Set up automated log rotation
   - Implement retention policies
   - Monitor database size regularly

## API Endpoints

### Clear All Logs
```
DELETE /api/activities/clear
```

**Request Body:**
```json
{
  "confirmText": "CLEAR ALL LOGS",
  "beforeDate": "2023-01-01T00:00:00.000Z", // Optional
  "keepDays": 30 // Optional
}
```

**Response (Success):**
```json
{
  "message": "Activity logs cleared successfully",
  "deletedCount": 1250,
  "totalCount": 1250
}
```

**Response (Error):**
```json
{
  "message": "Invalid confirmation text. Please type 'CLEAR ALL LOGS' to confirm."
}
```

## Testing

### Manual Testing
1. Use the test script: `test-clear-logs.js`
2. Test with invalid confirmation text (should fail)
3. Test with valid confirmation text (careful!)
4. Verify logging of the clear action
5. Check database state after clearing

### Automated Testing
Consider implementing:
- Unit tests for service functions
- Integration tests for API endpoints
- UI tests for confirmation flow

## Future Enhancements

### 1. Selective Clearing Options
- Clear by date range
- Clear by action type
- Clear by resource type
- Clear by user/exhibitor

### 2. Bulk Operations UI
- Progress indicators for large deletions
- Batch processing for performance
- Background job processing

### 3. Export Before Clear
- Option to export logs before clearing
- CSV/JSON export formats
- Automated backup integration

### 4. Retention Policies
- Configurable retention periods
- Automated cleanup schedules
- Policy-based clearing rules

## Security Considerations

### 1. Audit Requirements
- All clear operations are logged
- User attribution is maintained
- Timestamps and metadata are preserved

### 2. Recovery Options
- Database backups are essential
- Consider point-in-time recovery
- Document recovery procedures

### 3. Access Control
- Regular review of admin permissions
- Principle of least privilege
- Multi-factor authentication recommended

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Verify user has admin role
   - Check `manage_system` permission
   - Review role assignments

2. **Confirmation Text Errors**
   - Must type exactly: `CLEAR ALL LOGS`
   - Case sensitive
   - No extra spaces

3. **Database Errors**
   - Check database connectivity
   - Verify sufficient permissions
   - Monitor database logs

### Error Messages

- `Invalid confirmation text`: Wrong confirmation text entered
- `Error clearing activity logs`: Database or server error
- `Permission denied`: Insufficient user permissions

## Monitoring and Alerting

### Recommended Monitoring
- Log clearing operations
- Database size changes
- Admin user activities
- Failed clear attempts

### Alerting Thresholds
- Large deletion counts (>1000 logs)
- Frequent clear operations
- Failed admin operations
- Database size changes

---

**Important**: This feature permanently deletes data. Always ensure proper backups and follow your organization's data retention policies before using this feature. 