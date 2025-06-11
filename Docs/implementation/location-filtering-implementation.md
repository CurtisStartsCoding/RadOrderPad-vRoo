# Location Filtering Implementation

## Overview

This document describes the implementation of location filtering for order creation and admin queue retrieval endpoints.

## Changes Made

### 1. Order Creation Endpoint (POST /api/orders)

#### Updated Files:
- `/src/services/order/creation/types.ts` - Added `originatingLocationId` to the payload interface
- `/src/services/order/creation/order-persistence.ts` - Added location field to database insert
- `/src/controllers/order-creation.controller.ts` - Auto-assigns user's location if not provided

#### New Functionality:
- Orders can now be created with an originating location ID
- If no location is provided, the system attempts to use the user's assigned location
- The location is stored in the `originating_location_id` field in the orders table

#### API Changes:
```typescript
// Request payload now accepts:
{
  // ... existing fields ...
  "originatingLocationId": number // Optional - location where order was created
}
```

### 2. Admin Queue Endpoint (GET /api/admin/orders/queue)

#### Updated Files:
- `/src/services/order/admin/list-pending-admin.service.ts` - Added location filtering support
- `/src/controllers/admin-order/list-pending-admin.controller.ts` - Added location query parameters

#### New Query Parameters:
- `originatingLocationId` - Filter by the location where the order was created
- `targetFacilityId` - Filter by the target radiology facility

#### API Changes:
```
GET /api/admin/orders/queue?originatingLocationId=123&targetFacilityId=456
```

#### Response Now Includes:
```typescript
{
  "orders": [
    {
      // ... existing fields ...
      "originating_location_id": number | null,
      "target_facility_id": number | null
    }
  ],
  "pagination": { ... }
}
```

## Database Schema

The implementation uses existing database fields:
- `originating_location_id` - The referring location where the order originated
- `target_facility_id` - The target radiology location

No database migrations are required as these fields already exist in the schema.

## Usage Examples

### Creating an Order with Location

```javascript
// POST /api/orders
{
  "patientInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "Male"
  },
  "dictationText": "MRI brain for headaches",
  "finalValidationResult": { ... },
  "signatureData": "base64...",
  "signerFullName": "Dr. Smith",
  "originatingLocationId": 123 // Specify the location
}
```

### Filtering Admin Queue by Location

```javascript
// GET /api/admin/orders/queue?originatingLocationId=123
// Returns only orders created at location 123
```

## Testing

To test the location filtering:

1. Create orders with different location IDs
2. Query the admin queue with location filters
3. Verify that only orders from the specified location are returned

## Future Enhancements

1. Add location name to the response for better UI display
2. Support multiple location filtering (e.g., `locationIds=1,2,3`)
3. Add location-based permissions (users can only see orders from their locations)