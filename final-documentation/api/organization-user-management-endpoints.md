# Organization and User Management API Endpoints

**Version:** 1.0  
**Date:** June 11, 2025  
**Role:** admin_referring  

This document provides comprehensive documentation for all organization and user management endpoints available to users with the `admin_referring` role.

---

## Table of Contents

1. [Organization Management](#organization-management)
   - [Get Organization Profile](#get-organization-profile)
   - [Update Organization Profile](#update-organization-profile)
   - [Search Organizations](#search-organizations)
2. [Location Management](#location-management)
   - [List Locations](#list-locations)
   - [Create Location](#create-location)
   - [Get Location Details](#get-location-details)
   - [Update Location](#update-location)
   - [Deactivate Location](#deactivate-location)
3. [User Management](#user-management)
   - [List Organization Users](#list-organization-users)
   - [Get User Details](#get-user-details)
   - [Update User](#update-user)
   - [Deactivate User](#deactivate-user)
4. [User Invitations](#user-invitations)
   - [Invite User](#invite-user)
5. [User Location Management](#user-location-management)
   - [List User Locations](#list-user-locations)
   - [Assign User to Location](#assign-user-to-location)
   - [Unassign User from Location](#unassign-user-from-location)

---

## Organization Management

### Get Organization Profile

Retrieve details of the authenticated user's organization.

**Endpoint:** `GET /api/organizations/mine`

**Authorization:** Requires authentication (any role)

**Response:**
```json
{
  "success": true,
  "organization": {
    "id": "org123",
    "name": "Medical Center ABC",
    "type": "referring",
    "npi": "1234567890",
    "taxId": "12-3456789",
    "phone": "(555) 123-4567",
    "email": "admin@medicalcenterabc.com",
    "address": {
      "street": "123 Medical Way",
      "city": "Healthcare City",
      "state": "CA",
      "zip": "90210"
    },
    "isActive": true,
    "createdAt": "2025-06-01T00:00:00Z",
    "updatedAt": "2025-06-11T00:00:00Z"
  }
}
```

### Update Organization Profile

Update details of the authenticated user's organization.

**Endpoint:** `PUT /api/organizations/mine`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Request Body:**
```json
{
  "name": "Medical Center ABC Updated",
  "phone": "(555) 123-4568",
  "email": "newadmin@medicalcenterabc.com",
  "address": {
    "street": "124 Medical Way",
    "city": "Healthcare City",
    "state": "CA",
    "zip": "90211"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization updated successfully",
  "organization": {
    "id": "org123",
    "name": "Medical Center ABC Updated",
    // ... updated organization details
  }
}
```

### Search Organizations

Search for potential partner organizations for connection requests.

**Endpoint:** `GET /api/organizations`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Query Parameters:**
- `name` (optional): Filter by organization name
- `npi` (optional): Filter by NPI number
- `type` (optional): Filter by organization type (referring/radiology)
- `city` (optional): Filter by city
- `state` (optional): Filter by state
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Example:** `GET /api/organizations?type=radiology&state=CA&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "organizations": [
    {
      "id": "org456",
      "name": "Radiology Partners",
      "type": "radiology",
      "npi": "0987654321",
      "city": "Los Angeles",
      "state": "CA"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

## Location Management

### List Locations

Retrieve all locations for the authenticated user's organization.

**Endpoint:** `GET /api/organizations/mine/locations`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Response:**
```json
{
  "success": true,
  "locations": [
    {
      "id": "loc123",
      "name": "Main Campus",
      "address": {
        "street": "123 Medical Way",
        "city": "Healthcare City",
        "state": "CA",
        "zip": "90210"
      },
      "phone": "(555) 123-4567",
      "isActive": true,
      "createdAt": "2025-06-01T00:00:00Z"
    }
  ]
}
```

### Create Location

Add a new location to the organization.

**Endpoint:** `POST /api/organizations/mine/locations`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Request Body:**
```json
{
  "name": "North Campus",
  "address": {
    "street": "456 Health Ave",
    "city": "Medical Town",
    "state": "CA",
    "zip": "90211"
  },
  "phone": "(555) 987-6543"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Location created successfully",
  "location": {
    "id": "loc456",
    "name": "North Campus",
    // ... location details
  }
}
```

### Get Location Details

Retrieve details of a specific location.

**Endpoint:** `GET /api/organizations/mine/locations/{locationId}`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Path Parameters:**
- `locationId`: The ID of the location to retrieve

**Response:**
```json
{
  "success": true,
  "location": {
    "id": "loc123",
    "name": "Main Campus",
    "address": {
      "street": "123 Medical Way",
      "city": "Healthcare City",
      "state": "CA",
      "zip": "90210"
    },
    "phone": "(555) 123-4567",
    "isActive": true,
    "createdAt": "2025-06-01T00:00:00Z",
    "updatedAt": "2025-06-11T00:00:00Z"
  }
}
```

### Update Location

Update details of a specific location.

**Endpoint:** `PUT /api/organizations/mine/locations/{locationId}`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Path Parameters:**
- `locationId`: The ID of the location to update

**Request Body:**
```json
{
  "name": "Main Campus - Updated",
  "phone": "(555) 123-4568"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Location updated successfully",
  "location": {
    "id": "loc123",
    "name": "Main Campus - Updated",
    // ... updated location details
  }
}
```

### Deactivate Location

Deactivate a location (soft delete).

**Endpoint:** `DELETE /api/organizations/mine/locations/{locationId}`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Path Parameters:**
- `locationId`: The ID of the location to deactivate

**Response:**
```json
{
  "success": true,
  "message": "Location deactivated successfully"
}
```

---

## User Management

### List Organization Users

Retrieve all users belonging to the administrator's organization.

**Endpoint:** `GET /api/users`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `sortBy` (optional): Field to sort by (default: last_name)
- `sortOrder` (optional): Sort direction (asc or desc, default: asc)
- `role` (optional): Filter by role
- `status` (optional): Filter by active status (true or false)
- `name` (optional): Search by name

**Example:** `GET /api/users?role=physician&status=true&page=1`

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user123",
      "email": "doctor@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "physician",
      "specialty": "Orthopedics",
      "npi": "1234567890",
      "phoneNumber": "(555) 123-4567",
      "isActive": true,
      "createdAt": "2025-06-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Get User Details

Retrieve details of a specific user within the organization.

**Endpoint:** `GET /api/users/{userId}`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Path Parameters:**
- `userId`: The ID of the user to retrieve

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "email": "doctor@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "physician",
    "specialty": "Orthopedics",
    "npi": "1234567890",
    "phoneNumber": "(555) 123-4567",
    "isActive": true,
    "createdAt": "2025-06-01T00:00:00Z",
    "updatedAt": "2025-06-11T00:00:00Z",
    "lastLogin": "2025-06-10T15:30:00Z"
  }
}
```

### Update User

Update a user's profile within the organization.

**Endpoint:** `PUT /api/users/{userId}`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Path Parameters:**
- `userId`: The ID of the user to update

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "(555) 987-6543",
  "specialty": "Cardiology",
  "npi": "0987654321",
  "role": "physician",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "user123",
    // ... updated user details
  }
}
```

### Deactivate User

Deactivate a user account within the organization.

**Endpoint:** `DELETE /api/users/{userId}`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Path Parameters:**
- `userId`: The ID of the user to deactivate

**Response:**
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

---

## User Invitations

### Invite User

Invite a new user to join the organization.

**Endpoint:** `POST /api/user-invites/invite`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Request Body:**
```json
{
  "email": "newdoctor@example.com",
  "role": "physician"
}
```

**Valid Roles:**
- `physician`
- `admin_staff`
- `scheduler`
- `radiologist`

**Response:**
```json
{
  "success": true,
  "message": "Invitation sent successfully"
}
```

**Error Responses:**
- `409 Conflict`: User with this email already exists in the organization
- `409 Conflict`: An invitation is already pending for this email address

**Notes:**
- The invited user will receive an email with a secure token
- The invitation expires after 7 days
- The invitation email includes the organization name and inviter's name

---

## User Location Management

### List User Locations

Retrieve all locations assigned to a specific user.

**Endpoint:** `GET /api/user-locations/{userId}/locations`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Path Parameters:**
- `userId`: The ID of the user

**Response:**
```json
{
  "success": true,
  "locations": [
    {
      "id": "loc123",
      "name": "Main Campus",
      "address": {
        "street": "123 Medical Way",
        "city": "Healthcare City",
        "state": "CA",
        "zip": "90210"
      },
      "assignedAt": "2025-06-05T00:00:00Z"
    }
  ]
}
```

### Assign User to Location

Assign a user to a specific location.

**Endpoint:** `POST /api/user-locations/{userId}/locations/{locationId}`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Path Parameters:**
- `userId`: The ID of the user
- `locationId`: The ID of the location

**Response:**
```json
{
  "success": true,
  "message": "User assigned to location successfully"
}
```

### Unassign User from Location

Remove a user's assignment from a specific location.

**Endpoint:** `DELETE /api/user-locations/{userId}/locations/{locationId}`

**Authorization:** Requires `admin_referring` or `admin_radiology` role

**Path Parameters:**
- `userId`: The ID of the user
- `locationId`: The ID of the location

**Response:**
```json
{
  "success": true,
  "message": "User unassigned from location successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred while processing the request"
}
```

---

## Security Considerations

1. **Authentication**: All endpoints require a valid JWT token
2. **Authorization**: Endpoints are restricted to users with `admin_referring` or `admin_radiology` roles
3. **Organization Boundaries**: Admins can only manage users and locations within their own organization
4. **Data Privacy**: User and organization data is isolated by organization membership
5. **Input Validation**: All inputs are validated for format and content
6. **SQL Injection Protection**: All database queries use parameterized statements

---

## Best Practices

1. **Pagination**: Use pagination parameters for list endpoints to manage large datasets
2. **Filtering**: Apply filters to reduce data transfer and improve performance
3. **Error Handling**: Implement proper error handling for all API responses
4. **Token Management**: Ensure JWT tokens are securely stored and refreshed as needed
5. **Rate Limiting**: Be aware of rate limits on API endpoints
6. **Audit Trail**: All modifications to users and locations are logged for audit purposes

---

## Related Documentation

- [Role-Based Access Control](../DOCS/role_based_access.md)
- [Location Management Implementation](../DOCS/implementation/location-management-implementation.md)
- [User Invitation Implementation](../DOCS/implementation/user-invitation-implementation.md)
- [API Endpoints Overview](../DOCS/api_endpoints.md)