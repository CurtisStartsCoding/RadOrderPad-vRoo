# User Management

This section covers endpoints related to user management in the RadOrderPad system.

## User Location Assignments

The following endpoints are used to manage user location assignments. These endpoints allow organization administrators to assign users to specific locations within their organization.

**Note:** These endpoints are mounted at `/api/user-locations` instead of `/api/users` to avoid conflicts with other user-related endpoints.

### List User Locations

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
    },
    {
      "id": 2,
      "organization_id": 1,
      "name": "Downtown Clinic",
      "address_line1": "456 Center St",
      "address_line2": null,
      "city": "Anytown",
      "state": "CA",
      "zip_code": "12345",
      "phone_number": "555-987-6543",
      "is_active": true,
      "created_at": "2025-04-01T12:00:00.000Z",
      "updated_at": "2025-04-01T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- 400 Bad Request: If the userId is not a valid number
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the user does not exist or does not belong to the admin's organization
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to retrieve a list of locations assigned to a specific user.
- The user must belong to the admin's organization.
- Only active locations are returned.
- Use this endpoint when implementing the user location management view.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-user-location-assignment.js (with bat/sh wrappers)
- **Notes:** Successfully retrieves locations assigned to a user within the admin's organization.

### Assign User to Location

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

**Error Responses:**
- 400 Bad Request: If the userId or locationId is not a valid number
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the user or location does not exist or does not belong to the admin's organization
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to assign a user to a specific location.
- The user and location must belong to the admin's organization.
- If the user is already assigned to the location, the endpoint will return a success response.
- Use this endpoint when implementing the user location management view.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-user-location-assignment.js (with bat/sh wrappers)
- **Notes:** Successfully assigns a user to a location within the admin's organization.

### Unassign User from Location

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

**Error Responses:**
- 400 Bad Request: If the userId or locationId is not a valid number
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the user or location does not exist, does not belong to the admin's organization, or the user is not assigned to the location
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to unassign a user from a specific location.
- The user and location must belong to the admin's organization.
- If the user is not assigned to the location, the endpoint will return a 404 Not Found response.
- Use this endpoint when implementing the user location management view.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-user-location-assignment.js (with bat/sh wrappers)
- **Notes:** Successfully unassigns a user from a location within the admin's organization.

## Get Current User Profile

**Endpoint:** `GET /api/users/me`

**Description:** Retrieves the profile information for the currently authenticated user.

**Authentication:** Required (any role)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "physician",
    "organization_id": 1,
    "npi": "1234567890",
    "specialty": "Cardiology",
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-04-01T12:00:00.000Z",
    "updated_at": "2025-04-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 404 Not Found: If the user profile is not found
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to retrieve the profile information for the currently authenticated user.
- The response includes basic user information such as name, email, role, and organization ID.
- Additional fields like NPI and specialty are included if available.
- This endpoint is useful for displaying user information in the UI, such as in a profile page or header.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-get-user-me.bat, test-get-user-me.sh

## Update Current User Profile

**Endpoint:** `PUT /api/users/me`

**Description:** Updates the profile information for the currently authenticated user.

**Authentication:** Required (any role)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "555-123-4567",
  "specialty": "Cardiology",
  "npi": "1234567890"
}
```
All fields are optional. Only the fields that are provided will be updated.

**Response:**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "physician",
    "organization_id": 1,
    "npi": "1234567890",
    "specialty": "Cardiology",
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-04-01T12:00:00.000Z",
    "updated_at": "2025-04-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- 400 Bad Request: If no valid fields are provided or if the provided fields are invalid
- 401 Unauthorized: If the user is not authenticated
- 404 Not Found: If the user profile is not found
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to update the profile information for the currently authenticated user.
- Only the fields that are provided in the request body will be updated.
- Restricted fields like `role`, `organization_id`, `is_active`, `email_verified`, and `email` cannot be updated through this endpoint.
- This endpoint is useful for allowing users to update their own profile information.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-update-user-me.bat, test-update-user-me.sh

## List Organization Users

**Endpoint:** `GET /api/users`

**Description:** Retrieves a list of all users belonging to the authenticated administrator's organization with pagination, sorting, and filtering options.

**Authentication:** Required (admin_referring, admin_radiology roles only)

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `sortBy` (optional): Field to sort by (default: last_name). Valid values: last_name, first_name, email, role, created_at, is_active
- `sortOrder` (optional): Sort direction (asc or desc, default: asc)
- `role` (optional): Filter by role (e.g., physician, radiologist)
- `status` (optional): Filter by active status (true or false)
- `name` (optional): Search by name (searches in both first_name and last_name)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user1@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "physician",
        "organization_id": 1,
        "npi": "1234567890",
        "specialty": "Cardiology",
        "is_active": true,
        "email_verified": true,
        "created_at": "2025-04-01T12:00:00.000Z",
        "updated_at": "2025-04-01T12:00:00.000Z"
      },
      {
        "id": 2,
        "email": "user2@example.com",
        "first_name": "Jane",
        "last_name": "Smith",
        "role": "radiologist",
        "organization_id": 1,
        "npi": "0987654321",
        "specialty": "Radiology",
        "is_active": true,
        "email_verified": true,
        "created_at": "2025-04-01T12:00:00.000Z",
        "updated_at": "2025-04-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have admin privileges
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used by organization administrators to view and manage users within their organization.
- The response includes a paginated list of users with basic user information.
- The pagination object provides information about the total number of users, current page, items per page, and total pages.
- Filtering options allow administrators to search for specific users by role, status, or name.
- Sorting options allow administrators to order the results by different fields.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-list-org-users.bat, test-list-org-users.sh

## Get User by ID

**Endpoint:** `GET /api/users/{userId}`

**Description:** Retrieves the profile information for a specific user by ID. This endpoint is restricted to organization administrators and only allows them to view users within their own organization.

**Authentication:** Required (admin_referring, admin_radiology roles only)

**Path Parameters:**
- `userId`: The ID of the user to retrieve

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "physician",
    "organization_id": 1,
    "npi": "1234567890",
    "specialty": "Cardiology",
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-04-01T12:00:00.000Z",
    "updated_at": "2025-04-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- 400 Bad Request: If the user ID is invalid (not a number)
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have admin privileges
- 404 Not Found: If the user is not found or not in the admin's organization
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used by organization administrators to view detailed information about a specific user in their organization.
- The endpoint enforces organization boundaries - administrators can only view users within their own organization.
- This is useful for user management interfaces where an admin needs to view or edit a specific user's details.
- The response includes the same user profile information as the GET /api/users/me endpoint.

**Security Considerations:**
- The endpoint includes a critical security check that verifies the requested user belongs to the same organization as the requesting admin.
- This prevents administrators from accessing user data from other organizations.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-get-org-user-by-id.bat, test-get-org-user-by-id.sh

## Update User by ID

**Endpoint:** `PUT /api/users/{userId}`

**Description:** Updates the profile information for a specific user by ID. This endpoint is restricted to organization administrators and only allows them to update users within their own organization.

**Authentication:** Required (admin_referring, admin_radiology roles only)

**Path Parameters:**
- `userId`: The ID of the user to update

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "phoneNumber": "555-987-6543",
  "specialty": "Neurology",
  "npi": "9876543210",
  "role": "physician",
  "isActive": true
}
```
All fields are optional. Only the fields that are provided will be updated.

