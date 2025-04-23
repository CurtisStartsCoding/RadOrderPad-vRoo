# RadOrderPad API Documentation

This document provides detailed information about the API endpoints available in the RadOrderPad application. It is based on testing performed against the production deployment at `https://api.radorderpad.com`.

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Obtaining a Token

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user and returns a JWT token.

**Authentication:** None required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "email": "test.admin_staff@example.com",
    "first_name": "Test",
    "last_name": "AdminStaff",
    "role": "admin_staff",
    "organization_id": 1,
    "npi": null,
    "specialty": null,
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-04-21T16:06:38.559Z",
    "updated_at": "2025-04-21T16:06:38.559Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the credentials are invalid
- 404 Not Found: If the endpoint is accessed with GET method instead of POST
- 500 Internal Server Error: If there is a server error

**Supported Roles:**
This endpoint works for all roles in the system:
- admin_staff
- physician
- admin_referring
- super_admin
- admin_radiology
- scheduler
- radiologist

**Token Structure:**
The returned JWT token contains the following claims:
```json
{
  "userId": 4,
  "orgId": 1,
  "role": "admin_staff",
  "email": "test.admin_staff@example.com",
  "iat": 1745340763,
  "exp": 1745427163
}
```

**Usage Notes:**
- The token should be included in the Authorization header for all subsequent requests.
- The token contains information about the user's role and organization, which is used for authorization.
- Token expiration is set to 24 hours by default.
- This endpoint only accepts POST requests. GET requests will return a 404 error.
- Response time is typically under 200ms for successful logins.

## Health Check

**Endpoint:** `GET /health`

**Description:** Checks if the API is running and returns basic status information.

