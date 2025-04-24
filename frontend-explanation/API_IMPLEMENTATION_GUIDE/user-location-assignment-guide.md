# User Location Assignment Guide

This guide provides detailed information on implementing user location assignment functionality in the RadOrderPad system.

## Overview

The user location assignment feature allows organization administrators to assign users to specific locations within their organization. This is useful for organizations with multiple facilities, where users may need to be restricted to specific locations.

## API Endpoints

The following endpoints are available for managing user location assignments:

### 1. List User Locations

**Endpoint:** `GET /api/user-locations/{userId}/locations`

**Description:** Retrieves a list of locations assigned to a specific user within the admin's organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**URL Parameters:**
- `userId`: The ID of the user to retrieve locations for

**Response:**
```json
{
  "locations": [
    {
      "id": 1,
      "organization_id": 1,
      "name": "Main Office",
      "address_line1": "123 Main St",
      "address_line2": "Suite 100",
      "city": "Anytown",
      "state": "CA",
      "zip_code": "12345",
      "phone_number": "555-123-4567",
      "is_active": true,
      "created_at": "2025-04-01T12:00:00.000Z",
      "updated_at": "2025-04-01T12:00:00.000Z"
    }
  ]
}
```

### 2. Assign User to Location

**Endpoint:** `POST /api/user-locations/{userId}/locations/{locationId}`

**Description:** Assigns a user to a specific location within the admin's organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**URL Parameters:**
- `userId`: The ID of the user to assign
- `locationId`: The ID of the location to assign the user to

**Response:**
```json
{
  "message": "User assigned to location successfully",
  "userId": 1,
  "locationId": 2
}
```

### 3. Unassign User from Location

**Endpoint:** `DELETE /api/user-locations/{userId}/locations/{locationId}`

**Description:** Unassigns a user from a specific location within the admin's organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**URL Parameters:**
- `userId`: The ID of the user to unassign
- `locationId`: The ID of the location to unassign the user from

**Response:**
```json
{
  "message": "User unassigned from location successfully",
  "userId": 1,
  "locationId": 2
}
```

## Implementation Guide

### Frontend Implementation

1. **User Location Management Interface**

   Create a user location management interface for administrators that allows them to:
   - View a list of users in their organization
   - Select a user to manage their location assignments
   - View the locations assigned to the selected user
   - Assign the user to additional locations
   - Unassign the user from locations

2. **User Selection**

   Implement a user selection component that:
   - Fetches users from the `GET /api/users` endpoint
   - Displays a list of users with their names, roles, and other relevant information
   - Allows the administrator to select a user to manage their location assignments

3. **Location Assignment Management**

   Implement a location assignment management component that:
   - Fetches the user's assigned locations from the `GET /api/user-locations/{userId}/locations` endpoint
   - Fetches all locations in the organization from the `GET /api/organizations/mine` endpoint
   - Displays a list of all locations with checkboxes to indicate assignment status
   - Allows the administrator to assign/unassign the user to/from locations
   - Calls the appropriate API endpoints when assignments are changed

4. **Error Handling**

   Implement proper error handling for:
   - 400 Bad Request: If the userId or locationId is not a valid number
   - 401 Unauthorized: If the user is not authenticated
   - 403 Forbidden: If the user does not have the appropriate role
   - 404 Not Found: If the user or location does not exist or does not belong to the admin's organization
   - 500 Internal Server Error: If there is a server error

### Backend Implementation

The backend implementation is already complete and includes:

1. **Controllers**
   - `list-user-locations.ts`: Handles GET requests to retrieve locations assigned to a user
   - `assign-user-to-location.ts`: Handles POST requests to assign a user to a location
   - `unassign-user-from-location.ts`: Handles DELETE requests to unassign a user from a location

2. **Services**
   - `list-user-locations.ts`: Service function to retrieve locations assigned to a user
   - `assign-user-to-location.ts`: Service function to assign a user to a location
   - `unassign-user-from-location.ts`: Service function to unassign a user from a location

3. **Database Queries**
   - `list-locations.ts`: Query function to retrieve locations assigned to a user
   - `assign-user.ts`: Query function to assign a user to a location
   - `unassign-user.ts`: Query function to unassign a user from a location

## Testing

The user location assignment functionality has been thoroughly tested using the following test scripts:

- `test-user-location-assignment.js`: Tests all user location assignment endpoints
- `test-user-location-assignment.bat`: Windows batch script wrapper for the test
- `test-user-location-assignment.sh`: Unix/Linux/macOS shell script wrapper for the test

These tests verify that:
- Users can be assigned to locations within their organization
- Users cannot be assigned to locations from different organizations
- Users can be unassigned from locations
- Proper error handling is implemented for invalid requests

## Use Cases

### 1. Multi-Location Medical Practice

A medical practice with multiple clinic locations can use this feature to:
- Assign physicians to specific clinic locations where they practice
- Assign administrative staff to specific clinic locations where they work
- Ensure that users only see and interact with patients and orders from their assigned locations

### 2. Radiology Group with Multiple Imaging Centers

A radiology group with multiple imaging centers can use this feature to:
- Assign radiologists to specific imaging centers where they read studies
- Assign schedulers to specific imaging centers where they manage appointments
- Ensure that users only see and interact with studies and orders from their assigned locations

## Best Practices

1. **Assign users to appropriate locations during onboarding**
   - When a new user is created, immediately assign them to the appropriate locations
   - This ensures that they have the correct access from the start

2. **Regularly review and update location assignments**
   - As users' responsibilities change, update their location assignments
   - This ensures that they always have the appropriate access

3. **Use location assignments for filtering**
   - When displaying orders, studies, or other data, filter based on the user's assigned locations
   - This ensures that users only see data relevant to their responsibilities

4. **Implement proper error handling**
   - Handle all potential error responses from the API
   - Provide clear error messages to users when operations fail

5. **Implement proper loading states**
   - Show loading indicators when fetching data or performing operations
   - This improves the user experience by providing feedback on the status of operations