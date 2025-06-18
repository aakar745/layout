# Exhibition Status Filtering Implementation

## Overview

This document outlines the comprehensive implementation of exhibition status filtering to ensure that stalls from exhibitions in Draft, Completed, or Deactivated (inactive) status are completely hidden from booking interfaces and public access.

## Problem Statement

Previously, the system allowed:
- Stalls from Draft exhibitions to be booked
- Stalls from Completed exhibitions to be booked  
- Stalls from Inactive exhibitions to be accessed
- Public access to non-published or inactive exhibitions

This created confusion and allowed bookings for exhibitions that should not be bookable.

## Solution Overview

The solution implements filtering at multiple levels:

1. **Backend API Level** - Block stall access and booking creation
2. **Frontend UI Level** - Filter exhibition options in booking forms
3. **Public Access Level** - Hide inactive exhibitions from public view

## Implementation Details

### Backend Changes

#### 1. Stall Controller (`backend/src/controllers/stall.controller.ts`)

**Enhanced `getStalls` function:**
- Added exhibition status validation before returning stalls
- Only allows stall access for `published` + `active` exhibitions
- Returns 403 error with descriptive message for non-bookable exhibitions

```typescript
// Check if exhibition is in a bookable state (published and active)
if (exhibition.status !== 'published' || !exhibition.isActive) {
  return res.status(403).json({ 
    message: 'Stalls are not available for booking in this exhibition',
    reason: exhibition.status !== 'published' 
      ? `Exhibition is in ${exhibition.status} status` 
      : 'Exhibition is inactive'
  });
}
```

#### 2. Booking Controller (`backend/src/controllers/booking.controller.ts`)

**Enhanced `createBooking` function:**
- Added exhibition status validation before creating bookings
- Prevents booking creation for non-bookable exhibitions
- Returns 403 error with descriptive message

```typescript
// Check if exhibition is in a bookable state (published and active)
if (exhibition.status !== 'published' || !exhibition.isActive) {
  return res.status(403).json({ 
    message: 'Cannot create booking for this exhibition',
    reason: exhibition.status !== 'published' 
      ? `Exhibition is in ${exhibition.status} status` 
      : 'Exhibition is inactive'
  });
}
```

### Frontend Changes

#### 1. Booking Creation Form (`frontend/src/pages/booking/create/index.tsx`)

**Enhanced Exhibition Filtering:**
- Added filtering to `exhibitionOptions` to only show bookable exhibitions
- Only displays exhibitions with `status === 'published'` and `isActive === true`

```typescript
const exhibitionOptions = exhibitions
  .filter(exhibition => 
    exhibition.status === 'published' && exhibition.isActive
  )
  .map(exhibition => ({
    label: exhibition.name,
    value: exhibition._id || exhibition.id
  }));
```

#### 2. Error Handling Enhancement

**Improved error messages in public views:**
- Enhanced error handling in `PublicLayoutView` and `PublicExhibitionDetails`
- Show user-friendly messages when exhibitions are no longer available

### Exhibition Status Matrix

| Status | isActive | Admin View | Booking Creation | Stall Access | Public Access |
|--------|----------|------------|------------------|--------------|---------------|
| Draft | true | ✅ Visible | ❌ Blocked | ❌ Blocked | ❌ Hidden |
| Draft | false | ✅ Visible | ❌ Blocked | ❌ Blocked | ❌ Hidden |
| Published | true | ✅ Visible | ✅ Allowed | ✅ Allowed | ✅ Visible |
| Published | false | ✅ Visible | ❌ Blocked | ❌ Blocked | ❌ Hidden |
| Completed | true | ✅ Visible | ❌ Blocked | ❌ Blocked | ❌ Hidden |
| Completed | false | ✅ Visible | ❌ Blocked | ❌ Blocked | ❌ Hidden |

## API Endpoints Affected

### Protected Endpoints (Require Authentication)

1. **GET `/api/exhibitions/{id}/stalls`**
   - Now validates exhibition status before returning stalls
   - Returns 403 for non-bookable exhibitions