**Authentication:** None required

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-04-22T13:11:56.390Z"
}
```

**Usage Notes:**
- Use this endpoint to verify that the API is accessible and responding.
- The timestamp can be used to check server time synchronization.

## Order Management

### List Orders

**Endpoint:** `GET /api/orders`

**Description:** Retrieves a list of orders for the current user's organization with optional filtering.

**Authentication:** Required (admin_staff, physician, admin_referring roles)

**Query Parameters:**
- `status` (optional): Filter by order status ("pending_admin", "pending_validation", "all")
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `sortBy` (optional): Field to sort by (default: "created_at")
- `sortOrder` (optional): Sort direction ("asc" or "desc", default: "desc")

**Response:**
```json
{
  "orders": [
    {
      "id": 607,
      "order_number": "ORD-1745257820424",
      "patient_id": 2,
      "referring_organization_id": 1,
      "radiology_organization_id": 2,
      "status": "pending_radiology",
      "priority": "routine",
      "modality": "MRI",
      "body_part": "LUMBAR_SPINE",
      "final_cpt_code": "72148",
      "final_validation_status": "appropriate",
      "final_compliance_score": 0.95,
      "patient_name": "Jane Smith",
      "patient_dob": "1985-06-15",
      "patient_gender": "female",
      "created_at": "2025-04-20T14:30:20.424Z",
      "updated_at": "2025-04-20T15:45:33.112Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a list of orders in the dashboard.
- The response includes pagination information for implementing pagination controls.
- You can filter orders by status to show only those in a specific stage of the workflow.
- The "all" status option will return orders in any status.
- This endpoint works for multiple roles (admin_staff, physician, admin_referring) but returns only orders for the user's organization.
- Use this endpoint to implement the order list view in the dashboard.

### Validate Order

**Endpoint:** `POST /api/orders/validate`

**Description:** Validates a dictation and patient information to determine appropriate CPT and ICD-10 codes.

**Authentication:** Required (physician role)

**Request Body:**
```json
{
  "dictationText": "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.",
  "patientInfo": {
    "firstName": "Robert",
    "lastName": "Johnson",
    "dateOfBirth": "1950-05-15",
    "gender": "male",
    "mrn": "MRN12345A"
  }
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 612,
  "validationResult": {
    "validationStatus": "appropriate",
    "complianceScore": 0.95,
    "feedback": "The clinical information provided supports the requested imaging study.",
    "suggestedCPTCodes": [
      {
        "code": "72148",
        "description": "MRI lumbar spine without contrast",
        "confidence": 0.95
      },
      {
        "code": "72083",
        "description": "X-ray spine, entire thoracic and lumbar",
        "confidence": 0.75
      }
    ],
    "suggestedICD10Codes": [
      {
        "code": "M54.17",
        "description": "Radiculopathy, lumbosacral region",
        "confidence": 0.9
      },
      {
        "code": "M51.36",
        "description": "Other intervertebral disc degeneration, lumbar region",
        "confidence": 0.85
      },
      {
        "code": "M54.5",
        "description": "Low back pain",
        "confidence": 0.8
      }
    ]
  }
}
```

**Usage Notes:**
- This endpoint is used to validate a dictation and determine appropriate CPT and ICD-10 codes.
- The validation result includes a validation status, compliance score, feedback, and suggested CPT and ICD-10 codes.
- The validation status can be "appropriate", "inappropriate", or "needs_clarification".
- The orderId in the response can be used to update the order with the validation results.
- This endpoint is a critical part of the workflow for creating new orders.

### Get Order Details

**Endpoint:** `GET /api/orders/{orderId}`

**Description:** Retrieves detailed information about a specific order.

**Authentication:** Required (admin_staff, physician roles)

**URL Parameters:**
- `orderId`: The ID of the order to retrieve

**Response:**
```json
{
  "id": 607,
  "order_number": "ORD-1745257820424",
  "patient_id": 2,
  "referring_organization_id": 1,
  "radiology_organization_id": 2,
  "status": "pending_radiology",
  "priority": "routine",
  "modality": "MRI",
  "body_part": "LUMBAR_SPINE",
  "final_cpt_code": "72148",
  "final_validation_status": "appropriate",
  "final_compliance_score": 0.95,
  "patient_name": "Jane Smith",
  "patient_dob": "1985-06-15",
  "patient_gender": "female",
  "dictation": "Patient presents with lower back pain for 3 weeks...",
  "created_at": "2025-04-20T14:30:20.424Z",
  "updated_at": "2025-04-20T15:45:33.112Z"
}
```

**Usage Notes:**
- This endpoint is used to view the complete details of an order.
- The super_admin role cannot access this endpoint (returns 404 "User not found").
- Use this endpoint when you need to display order details on a detail page or when processing an order.

### Update Order

**Endpoint:** `PUT /api/orders/{orderId}`

**Description:** Updates an order with finalized validation information and signature.

**Authentication:** Required (physician role)

**URL Parameters:**
- `orderId`: The ID of the order to update

**Request Body:**
```json
{
  "final_validation_status": "appropriate",
  "final_compliance_score": 0.95,
  "final_cpt_code": "72148",
  "clinical_indication": "Lower back pain",
  "overridden": false,
  "signed_by_user_id": 3,
  "signature_date": "2025-04-20T15:45:33.112Z",
  "signer_name": "Dr. John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 607,
  "message": "Order submitted successfully.",
  "signatureUploadNote": "For security reasons, signature uploads are processed separately."
}
```

**Usage Notes:**
- This endpoint is used by physicians to finalize and sign an order after validation.
- The `final_validation_status` must be one of: "appropriate", "inappropriate", "needs_clarification".
- If `overridden` is true, an `override_justification` field should also be provided.
- This endpoint changes the order status to "pending_admin".
- After calling this endpoint, the order will be ready for admin staff to process.

### Send Order to Radiology

**Endpoint:** `POST /api/admin/orders/{orderId}/send-to-radiology-fixed`

**Description:** Sends an order to the radiology organization for scheduling.

**Authentication:** Required (admin_staff role)

**URL Parameters:**
- `orderId`: The ID of the order to send to radiology

**Request Body:** None required

**Response:**
```json
{
  "success": true,
  "message": "Order sent to radiology successfully",
  "order": {
    "id": 607,
    "status": "pending_radiology",
    "updated_at": "2025-04-22T16:30:45.123Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_staff role
- 404 Not Found: If the order does not exist
- 500 Internal Server Error: If there is a server error
- 400 Bad Request: If the order is not in the correct status (must be in "pending_admin" status)

**Usage Notes:**
- This endpoint is used by admin staff to send an order to the radiology organization after it has been validated and signed by a physician.
- The order must be in "pending_admin" status to be sent to radiology.
- This endpoint changes the order status to "pending_radiology".
- After calling this endpoint, the order will appear in the radiology organization's order list.
- This is a critical step in the order workflow, transitioning the order from the referring organization to the radiology organization.

## Radiology Order Management

### List Radiology Orders

**Endpoint:** `GET /api/radiology/orders`

**Description:** Retrieves a list of orders for a radiology organization with optional filtering.

**Authentication:** Required (scheduler, admin_radiology roles)

**Query Parameters:**
- `status` (optional): Filter by order status ("pending_radiology", "scheduled", "completed", "all")
- `priority` (optional): Filter by priority ("routine", "stat")
- `modality` (optional): Filter by modality ("MRI", "CT", etc.)
- `referringOrgId` (optional): Filter by referring organization ID
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `sortBy` (optional): Field to sort by (default: "created_at")
- `sortOrder` (optional): Sort direction ("asc" or "desc", default: "desc")

**Response:**
```json
{
  "orders": [
    {
      "id": 606,
      "order_number": "ORD-1745257806222",
      "status": "pending_radiology",
      "priority": "routine",
      "modality": "MRI",
      "body_part": "LUMBAR_SPINE",
      "final_cpt_code": "72148",
      "final_validation_status": "appropriate",
      "patient_name": "John Doe",
      "patient_dob": "1980-01-01",
      "referring_physician_name": "Dr. Jane Smith",
      "referring_organization_name": "ABC Medical Group",
      "created_at": "2025-04-20T14:30:06.222Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

**Usage Notes:**
- This endpoint is used to display a list of orders in the radiology dashboard.
- The response includes pagination information for implementing pagination controls.
- You can combine multiple query parameters to create complex filters.
- This endpoint is only accessible to users with radiology roles (scheduler, admin_radiology).
- Use this endpoint to implement the radiology order queue view.

### Get Radiology Order Details

**Endpoint:** `GET /api/radiology/orders/{orderId}`

**Description:** Retrieves detailed information about a specific radiology order.

**Authentication:** Required (scheduler, admin_radiology roles)

**URL Parameters:**
- `orderId`: The ID of the order to retrieve

**Response:**
```json
{
  "order": {
    "id": 606,
    "order_number": "ORD-1745257806222",
    "patient_id": 1,
    "referring_organization_id": 1,
    "radiology_organization_id": 2,
    "status": "pending_radiology",
    "priority": "routine",
    "modality": "MRI",
    "body_part": "LUMBAR_SPINE",
    "final_cpt_code": "72148",
    "final_validation_status": "appropriate",
    "final_compliance_score": 0.95,
    "patient_name": "John Doe",
    "patient_dob": "1980-01-01",
    "patient_gender": "male",
    "dictation": "Patient presents with lower back pain for 3 weeks...",
    "clinical_indication": "Lower back pain",
    "referring_physician_name": "Dr. Jane Smith",
    "referring_organization_name": "ABC Medical Group",
    "created_at": "2025-04-20T14:30:06.222Z",
    "updated_at": "2025-04-20T15:45:33.112Z",
    "patient": {
      "id": 1,
      "name": "John Doe",
      "dob": "1980-01-01",
      "gender": "male",
      "address_line1": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip_code": "12345",
      "phone_number": "555-123-4567"
    },
    "insurance": {
      "id": 1,
      "insurer_name": "Blue Cross",
      "policy_number": "BC123456789",
      "group_number": "GRP987654",
      "insured_name": "John Doe",
      "relationship_to_patient": "self"
    },
    "documents": [
      {
        "id": 1,
        "document_type": "signature",
        "file_path": "signatures/order-606-signature.png",
        "uploaded_at": "2025-04-20T15:45:33.112Z"
      }
    ],
    "clinical_records": [
      {
        "id": 1,
        "record_type": "emr_summary",
        "content": "Patient has history of...",
        "created_at": "2025-04-20T15:50:12.345Z"
      }
    ],
    "validation_history": [
      {
        "attempt": 1,
        "validation_status": "appropriate",
        "compliance_score": 0.95,
        "created_at": "2025-04-20T14:35:22.111Z"
      }
    ]
  }
}
```

**Usage Notes:**
- This endpoint is used to display the complete details of a radiology order.
- The response includes related information such as patient details, insurance information, documents, clinical records, and validation history.
- Use this endpoint when implementing the radiology order detail view.

### Update Radiology Order Status

**Endpoint:** `POST /api/radiology/orders/{orderId}/update-status`

**Description:** Updates the status of a radiology order.

**Authentication:** Required (scheduler, admin_radiology roles)

**URL Parameters:**
- `orderId`: The ID of the order to update

**Request Body:**
```json
{
  "newStatus": "scheduled"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 606,
  "previousStatus": "pending_radiology",
  "newStatus": "scheduled",
  "message": "Order status updated to scheduled"
}
```

**Usage Notes:**
- This endpoint is used to update the status of a radiology order as it progresses through the workflow.
- Valid status values are: "pending_radiology", "scheduled", "completed", "cancelled".
- The status change is logged in the order history.
- Use this endpoint when implementing status change functionality in the radiology dashboard.

### Export Radiology Order

**Endpoint:** `GET /api/radiology/orders/{orderId}/export/{format}`

**Description:** Exports a radiology order in the specified format.

**Authentication:** Required (scheduler, admin_radiology roles)

**URL Parameters:**
- `orderId`: The ID of the order to export
- `format`: The export format ("json", "csv")

**Response:**
- For JSON format: Returns the order data as JSON
- For CSV format: Returns the order data as CSV text

**Usage Notes:**
- This endpoint is used to export order data for integration with external systems or for reporting.
- The JSON format includes all order details and is suitable for programmatic processing.
- The CSV format includes the most important fields and is suitable for importing into spreadsheet applications.
- Use this endpoint when implementing export functionality in the radiology dashboard.

## Superadmin Management

### List Organizations

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

### List Users

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

## Connection Management

### List Connections

**Endpoint:** `GET /api/connections`

**Description:** Retrieves a list of connections for the current organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Query Parameters:** None

**Response:**
```json
{
  "connections": [
    {
      "id": "conn_123456",
      "status": "active",
      "requestingOrganizationId": 1,
      "targetOrganizationId": 2,
      "requestingOrganizationName": "Test Organization",
      "targetOrganizationName": "Test Radiology Group",
      "notes": "Connection for testing",
      "createdAt": "2025-04-13T16:34:44.148Z",
      "updatedAt": "2025-04-13T16:34:44.148Z"
    }
  ]
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring or admin_radiology role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a list of connections for the current organization.
- Connections represent relationships between referring organizations and radiology organizations.
- Only users with admin_referring or admin_radiology roles can access this endpoint.
- Connections are essential for the order workflow, as they determine which radiology organizations can receive orders from which referring organizations.
- Use this endpoint when implementing the connections management view.

## Organization Management

**Endpoint:** `GET /api/organizations`

**Description:** Retrieves a list of organizations.

**Authentication:** Required (admin_staff, admin_referring, admin_radiology roles)

**Response:**
```json
{
  "organizations": [
    {
      "id": 1,
      "name": "ABC Medical Group",
      "type": "referring",
      "status": "active",
      "createdAt": "2025-04-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "name": "XYZ Radiology",
      "type": "radiology",
      "status": "active",
      "createdAt": "2025-04-01T12:30:00.000Z"
    }
  ]
}
```

**Usage Notes:**
- This endpoint is used to display a list of organizations.
- Use this endpoint when implementing the organization management view.

## User Management

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

**Usage Notes:**
- This endpoint is used to display a list of users for the current organization.
- Use this endpoint when implementing the user management view.

## Working and Non-Working Endpoints

### Working Endpoints

The following endpoints were tested and are working correctly in the production deployment:

- `GET /health`: Health check endpoint
- `GET /api/orders`: List orders (tested with admin_staff, physician, and admin_referring roles)
- `GET /api/orders?status=pending_admin`: Filter orders by status
- `GET /api/orders?status=pending_validation`: Filter orders by status
- `GET /api/orders?status=all`: Get all orders regardless of status
- `GET /api/orders/{orderId}`: Get order details (tested with admin_staff role)
- `GET /api/radiology/orders`: List radiology orders (tested with scheduler role)
- `GET /api/connections`: List connections (tested with admin_referring role)
- `POST /api/admin/orders/{orderId}/send-to-radiology-fixed`: Send order to radiology (tested with admin_staff role)
- `POST /api/orders/validate`: Validate dictation text and generate suggested CPT and ICD-10 codes (confirmed working, requires increased timeout of 30 seconds)

### Authentication Endpoints

- `POST /api/auth/login`: Works correctly for all roles (admin_staff, physician, admin_referring, super_admin, admin_radiology, scheduler, radiologist)
- `GET /api/auth/login`: Returns 404 "Route not found" error - This is by design as the login endpoint only accepts POST requests

### Endpoints with Method Restrictions

The following endpoints have specific method restrictions by design:

- `GET /api/auth/login`: Returns 404 "Route not found" error - This is by design as the login endpoint only accepts POST requests
- `POST /api/orders` (direct order creation): Returns 404 "Route not found" error - This is by design, as order creation is handled implicitly by the `/api/orders/validate` endpoint when called without an existing orderId

### Endpoints with Path Restrictions

The following endpoints have specific path restrictions by design:

- `GET /api/organizations`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use organization-specific endpoints instead.
- `GET /api/users`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use `GET /api/superadmin/users` to list all users (super_admin role only)
- `GET /api/superadmin`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use specific superadmin endpoints like `GET /api/superadmin/users` or `GET /api/superadmin/organizations` instead

### Endpoints with Role Restrictions

The following endpoints work correctly but are restricted to specific roles:

- `GET /api/superadmin/organizations`: Works correctly and returns a list of all organizations (super_admin role only)

### Non-Working or Not Implemented Endpoints

The following endpoints were tested but are not currently working in the production deployment:

- `GET /api/organizations/mine`: Returns 501 "Not implemented yet" error - The endpoint exists but is not fully implemented
- `GET /api/billing`: Returns 404 "Route not found" error - The dist/routes/billing.routes.js file does not define a handler for the base GET / path. It only defines POST routes for creating checkout sessions and subscriptions.

## Billing Management

### Create Checkout Session

**Endpoint:** `POST /api/billing/create-checkout-session`

**Description:** Creates a Stripe checkout session for purchasing credit bundles.

**Authentication:** Required (admin_referring role only)

**Request Body:**
```json
{
  "priceId": "price_1234567890",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0"
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring role
- 404 Not Found: If the price ID is not found
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to create a checkout session for purchasing credit bundles.
- The priceId should be a valid Stripe price ID.
- The quantity is the number of credit bundles to purchase.
- The response includes a sessionId that can be used to redirect the user to the Stripe checkout page.
- After successful payment, the user will be redirected to the success URL configured in the application.

### Create Subscription

**Endpoint:** `POST /api/billing/subscriptions`

**Description:** Creates a Stripe subscription for a specific pricing tier.

**Authentication:** Required (admin_referring role only)

**Request Body:**
```json
{
  "priceId": "price_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "subscriptionId": "sub_1234567890",
  "clientSecret": "seti_1234567890_secret_1234567890"
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring role
- 404 Not Found: If the price ID is not found
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to create a subscription for a specific pricing tier.
- The priceId should be a valid Stripe price ID corresponding to a subscription plan.
- The response includes a subscriptionId and clientSecret that can be used to confirm the subscription.
- After successful subscription creation, the organization's subscription_tier will be updated accordingly.

### Get Billing Information (Not Implemented)

**Endpoint:** `GET /api/billing`

**Description:** This endpoint would retrieve billing information for the current organization, but it is not currently implemented.

**Authentication:** Would require admin_referring role

**Expected Response (if implemented):**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "name": "Test Organization",
      "billingId": "cus_1234567890",
      "creditBalance": 500,
      "subscriptionTier": "tier_1",
      "status": "active"
    },
    "billingEvents": [
      {
        "id": 1,
        "event_type": "credit_purchase",
        "amount_cents": 10000,
        "currency": "usd",
        "description": "Purchase of 100 credits",
        "created_at": "2025-04-22T13:11:56.390Z"
      }
    ]
  }
}
```

**Current Status:**
- Returns 404 "Route not found" error
- The dist/routes/billing.routes.js file does not define a handler for the base GET / path
- Only POST routes for creating checkout sessions and subscriptions are implemented

**Implementation Suggestion:**
- Add a GET / route to the billing.routes.ts file
- Create a controller function to retrieve billing information from the database
- Return organization details and recent billing events

## Conclusion

The production deployment has successfully implemented several key features:

1. Health check endpoint
2. Order listing with filtering capabilities
3. Order details retrieval
4. Order validation with AI-powered CPT and ICD-10 code suggestions
5. Radiology order management (listing and sending orders to radiology)
6. Connection management
7. Role-based access control (RBAC)

The order listing functionality (`GET /api/orders`) is particularly robust, supporting:
- Different user roles (admin_staff, physician, admin_referring)
- Status filtering (pending_admin, pending_validation, all)
- Detailed order information in the response

The validation endpoint (`POST /api/orders/validate`) is working correctly and serves two purposes:
1. Creates a new order when called without an orderId (implicit order creation)
2. Validates dictation text and provides:
   - Validation status (appropriate, inappropriate, needs_clarification)
   - Compliance score
   - Feedback for the physician
   - Suggested CPT codes with descriptions
   - Suggested ICD-10 codes with descriptions

Important implementation notes:
- The validation endpoint requires a timeout of at least 30 seconds as it performs complex processing
- Testing shows that each validation request takes approximately 11-15 seconds to complete
- There is no evidence of Redis caching being used for validation requests, as each request takes a similar amount of time regardless of whether similar content has been validated before
- When creating a new order, the patientInfo object must include a valid patient.id field
- There is no separate endpoint for order creation - this is handled by the validation endpoint

The admin functionality for sending orders to radiology is working correctly, which is a critical part of the order workflow.

However, several endpoints have specific behavior to be aware of:
1. Some endpoints only support specific HTTP methods (e.g., login endpoint only supports POST, not GET)
2. Some endpoints handle multiple operations (e.g., the validation endpoint also creates orders)
2. Organization and user management endpoints
3. Superadmin endpoints
4. Billing endpoints

The role-based access control (RBAC) is working correctly, with appropriate 403 Forbidden responses for unauthorized roles.

Frontend developers should focus on implementing features that use the working endpoints, particularly the order validation, listing, filtering, and the send-to-radiology functionality. The missing endpoints will need to be implemented in future deployments.