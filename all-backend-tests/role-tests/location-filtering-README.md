# Location Filtering Tests

This document describes the location filtering tests for RadOrderPad.

## Overview

Location filtering ensures that:
1. Orders are automatically tagged with the physician's location when created
2. Admin staff can filter the order queue by location
3. Multi-location organizations can efficiently route orders

## Test Files

### 1. `location-filtering-tests.js`
Comprehensive test suite for location filtering functionality:
- Order creation with automatic location assignment
- Admin queue filtering by location
- Multi-location physician scenarios
- Combined filters (location + patient name)

### 2. Updated Role Tests
- `physician-role-tests.js` - Now displays location ID when orders are created
- `admin-staff-role-tests.js` - Includes location filtering tests in the queue

## Running the Tests

### Prerequisites
The location filtering tests require test users assigned to specific locations:
- `physician.location1@example.com` - Assigned to Location 1 (Boston Main Office)
- `physician.location2@example.com` - Assigned to Location 2 (Cambridge Satellite)
- `admin.location1@example.com` - Admin at Location 1
- `admin.location2@example.com` - Admin at Location 2

### Run Location Filtering Tests
```bash
cd all-backend-tests/role-tests
run-location-filtering-tests.bat
```

### Run Updated Role Tests
```bash
# Physician tests (will show location info)
run-physician-role-tests.bat

# Admin staff tests (includes location filtering)
run-admin-staff-role-tests.bat
```

## Expected Behavior

### Order Creation
1. When a physician creates an order without specifying a location:
   - The system automatically uses the physician's assigned location
   - The order's `originating_location_id` is set

2. When explicitly specifying a location:
   - The provided `originatingLocationId` overrides the default

### Admin Queue Filtering
1. Without filters:
   - Admin staff see ALL organization orders

2. With location filter (`originatingLocationId=1`):
   - Only orders created at location 1 are returned

3. Combined filters work together:
   - `originatingLocationId=1&patientName=Smith` returns only location 1 orders for patients named Smith

## API Changes

### POST /api/orders
Now accepts optional `originatingLocationId` in the request body:
```json
{
  "patientInfo": {...},
  "dictationText": "...",
  "finalValidationResult": {...},
  "originatingLocationId": 1  // Optional
}
```

### GET /api/admin/orders/queue
Now supports location filtering query parameters:
- `originatingLocationId` - Filter by where the order was created
- `targetFacilityId` - Filter by target radiology facility

Example: `/api/admin/orders/queue?originatingLocationId=1`

## Database Fields

The implementation uses existing database fields:
- `orders.originating_location_id` - The referring location where the order originated
- `orders.target_facility_id` - The target radiology location
- `users.primary_location_id` - User's primary assigned location (future use)
- `user_locations` - Join table for user-location assignments

## Future Enhancements

1. **Location Selection at Login**
   - Allow physicians to select their current location when logging in
   - Store the selected location in the JWT token

2. **Multiple Location Filtering**
   - Support filtering by multiple locations: `locationIds=1,2,3`

3. **Location Names in Response**
   - Include location names alongside IDs for better UI display

4. **Location-Based Permissions**
   - Restrict admin staff to only see orders from their assigned locations