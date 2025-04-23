# User Management

This section covers endpoints related to managing users in the RadOrderPad system.

## Get Users

**Endpoint:** `GET /api/users`

**Description:** Retrieves a list of users for the current organization.

**Authentication:** Required (admin_staff, admin_referring, admin_radiology roles)

**Response:**
```json
{
  "users": [
    {
      "id": 3,
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "physician",
      "status": "active",
      "createdAt": "2025-04-01T12:00:00.000Z"
    },
    {
      "id": 4,
      "email": "jane.smith@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "admin_staff",
      "status": "active",
      "createdAt": "2025-04-01T12:30:00.000Z"
    }
  ]
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a list of users for the current organization.
- Use this endpoint when implementing the user management view.

**Implementation Status:**
- **Status:** Not Working
- **Tested With:** test-comprehensive-api.js, test-comprehensive-api-with-roles.js
- **Error:** Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use `GET /api/superadmin/users` to list all users (super_admin role only).

## Get User Details

**Endpoint:** `GET /api/users/{userId}`

**Description:** Retrieves detailed information about a specific user.

**Authentication:** Required (admin_staff, admin_referring, admin_radiology roles)

**URL Parameters:**
- `userId`: The ID of the user to retrieve

**Response:**
```json
{
  "user": {
    "id": 3,
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "physician",
    "status": "active",
    "npi": "1234567890",
    "specialty": "Cardiology",
    "phone_number": "555-123-4567",
    "organization_id": 1,
    "organization_name": "ABC Medical Group",
    "created_at": "2025-04-01T12:00:00.000Z",
    "updated_at": "2025-04-01T12:00:00.000Z",
    "last_login": "2025-04-22T16:52:43.291Z",
    "email_verified": true
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the user does not exist
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to view detailed information about a specific user.
- Use this endpoint when implementing the user detail view.

**Implementation Status:**
- **Status:** Not Working
- **Tested With:** test-comprehensive-api.js
- **Error:** Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.

## Create User

**Endpoint:** `POST /api/users`

**Description:** Creates a new user in the current organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Request Body:**
```json
{
  "email": "new.user@example.com",
  "firstName": "New",
  "lastName": "User",
  "role": "physician",
  "npi": "1234567890",
  "specialty": "Cardiology",
  "phone_number": "555-123-4567"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 10,
    "email": "new.user@example.com",
    "firstName": "New",
    "lastName": "User",
    "role": "physician",
    "status": "pending",
    "npi": "1234567890",
    "specialty": "Cardiology",
    "phone_number": "555-123-4567",
    "organization_id": 1,
    "created_at": "2025-04-22T17:30:00.000Z",
    "updated_at": "2025-04-22T17:30:00.000Z",
    "email_verified": false
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 400 Bad Request: If the request body is invalid
- 409 Conflict: If a user with the same email already exists
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to create a new user in the current organization.
- The new user will receive an email with instructions to set their password.
- Use this endpoint when implementing the user creation form.

**Implementation Status:**
- **Status:** Not Working
- **Tested With:** test-comprehensive-api.js
- **Error:** Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.

## Update User

**Endpoint:** `PUT /api/users/{userId}`

**Description:** Updates information about a specific user.

**Authentication:** Required (admin_referring, admin_radiology roles)

**URL Parameters:**
- `userId`: The ID of the user to update

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "User",
  "role": "admin_staff",
  "npi": "0987654321",
  "specialty": "Radiology",
  "phone_number": "555-987-6543"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 10,
    "email": "new.user@example.com",
    "firstName": "Updated",
    "lastName": "User",
    "role": "admin_staff",
    "status": "active",
    "npi": "0987654321",
    "specialty": "Radiology",
    "phone_number": "555-987-6543",
    "organization_id": 1,
    "created_at": "2025-04-22T17:30:00.000Z",
    "updated_at": "2025-04-22T17:35:00.000Z",
    "email_verified": true
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the user does not exist
- 400 Bad Request: If the request body is invalid
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to update information about a specific user.
- Use this endpoint when implementing the user edit form.

**Implementation Status:**
- **Status:** Not Working
- **Tested With:** test-comprehensive-api.js
- **Error:** Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.

## Get Current User

**Endpoint:** `GET /api/users/me`

**Description:** Retrieves information about the current user.

**Authentication:** Required (all roles)

**Response:**
```json
{
  "user": {
    "id": 3,
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "physician",
    "status": "active",
    "npi": "1234567890",
    "specialty": "Cardiology",
    "phone_number": "555-123-4567",
    "organization_id": 1,
    "organization_name": "ABC Medical Group",
    "created_at": "2025-04-01T12:00:00.000Z",
    "updated_at": "2025-04-01T12:00:00.000Z",
    "last_login": "2025-04-22T16:52:43.291Z",
    "email_verified": true
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to retrieve information about the current user.
- Use this endpoint when implementing the user profile view.

**Implementation Status:**
- **Status:** Not Working
- **Tested With:** test-comprehensive-api.js
- **Error:** Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.

## Path Restrictions

The following user-related endpoints have path restrictions:

- `GET /api/users`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use `GET /api/superadmin/users` to list all users (super_admin role only).
- `GET /api/users/{userId}`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.
- `POST /api/users`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.
- `PUT /api/users/{userId}`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.
- `GET /api/users/me`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.

## Invite User

**Endpoint:** `POST /api/users/invite`

**Description:** Invites a new user to join the organization by sending an email with a secure invitation link.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Request Body:**
```json
{
  "email": "new.user@example.com",
  "role": "physician"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation sent successfully"
}
```

**Error Responses:**
- 400 Bad Request: If the email format is invalid or the role is not valid
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 409 Conflict: If an invitation is already pending for this email address
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to invite new users to join the organization.
- The invited user will receive an email with a secure link to complete their registration.
- Valid roles are: physician, admin_staff, scheduler, radiologist.
- The invitation token expires after 7 days.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-invite-endpoint.js
- **Notes:** Fully implemented and tested with comprehensive test cases including validation, authorization, and duplicate invitation handling.