# Location Management API

## Overview
This document describes the location management endpoints that allow organization administrators to:
1. Manage physical locations/facilities within their own organization
2. View locations of connected organizations (for order routing)

These endpoints are accessible to users with `admin_referring` or `admin_radiology` roles.

## Endpoints

### 1. List Organization Locations
Get all locations for the authenticated user's organization.

**Endpoint:** `GET /api/organizations/mine/locations`

**Authentication:** Required (JWT)

**Authorization:** `admin_referring`, `admin_radiology`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "locations": [
    {
      "id": 81,
      "organization_id": 9,
      "name": "Clinic Location",
      "address_line1": "123 Medical St",
      "address_line2": null,
      "city": "Test City",
      "state": "TS",
      "zip_code": "12345",
      "phone_number": null,
      "is_active": true,
      "created_at": "2025-04-24T10:07:56.156Z",
      "updated_at": "2025-04-24T10:07:56.156Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - Insufficient permissions

---

### 2. Create Location
Create a new location for the organization.

**Endpoint:** `POST /api/organizations/mine/locations`

**Authentication:** Required (JWT)

**Authorization:** `admin_referring`, `admin_radiology`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Clinic Location",
  "address_line1": "456 Healthcare Blvd",
  "address_line2": "Suite 200",
  "city": "Medical City",
  "state": "CA",
  "zip_code": "90210",
  "phone_number": "555-123-4567"
}
```

**Required Fields:**
- `name` - Location name
- `address_line1` - Primary address
- `city` - City name
- `state` - State code (2 letters)
- `zip_code` - ZIP code

**Optional Fields:**
- `address_line2` - Secondary address line
- `phone_number` - Contact phone number

**Response:**
```json
{
  "message": "Location created successfully",
  "location": {
    "id": 123,
    "organization_id": 9,
    "name": "New Clinic Location",
    "address_line1": "456 Healthcare Blvd",
    "address_line2": "Suite 200",
    "city": "Medical City",
    "state": "CA",
    "zip_code": "90210",
    "phone_number": "555-123-4567",
    "is_active": true,
    "created_at": "2025-06-12T22:32:16.234Z",
    "updated_at": "2025-06-12T22:32:16.234Z"
  }
}
```

**Status Codes:**
- `201 Created` - Location created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - Insufficient permissions

---

### 3. Get Location Details
Get details of a specific location.

**Endpoint:** `GET /api/organizations/mine/locations/:locationId`

**Authentication:** Required (JWT)

**Authorization:** `admin_referring`, `admin_radiology`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `locationId` - The ID of the location

**Response:**
```json
{
  "location": {
    "id": 123,
    "organization_id": 9,
    "name": "Clinic Location",
    "address_line1": "456 Healthcare Blvd",
    "address_line2": "Suite 200",
    "city": "Medical City",
    "state": "CA",
    "zip_code": "90210",
    "phone_number": "555-123-4567",
    "is_active": true,
    "created_at": "2025-06-12T22:32:16.234Z",
    "updated_at": "2025-06-12T22:32:16.234Z"
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid location ID format
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - Insufficient permissions or location belongs to another organization
- `404 Not Found` - Location not found or inactive

---

### 4. Update Location
Update an existing location's information.

**Endpoint:** `PUT /api/organizations/mine/locations/:locationId`

**Authentication:** Required (JWT)

**Authorization:** `admin_referring`, `admin_radiology`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `locationId` - The ID of the location to update

**Request Body:**
```json
{
  "name": "Updated Clinic Name",
  "phone_number": "555-987-6543"
}
```

**Updatable Fields:**
- `name` - Location name
- `address_line1` - Primary address
- `address_line2` - Secondary address line
- `city` - City name
- `state` - State code
- `zip_code` - ZIP code
- `phone_number` - Contact phone number

**Response:**
```json
{
  "message": "Location updated successfully",
  "location": {
    "id": 123,
    "organization_id": 9,
    "name": "Updated Clinic Name",
    "address_line1": "456 Healthcare Blvd",
    "address_line2": "Suite 200",
    "city": "Medical City",
    "state": "CA",
    "zip_code": "90210",
    "phone_number": "555-987-6543",
    "is_active": true,
    "created_at": "2025-06-12T22:32:16.234Z",
    "updated_at": "2025-06-12T22:32:16.451Z"
  }
}
```

**Status Codes:**
- `200 OK` - Location updated successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - Insufficient permissions or location belongs to another organization
- `404 Not Found` - Location not found

---

### 5. Deactivate Location
Soft delete a location (sets `is_active` to false).

**Endpoint:** `DELETE /api/organizations/mine/locations/:locationId`

**Authentication:** Required (JWT)

**Authorization:** `admin_referring`, `admin_radiology`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `locationId` - The ID of the location to deactivate

**Response:**
```json
{
  "message": "Location deactivated successfully"
}
```

**Status Codes:**
- `200 OK` - Location deactivated successfully
- `400 Bad Request` - Invalid location ID format
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - Insufficient permissions or location belongs to another organization
- `404 Not Found` - Location not found

**Notes:**
- Deactivated locations are not returned in list queries
- Deactivated locations cannot be retrieved or updated
- This is a soft delete - the location record remains in the database

---

### 6. List Connected Organization Locations
Get locations for an organization you have an active connection with. This is used in the order finalization workflow to select a specific radiology facility.

**Endpoint:** `GET /api/organizations/:orgId/locations`

**Authentication:** Required (JWT)

**Authorization:** `admin_referring`, `admin_radiology`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `orgId` - The ID of the connected organization

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "organization_id": 456,
      "name": "Main Campus",
      "address": "123 Medical Center Dr",
      "city": "Chicago",
      "state": "IL",
      "zip": "60601",
      "phone": "312-555-0100",
      "fax": "312-555-0101",
      "email": "maincampus@radiology.com",
      "active": true,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": 124,
      "organization_id": 456,
      "name": "North Branch",
      "address": "456 Healthcare Ave",
      "city": "Evanston",
      "state": "IL",
      "zip": "60201",
      "phone": "847-555-0200",
      "fax": "847-555-0201",
      "email": "northbranch@radiology.com",
      "active": true,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid organization ID
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - No active connection exists between organizations
- `500 Internal Server Error` - Server error

**Notes:**
- Requires an active connection between your organization and the target organization
- Only returns active locations
- Used primarily in the order finalization workflow for selecting radiology facilities

---

## Error Responses

All endpoints follow a standard error response format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

Common error scenarios:
- **Invalid token**: `{"message": "Invalid or expired token"}`
- **Insufficient permissions**: `{"message": "Forbidden"}`
- **Location not found**: `{"message": "Location not found"}`
- **Invalid location ID**: `{"message": "Invalid location ID"}`

---

## Business Rules

1. **Organization Isolation**: Users can only manage locations within their own organization
2. **Connected Organization Access**: Users can view (but not modify) locations of organizations they have active connections with
3. **Soft Deletes**: Locations are never permanently deleted, only deactivated
4. **Active Filter**: List endpoints only return active locations (`is_active = true`)
5. **Role Restrictions**: Only admin roles (`admin_referring`, `admin_radiology`) can manage locations

---

## Related Endpoints

- **User Location Assignment**: See [User Management API](user-management.md) for endpoints to assign users to locations
- **Organization Management**: See [Organization Management API](organization-management.md) for organization-level operations
- **Connection Management**: See [Connection Management API](connection-management.md) for establishing connections between organizations

---

## Implementation Notes

- All location IDs are integers
- State codes must be 2 uppercase letters
- Phone numbers are stored as strings (no specific format enforced)
- Timestamps are in ISO 8601 format with timezone
- Location names should be unique within an organization (not enforced at API level)