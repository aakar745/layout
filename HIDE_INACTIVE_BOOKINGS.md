# Hide Inactive Exhibition Bookings

## Overview

This document describes the implementation of completely hiding bookings from inactive exhibitions in the booking management interface, replacing the previous approach of showing them with visual indicators (badges).

## Problem Statement

Previously, when an exhibition was deactivated (set to inactive, draft, or completed status), bookings from that exhibition would still appear in the booking management table with red badges indicating their status. While this preserved historical data visibility, it created confusion and clutter in the interface.

The user requested that bookings from inactive exhibitions should be **completely hidden** from the booking management interface to provide a cleaner, more focused view.

## Solution Implementation

### Frontend Changes

#### 1. Booking List Filtering (`frontend/src/pages/booking/manage/index.tsx`)

**Change**: Modified the booking array filtering logic to exclude bookings from inactive exhibitions.

```typescript
// Before: Show all bookings
const bookingsArray = Array.isArray(bookings) ? bookings : [];

// After: Filter out bookings from inactive exhibitions
const allBookingsArray = Array.isArray(bookings) ? bookings : [];

// Filter bookings to only show those from active exhibitions
const bookingsArray = allBookingsArray.filter(booking => {
  const exhibition = exhibitions.find(e => e._id === booking.exhibitionId._id);
  return exhibition && exhibition.status === 'published' && exhibition.isActive;
});
```

**Impact**: Only bookings from exhibitions with `status === 'published'` and `isActive === true` are displayed in the booking table.

#### 2. Export Filtering (`frontend/src/pages/booking/manage/index.tsx`)

**Change**: Added filtering to the export function to ensure exported data only includes bookings from active exhibitions.

```typescript
// Filter out bookings from inactive exhibitions before formatting
const filteredBookings = result.filter((booking: BookingType) => {
  const exhibition = exhibitions.find(e => e._id === booking.exhibitionId._id);
  return exhibition && exhibition.status === 'published' && exhibition.isActive;
});

// Format booking data for Excel
const exportData = filteredBookings.map((booking: BookingType) => {
  // ... formatting logic
});
```

**Impact**: Excel exports now only contain bookings from active exhibitions, maintaining consistency with the UI.

#### 3. Table Column Simplification (`frontend/src/pages/booking/manage/BookingTable.tsx`)

**Changes**:
1. Removed the `allExhibitions` prop from the `BookingTableProps` interface
2. Simplified the Exhibition column to only show the exhibition name without status badges
3. Removed the visual indicator logic for inactive exhibitions

```typescript
// Before: Complex rendering with status badges
render: (_: string, record: BookingType) => {
  const exhibition = props.allExhibitions?.find(ex => ex._id === record.exhibitionId._id);
  const isInactive = exhibition && (!exhibition.isActive || exhibition.status !== 'published');
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>{record.exhibitionId.name}</span>
      {isInactive && (
        <Tooltip title={`Exhibition is ${!exhibition.isActive ? 'inactive' : exhibition.status}`}>
          <Tag color="red">
            {!exhibition.isActive ? 'INACTIVE' : exhibition.status?.toUpperCase()}
          </Tag>
        </Tooltip>
      )}
    </div>
  );
}

// After: Simple exhibition name display
render: (_: string, record: BookingType) => (
  <span>{record.exhibitionId.name}</span>
)
```

**Impact**: Cleaner, simpler table display without status indicators since inactive bookings are no longer shown.

### Backend Validation (Already Implemented)

The backend already has proper validation in place to prevent new bookings from being created for inactive exhibitions:

1. **Stall Controller**: Returns 403 error when trying to access stalls from inactive exhibitions
2. **Booking Controller**: Validates exhibition status before allowing booking creation
3. **Public Controllers**: Only show active exhibitions in public interfaces

## Filter Behavior Matrix

| Exhibition Status | Filter Dropdown | Booking Table | New Bookings | Export |
|------------------|-----------------|---------------|--------------|---------|
| Published + Active | ✅ Visible | ✅ Visible | ✅ Allowed | ✅ Included |
| Draft | ❌ Hidden | ❌ Hidden | ❌ Blocked | ❌ Excluded |
| Completed | ❌ Hidden | ❌ Hidden | ❌ Blocked | ❌ Excluded |
| Inactive | ❌ Hidden | ❌ Hidden | ❌ Blocked | ❌ Excluded |

## Data Integrity Considerations

### Historical Data Preservation

- **Database**: All booking records remain intact in the database
- **API Access**: Admin users can still access inactive exhibition bookings via direct API calls if needed
- **Audit Trail**: Complete booking history is preserved for compliance and auditing purposes

### Administrative Access

If administrators need to view bookings from inactive exhibitions for historical or audit purposes, they can:

1. **Direct API Access**: Use the booking API endpoints directly
2. **Database Queries**: Access the database directly for comprehensive reporting
3. **Temporary Reactivation**: Temporarily reactivate an exhibition to view its bookings (if needed)

## Testing

### Test Script: `test-hide-inactive-bookings.js`

A comprehensive test script has been created to verify the implementation:

1. **Exhibition Filtering**: Verifies that active/inactive exhibitions are correctly categorized
2. **Booking Visibility**: Confirms that only bookings from active exhibitions are visible
3. **Export Filtering**: Tests that exports only include active exhibition bookings
4. **Access Restrictions**: Validates that stall access is blocked for inactive exhibitions
5. **Booking Creation**: Ensures new bookings cannot be created for inactive exhibitions

### Running Tests

```bash
# Update the AUTH_TOKEN in the test script with a valid admin token
node test-hide-inactive-bookings.js
```

## Benefits

### 1. Cleaner Interface
- Removes visual clutter from status badges
- Focuses attention on actionable bookings
- Provides a more streamlined user experience

### 2. Reduced Confusion
- Eliminates questions about why inactive exhibition bookings are visible
- Prevents accidental interactions with non-bookable exhibitions
- Simplifies the booking management workflow

### 3. Consistent Behavior
- Aligns booking table behavior with filter dropdown behavior
- Maintains consistency across all booking-related interfaces
- Ensures export data matches displayed data

### 4. Performance Benefits
- Reduces the amount of data processed and displayed
- Simplifies rendering logic
- Improves table performance with fewer rows

## Rollback Plan

If needed, this change can be easily rolled back by:

1. **Reverting Frontend Filtering**: Remove the exhibition status filtering in the booking array creation
2. **Restoring Visual Indicators**: Add back the badge rendering logic in the BookingTable component
3. **Export Adjustment**: Remove the filtering from the export function

The rollback is straightforward since no database schema changes were made and all data remains intact.

## Future Considerations

### Archive View (Optional)
If there's future need to view inactive exhibition bookings, consider implementing:
- A separate "Archive" or "Historical Bookings" view
- A toggle switch to show/hide inactive exhibition bookings
- A dedicated reporting interface for historical data analysis

### Soft Delete Pattern (Optional)
For more complex scenarios, consider implementing a soft delete pattern where bookings from inactive exhibitions are marked as "archived" rather than filtered out, providing more granular control over visibility.

## Conclusion

This implementation provides a clean, focused booking management interface by completely hiding bookings from inactive exhibitions while preserving all historical data and maintaining proper access controls. The change improves user experience without compromising data integrity or system functionality. 