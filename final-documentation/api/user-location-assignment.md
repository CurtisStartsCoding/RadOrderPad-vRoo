# User-Location Assignment API Documentation

## Overview

The user-location assignment endpoints allow administrators to manage which users have access to specific locations within their organization. These endpoints are restricted to admin roles (admin_referring and admin_radiology) and ensure that users and locations belong to the same organization.

## Base URL

All user-location assignment endpoints are prefixed with `/api/users`

## Authentication

All endpoints require JWT authentication with admin roles:
- `admin_referring`
- `admin_radiology`

## Endpoints

### 1. List User Locations

Get all locations assigned to a specific user.

**Endpoint:** `GET /api/users/:userId/locations`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**URL Parameters:**
- `userId` (number, required): ID of the user

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "locations": [
    {
      "id": 81,
      "organization_id": 15,
      "name": "Main Clinic",
      "address": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345",
      "phone": "555-1234",
      "fax": "555-5678",
      "email": "mainclinic@example.com",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- **Status:** 400 Bad Request - Invalid user ID format
  ```json
  {
    "message": "Invalid user ID"
  }
  ```
- **Status:** 404 Not Found - User not found or not authorized
  ```json
  {
    "message": "User not found or not authorized"
  }
  ```

**Notes:**
- Only returns locations for users within the same organization as the authenticated admin
- Returns an empty array if the user has no assigned locations

---

### 2. Assign User to Location

Assign a user to a specific location within the organization.

**Endpoint:** `POST /api/users/:userId/locations/:locationId`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**URL Parameters:**
- `userId` (number, required): ID of the user
- `locationId` (number, required): ID of the location

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "message": "User assigned to location successfully",
  "userId": 29,
  "locationId": 81
}
```

**Error Responses:**
- **Status:** 400 Bad Request - Invalid user ID or location ID format
  ```json
  {
    "message": "Invalid user ID or location ID"
  }
  ```
- **Status:** 404 Not Found - User or location not found or not authorized
  ```json
  {
    "message": "User or location not found or not authorized"
  }
  ```

**Notes:**
- The operation is idempotent - assigning a user to a location they're already assigned to will succeed
- Both the user and location must belong to the same organization as the authenticated admin
- Cross-organization assignments are not allowed

---

### 3. Unassign User from Location

Remove a user's assignment to a specific location.

**Endpoint:** `DELETE /api/users/:userId/locations/:locationId`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**URL Parameters:**
- `userId` (number, required): ID of the user
- `locationId` (number, required): ID of the location

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "message": "User unassigned from location successfully",
  "userId": 29,
  "locationId": 81
}
```

**Error Responses:**
- **Status:** 400 Bad Request - Invalid user ID or location ID format
  ```json
  {
    "message": "Invalid user ID or location ID"
  }
  ```
- **Status:** 404 Not Found - Assignment not found or not authorized
  ```json
  {
    "message": "User-location assignment not found"
  }
  ```

**Notes:**
- Returns 404 if the user-location assignment doesn't exist
- Both the user and location must belong to the same organization as the authenticated admin

## Examples

### Example 1: Assign a user to multiple locations

```javascript
// Assign user 29 to locations 81 and 82
const userId = 29;
const locationIds = [81, 82];

for (const locationId of locationIds) {
  const response = await axios.post(
    `/api/users/${userId}/locations/${locationId}`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  console.log(`Assigned to location ${locationId}:`, response.data);
}
```

### Example 2: Get all locations for a user

```javascript
const userId = 29;

const response = await axios.get(
  `/api/users/${userId}/locations`,
  {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    }
  }
);

console.log(`User ${userId} locations:`, response.data.locations);
```

### Example 3: Remove all location assignments for a user

```javascript
const userId = 29;

// First get all current locations
const getResponse = await axios.get(
  `/api/users/${userId}/locations`,
  {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    }
  }
);

// Then remove each assignment
for (const location of getResponse.data.locations) {
  await axios.delete(
    `/api/users/${userId}/locations/${location.id}`,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  console.log(`Removed from location ${location.id}`);
}
```

## Security Considerations

1. **Organization Isolation**: Users can only manage location assignments within their own organization
2. **Role-Based Access**: Only admin roles can manage user-location assignments
3. **Cross-Organization Protection**: Attempting to assign users or locations from different organizations will fail with 404
4. **Audit Trail**: All assignment changes should be logged for compliance purposes

## Scalability Considerations

The current implementation requires individual API calls for each user-location assignment. This works well for pilot groups but may require bulk operations for larger organizations. See [User-Location Assignment - Scalability Considerations](user-location-assignment-scalability.md) for detailed analysis and future enhancement recommendations.

## Related Endpoints

- **Location Management**: `/api/locations` - Create and manage locations
- **User Management**: `/api/users` - Create and manage users
- **Organization Management**: `/api/organizations/mine` - View organization details including users and locations