# Organization Management

This section covers endpoints related to managing organizations in the RadOrderPad system.

## Search Organizations

**Endpoint:** `GET /api/organizations`

**Description:** Search for potential partner organizations. Supports filtering by name, NPI, type, city, and state. Returns organizations excluding the user's own organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Query Parameters:**
- `name` (optional): Filter organizations by name (partial match)
- `npi` (optional): Filter organizations by NPI (exact match)
- `type` (optional): Filter organizations by type (referring_practice, radiology_group)
- `city` (optional): Filter organizations by city (partial match)
- `state` (optional): Filter organizations by state (exact match)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Test Radiology Group",
      "type": "radiology_group",
      "npi": "0987654321",
      "address_line1": "456 Imaging Ave",
      "city": "Test City",
      "state": "TS",
      "zip_code": "12345",
      "phone_number": "555-987-6543",
      "contact_email": "admin@testradiology.com",
      "website": null,
      "logo_url": null,
      "status": "active",
      "created_at": "2025-04-13T21:53:08.889Z"
    },
    {
      "id": 3,
      "name": "Another Medical Practice",
      "type": "referring_practice",
      "npi": "1122334455",
      "address_line1": "789 Health St",
      "city": "Medical City",
      "state": "MC",
      "zip_code": "54321",
      "phone_number": "555-123-7890",
      "contact_email": "admin@anotherpractice.com",
      "website": "https://anotherpractice.com",
      "logo_url": null,
      "status": "active",
      "created_at": "2025-04-13T21:53:08.889Z"
    }
  ]
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to search for potential partner organizations when initiating connection requests.
- The endpoint automatically excludes the requesting user's own organization from the results.
- Only active organizations are returned in the results.
- Results are ordered by organization name in ascending order.
- A limit of 50 organizations is applied to prevent returning excessively large results.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-search-organizations-simple.js
- **Notes:** Successfully returns organizations matching the search criteria, excluding the user's own organization.

## Add Location to Current Organization

**Endpoint:** `POST /api/organizations/mine/locations`

**Description:** Adds a new location to the current user's organization.

**Authentication:** Required (admin_referring role)

**Request Body:**
```json
{
  "name": "Test Location",
  "address_line1": "123 Test St",
  "city": "Testville",
  "state": "TS",
  "zip_code": "12345"
}
```

