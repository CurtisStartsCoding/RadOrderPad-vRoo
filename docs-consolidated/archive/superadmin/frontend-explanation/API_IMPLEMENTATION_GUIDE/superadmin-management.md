# Superadmin Management

This section covers endpoints that are specifically for superadmin users, who have system-wide access and can manage all organizations and users.

## List Organizations

**Endpoint:** `GET /api/superadmin/organizations`

**Description:** Retrieves a list of all organizations in the system.

**Authentication:** Required (super_admin role only)

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Test Organization",
      "type": "referring",
      "npi": null,
      "tax_id": null,
      "address_line1": null,
      "address_line2": null,
      "city": null,
      "state": null,
      "zip_code": null,
      "phone_number": null,
      "fax_number": null,
      "contact_email": null,
      "website": null,
      "logo_url": null,
      "billing_id": "cus_TEST123456",
      "credit_balance": 697,
      "subscription_tier": "tier_1",
      "status": "active",
      "assigned_account_manager_id": null,
      "created_at": "2025-04-13T16:34:44.148Z",
      "updated_at": "2025-04-21T04:25:09.592Z"
    },
    {
      "id": 2,
      "name": "Test Radiology Group",
      "type": "radiology_group",
      "npi": "0987654321",
      "tax_id": "98-7654321",
      "address_line1": "456 Imaging Ave",
      "address_line2": null,
      "city": "Test City",
      "state": "TS",
      "zip_code": "12345",
      "phone_number": "555-987-6543",
      "fax_number": null,
      "contact_email": "admin@testradiology.com",
      "website": null,
      "logo_url": null,
      "billing_id": null,
      "credit_balance": 10000,
      "subscription_tier": null,
      "status": "active",
      "assigned_account_manager_id": null,
      "created_at": "2025-04-13T21:53:08.889Z",
      "updated_at": "2025-04-13T21:53:08.889Z"
    }
  ]
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the super_admin role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a list of all organizations in the superadmin dashboard.
- The response includes detailed information about each organization, including contact information, billing details, and status.
- Only users with the super_admin role can access this endpoint.
- The endpoint returns organizations of all types (referring and radiology_group).
- Use this endpoint when implementing the organization management view in the superadmin dashboard.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-superadmin-organizations.js, test-superadmin-endpoints.js

## List Users

**Endpoint:** `GET /api/superadmin/users`

**Description:** Retrieves a list of all users in the system across all organizations.

**Authentication:** Required (super_admin role only)

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 4,
      "email": "test.admin_staff@example.com",
      "first_name": "Test",
      "last_name": "AdminStaff",
      "role": "admin_staff",
      "is_active": true,
      "last_login": "2025-04-22T16:52:43.291Z",
      "created_at": "2025-04-21T16:06:38.559Z",
      "email_verified": true,
      "npi": null,
      "specialty": null,
      "phone_number": null,
      "organization_id": 1,
      "organization_name": "Test Organization",
      "organization_type": "referring"
    },
    {
      "id": 1,
      "email": "test.physician@example.com",
      "first_name": "Test",
      "last_name": "Physician",
      "role": "physician",
      "is_active": true,
      "last_login": "2025-04-22T16:52:43.463Z",
      "created_at": "2025-04-13T16:34:49.727Z",
      "email_verified": true,
      "npi": null,
      "specialty": null,
      "phone_number": null,
      "organization_id": 1,
      "organization_name": "Test Organization",
      "organization_type": "referring"
    }
    // Additional users omitted for brevity
  ]
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the super_admin role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a list of all users across all organizations in the superadmin dashboard.
- The response includes detailed information about each user, including their organization, role, and status.
- Only users with the super_admin role can access this endpoint.
- The endpoint returns users with all roles (admin_staff, physician, admin_referring, super_admin, admin_radiology, scheduler, radiologist).
- The response includes the last_login timestamp, which can be useful for tracking user activity.
- Use this endpoint when implementing the user management view in the superadmin dashboard.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-superadmin-users.js, test-superadmin-endpoints.js

## Get Organization Details

**Endpoint:** `GET /api/superadmin/organizations/{organizationId}`

**Description:** Retrieves detailed information about a specific organization.

**Authentication:** Required (super_admin role only)

**URL Parameters:**
- `organizationId`: The ID of the organization to retrieve

**Response:**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "name": "Test Organization",
      "type": "referring",
      "npi": null,
      "tax_id": null,
      "address_line1": null,
      "address_line2": null,
      "city": null,
      "state": null,
      "zip_code": null,
      "phone_number": null,
      "fax_number": null,
      "contact_email": null,
      "website": null,
      "logo_url": null,
      "billing_id": "cus_TEST123456",
      "credit_balance": 697,
      "subscription_tier": "tier_1",
      "status": "active",
      "assigned_account_manager_id": null,
      "created_at": "2025-04-13T16:34:44.148Z",
      "updated_at": "2025-04-21T04:25:09.592Z"
    },
    "users": [
      // List of users in this organization
    ],
    "connections": [
      // List of connections with other organizations
    ],
    "billingHistory": [
      // List of billing events
    ]
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the super_admin role
- 404 Not Found: If the organization does not exist
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to view detailed information about a specific organization.
- The response includes related information such as users, connections, and billing history.
- Only users with the super_admin role can access this endpoint.
- Use this endpoint when implementing the organization detail view in the superadmin dashboard.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-superadmin-organizations.js

## Path Restrictions

The following superadmin-related endpoints have path restrictions:

- `GET /api/superadmin`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use specific superadmin endpoints like `GET /api/superadmin/users` or `GET /api/superadmin/organizations` instead.