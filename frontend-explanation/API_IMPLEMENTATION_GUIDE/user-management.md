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

## User Invitation

For information about user invitation endpoints, see [User Invitation Details](./user-invitation-details.md).