**Response:**
```json
{
  "message": "Location created successfully",
  "location": {
    "id": 71,
    "organization_id": 1,
    "name": "Test Location",
    "address_line1": "123 Test St",
    "address_line2": null,
    "city": "Testville",
    "state": "TS",
    "zip_code": "12345",
    "phone_number": null,
    "is_active": true,
    "created_at": "2025-04-22T18:14:09.329Z",
    "updated_at": "2025-04-22T18:14:09.329Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring role
- 400 Bad Request: If the request body is missing required fields
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to add a new location to the organization.
- The location will be associated with the organization ID from the user's token.
- Required fields: name, address_line1, city, state, zip_code
- Optional fields: address_line2, phone_number

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-all-missing-endpoints.js

## Get Current Organization

**Endpoint:** `GET /api/organizations/mine`

**Description:** Retrieves information about the current user's organization.

**Authentication:** Required (all roles)

**Response:**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "name": "ABC Medical Group",
      "type": "referring",
      "npi": "1234567890",
      "tax_id": "12-3456789",
      "address_line1": "123 Main St",
      "address_line2": "Suite 100",
      "city": "Anytown",
      "state": "CA",
      "zip_code": "12345",
      "phone_number": "555-123-4567",
      "fax_number": "555-123-4568",
      "contact_email": "contact@abcmedical.com",
      "website": "https://abcmedical.com",
      "logo_url": "https://abcmedical.com/logo.png",
      "billing_id": "cus_1234567890",
      "credit_balance": 500,
      "subscription_tier": "tier_1",
      "status": "active",
      "created_at": "2025-04-01T12:00:00.000Z",
      "updated_at": "2025-04-01T12:00:00.000Z"
    },
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
    ],
    "users": [
      {
        "id": 1,
        "email": "admin@abcmedical.com",
        "firstName": "Admin",
        "lastName": "User",
        "role": "admin_referring",
        "status": "active",
        "organization_id": 1,
        "created_at": "2025-04-01T12:00:00.000Z",
        "email_verified": true
      }
    ]
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 500 Internal Server Error: If there is a server error
- 501 Not Implemented: The endpoint exists but is not fully implemented

**Usage Notes:**
- This endpoint is used to retrieve information about the current user's organization.
- Use this endpoint when implementing the organization profile view.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-organizations-mine-endpoint.js
- **Notes:** Returns organization details, locations, and users associated with the authenticated user's organization

## Get Organization Details

**Endpoint:** `GET /api/organizations/{organizationId}`

**Description:** Retrieves detailed information about a specific organization.

**Authentication:** Required (admin_staff, admin_referring, admin_radiology roles)

**URL Parameters:**
- `organizationId`: The ID of the organization to retrieve

**Response:**
```json
{
  "organization": {
    "id": 1,
    "name": "ABC Medical Group",
    "type": "referring",
    "npi": "1234567890",
    "tax_id": "12-3456789",
    "address_line1": "123 Main St",
    "address_line2": "Suite 100",
    "city": "Anytown",
    "state": "CA",
    "zip_code": "12345",
    "phone_number": "555-123-4567",
    "fax_number": "555-123-4568",
    "contact_email": "contact@abcmedical.com",
    "website": "https://abcmedical.com",
    "logo_url": "https://abcmedical.com/logo.png",
    "billing_id": "cus_1234567890",
    "credit_balance": 500,
    "subscription_tier": "tier_1",
    "status": "active",
    "created_at": "2025-04-01T12:00:00.000Z",
    "updated_at": "2025-04-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the organization does not exist
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to view detailed information about a specific organization.
- Use this endpoint when implementing the organization detail view.

**Implementation Status:**
- **Status:** Not Working
- **Tested With:** test-comprehensive-api.js
- **Error:** Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.

## Update Organization

**Endpoint:** `PUT /api/organizations/{organizationId}`

**Description:** Updates information about a specific organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**URL Parameters:**
- `organizationId`: The ID of the organization to update

**Request Body:**
```json
{
  "name": "Updated Medical Group",
  "address_line1": "456 New St",
  "address_line2": "Suite 200",
  "city": "Newtown",
  "state": "CA",
  "zip_code": "54321",
  "phone_number": "555-987-6543",
  "fax_number": "555-987-6544",
  "contact_email": "contact@updatedmedical.com",
  "website": "https://updatedmedical.com",
  "logo_url": "https://updatedmedical.com/logo.png"
}
```

**Response:**
```json
{
  "success": true,
  "organization": {
    "id": 1,
    "name": "Updated Medical Group",
    "type": "referring",
    "npi": "1234567890",
    "tax_id": "12-3456789",
    "address_line1": "456 New St",
    "address_line2": "Suite 200",
    "city": "Newtown",
    "state": "CA",
    "zip_code": "54321",
    "phone_number": "555-987-6543",
    "fax_number": "555-987-6544",
    "contact_email": "contact@updatedmedical.com",
    "website": "https://updatedmedical.com",
    "logo_url": "https://updatedmedical.com/logo.png",
    "billing_id": "cus_1234567890",
    "credit_balance": 500,
    "subscription_tier": "tier_1",
    "status": "active",
    "created_at": "2025-04-01T12:00:00.000Z",
    "updated_at": "2025-04-22T17:30:00.000Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the organization does not exist
- 400 Bad Request: If the request body is invalid
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to update information about a specific organization.
- Use this endpoint when implementing the organization edit view.

**Implementation Status:**
- **Status:** Not Working
- **Tested With:** test-comprehensive-api.js
- **Error:** Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.

## Path Restrictions

The following organization-related endpoints have path restrictions:

- `GET /api/organizations/{organizationId}`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.
- `PUT /api/organizations/{organizationId}`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path.

## Update Current Organization

**Endpoint:** `PUT /api/organizations/mine`

**Description:** Updates information about the current user's organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Request Body:**
```json
{
  "name": "Updated Medical Group",
  "address_line1": "456 New St",
  "address_line2": "Suite 200",
  "city": "Newtown",
  "state": "CA",
  "zip_code": "54321",
  "phone_number": "555-987-6543",
  "fax_number": "555-987-6544",
  "contact_email": "contact@updatedmedical.com",
  "website": "https://updatedmedical.com",
  "logo_url": "https://updatedmedical.com/logo.png",
  "npi": "9876543210",
  "tax_id": "98-7654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization profile updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Medical Group",
    "type": "referring_practice",
    "npi": "9876543210",
    "address_line1": "456 New St",
    "address_line2": "Suite 200",
    "city": "Newtown",
    "state": "CA",
    "zip_code": "54321",
    "phone_number": "555-987-6543",
    "fax_number": "555-987-6544",
    "contact_email": "contact@updatedmedical.com",
    "website": "https://updatedmedical.com",
    "logo_url": "https://updatedmedical.com/logo.png",
    "tax_id": "98-7654321",
    "status": "active",
    "created_at": "2025-04-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 400 Bad Request: If the request body is invalid or empty
- 404 Not Found: If the organization does not exist
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to update information about the current user's organization.
- Use this endpoint when implementing the organization profile edit view.
- Restricted fields (id, type, status, credit_balance, billing_id, subscription_tier) cannot be updated through this endpoint.
- Email and website URLs are validated for proper format.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-update-org-mine.js
- **Notes:** Successfully updates organization details for the authenticated admin's organization. Previously returned 501 "Not implemented yet" but has now been fully implemented.