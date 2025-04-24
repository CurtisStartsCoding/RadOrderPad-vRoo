# User Management

This section covers endpoints related to user management in the RadOrderPad system.

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

## User Invitation

For information about user invitation endpoints, see [User Invitation Details](./user-invitation-details.md).