2. **POST `/api/bookings`**
   - Now validates exhibition status before creating bookings
   - Returns 403 for non-bookable exhibitions

### Public Endpoints (Already Fixed Previously)

1. **GET `/api/public/exhibitions`**
   - Only returns published + active exhibitions

2. **GET `/api/public/exhibitions/{id}`**
   - Only allows access to published + active exhibitions

## Error Messages

### Backend Error Responses

**Stall Access Blocked:**
```json
{
  "message": "Stalls are not available for booking in this exhibition",
  "reason": "Exhibition is in draft status"
}
```

**Booking Creation Blocked:**
```json
{
  "message": "Cannot create booking for this exhibition", 
  "reason": "Exhibition is inactive"
}
```

### Frontend Error Messages

**Public Access Blocked:**
- "This exhibition is no longer available"
- "The exhibition you're looking for is no longer accessible"

## Testing

### Manual Testing Checklist

- [ ] Draft exhibitions don't appear in booking creation dropdown
- [ ] Completed exhibitions don't appear in booking creation dropdown  
- [ ] Inactive exhibitions don't appear in booking creation dropdown
- [ ] Direct API calls to fetch stalls from non-bookable exhibitions return 403
- [ ] Direct API calls to create bookings for non-bookable exhibitions return 403
- [ ] Public access to inactive exhibitions returns 404
- [ ] Admin users can still view all exhibitions in the main exhibition list

### Automated Testing

Use the provided test script `test-exhibition-status-filtering.js` to verify:
- Stall fetching behavior for different exhibition statuses
- Booking creation behavior for different exhibition statuses  
- Public access behavior for different exhibition statuses

## Impact Assessment

### What Still Works
- ✅ Admin users can view all exhibitions (including inactive ones) for management
- ✅ Existing bookings for inactive exhibitions remain intact
- ✅ Booking management and filtering works for all exhibitions
- ✅ Published + Active exhibitions work normally

### What's Now Blocked
- ❌ Creating new bookings for Draft exhibitions
- ❌ Creating new bookings for Completed exhibitions
- ❌ Creating new bookings for Inactive exhibitions
- ❌ Fetching stalls from non-bookable exhibitions
- ❌ Public access to non-published or inactive exhibitions

## Security Considerations

1. **API Level Protection** - All restrictions are enforced at the API level, not just UI level
2. **Consistent Validation** - Same validation logic applied across all booking endpoints
3. **Clear Error Messages** - Informative error messages help users understand restrictions
4. **Admin Override** - Admin users retain full visibility for management purposes

## Future Enhancements

1. **Booking Transition Handling** - Consider what happens to pending bookings when an exhibition status changes
2. **Bulk Status Updates** - Add functionality to change multiple exhibition statuses at once
3. **Status Change Notifications** - Notify stakeholders when exhibition statuses change
4. **Advanced Permissions** - Allow certain roles to book stalls in Draft exhibitions for testing

## Files Modified

### Backend Files
- `backend/src/controllers/stall.controller.ts` - Added exhibition status validation
- `backend/src/controllers/booking.controller.ts` - Added exhibition status validation

### Frontend Files  
- `frontend/src/pages/booking/create/index.tsx` - Added exhibition filtering
- `frontend/src/components/exhibition/public_view/PublicLayoutView.tsx` - Enhanced error handling
- `frontend/src/components/exhibition/public_view/PublicExhibitionDetails.tsx` - Enhanced error handling

### Test Files
- `test-exhibition-status-filtering.js` - Comprehensive test suite

### Documentation Files
- `EXHIBITION_STATUS_FILTERING.md` - This documentation
- `INACTIVE_EXHIBITION_FIXES.md` - Previous inactive exhibition fixes

## Rollback Plan

If issues arise, the changes can be rolled back by:

1. **Backend Rollback:**
   - Remove status validation from `stall.controller.ts` getStalls function
   - Remove status validation from `booking.controller.ts` createBooking function

2. **Frontend Rollback:**
   - Remove filtering from `exhibitionOptions` in booking creation form
   - Revert error message enhancements in public views

3. **Database Considerations:**
   - No database schema changes were made
   - All existing data remains intact 