**Response:**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "id": 9,
    "email": "user@example.com",
    "first_name": "Updated",
    "last_name": "Name",
    "role": "physician",
    "organization_id": 1,
    "npi": "9876543210",
    "specialty": "Neurology",
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-04-01T12:00:00.000Z",
    "updated_at": "2025-04-24T03:15:00.000Z"
  }
}
```

**Error Responses:**
- 400 Bad Request: If no valid fields are provided or if the provided fields are invalid
- 400 Bad Request: If an invalid role is provided (admin can only assign certain roles)
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have admin privileges
- 404 Not Found: If the user is not found or not in the admin's organization
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used by organization administrators to update information for users within their organization.
- The endpoint enforces organization boundaries - administrators can only update users within their own organization.
- Role assignment is restricted based on the admin's role:
  - admin_referring can only assign physician and admin_staff roles
  - admin_radiology can only assign scheduler and radiologist roles
- Sensitive fields like email, password_hash, organization_id, and email_verified cannot be updated through this endpoint.
- This endpoint is useful for user management interfaces where an admin needs to update a user's details or change their role.

**Security Considerations:**
- The endpoint includes a critical security check that verifies the target user belongs to the same organization as the requesting admin.
- This prevents administrators from modifying user data from other organizations.
- Role assignment restrictions prevent privilege escalation.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-update-org-user.bat, test-update-org-user.sh

## User Invitation

For information about user invitation endpoints, see [User Invitation Details](./user-invitation-details.md).

## Deactivate User by ID

**Endpoint:** `DELETE /api/users/{userId}`

**Description:** Deactivates a specific user by ID by setting their is_active flag to false. This is a "soft delete" that preserves the user record but prevents login and system access. This endpoint is restricted to organization administrators and only allows them to deactivate users within their own organization.

**Authentication:** Required (admin_referring, admin_radiology roles only)

**Path Parameters:**
- `userId`: The ID of the user to deactivate

**Response:**
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

**Error Responses:**
- 400 Bad Request: If the user ID is invalid (not a number)
- 400 Bad Request: If the admin attempts to deactivate their own account
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have admin privileges
- 404 Not Found: If the user is not found or not in the admin's organization
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used by organization administrators to deactivate users within their organization.
- The endpoint enforces organization boundaries - administrators can only deactivate users within their own organization.
- Administrators cannot deactivate their own accounts to prevent accidental lockout.
- This is a "soft delete" operation - the user record remains in the database but with is_active set to false.
- Deactivated users cannot log in to the system or access any resources.
- This endpoint is useful for handling employee departures or account suspensions.

**Security Considerations:**
- The endpoint includes a critical security check that verifies the target user belongs to the same organization as the requesting admin.
- This prevents administrators from deactivating users from other organizations.
- The self-deactivation prevention check ensures administrators cannot accidentally lock themselves out of the system.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-deactivate-org-user.bat, test-deactivate-org-user.sh