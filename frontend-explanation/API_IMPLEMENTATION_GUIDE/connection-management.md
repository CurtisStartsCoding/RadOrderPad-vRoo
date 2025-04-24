# Connection Management

This section covers endpoints related to managing connections between referring organizations and radiology organizations. Connections represent established relationships that allow referring organizations to send orders to specific radiology organizations.

## List Connections

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

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-comprehensive-api-with-roles.js

## Get Connection Details

**Endpoint:** `GET /api/connections/{connectionId}`

**Description:** Retrieves detailed information about a specific connection.

**Authentication:** Required (admin_referring, admin_radiology roles)

**URL Parameters:**
- `connectionId`: The ID of the connection to retrieve

**Response:**
```json
{
  "connection": {
    "id": "conn_123456",
    "status": "active",
    "requestingOrganizationId": 1,
    "targetOrganizationId": 2,
    "requestingOrganizationName": "Test Organization",
    "targetOrganizationName": "Test Radiology Group",
    "notes": "Connection for testing",
    "createdAt": "2025-04-13T16:34:44.148Z",
    "updatedAt": "2025-04-13T16:34:44.148Z",
    "requestingOrganization": {
      "id": 1,
      "name": "Test Organization",
      "type": "referring",
      "contact_email": "contact@testorg.com",
      "phone_number": "555-123-4567"
    },
    "targetOrganization": {
      "id": 2,
      "name": "Test Radiology Group",
      "type": "radiology_group",
      "contact_email": "admin@testradiology.com",
      "phone_number": "555-987-6543"
    }
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring or admin_radiology role
- 404 Not Found: If the connection does not exist
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to view detailed information about a specific connection.
- The response includes information about both the requesting and target organizations.
- Only users with admin_referring or admin_radiology roles can access this endpoint.
- Use this endpoint when implementing the connection detail view.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-comprehensive-api-with-roles.js

## Create Connection Request

**Endpoint:** `POST /api/connections`

**Description:** Creates a new connection request from the current organization to a target organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Request Body:**
```json
{
  "targetOrgId": 2,
  "notes": "Connection request for testing"
}
```

**Response:**
```json
{
  "success": true,
  "connection": {
    "id": "conn_123456",
    "status": "pending",
    "requestingOrganizationId": 1,
    "targetOrganizationId": 2,
    "requestingOrganizationName": "Test Organization",
    "targetOrganizationName": "Test Radiology Group",
    "notes": "Connection request for testing",
    "createdAt": "2025-04-22T17:28:44.148Z",
    "updatedAt": "2025-04-22T17:28:44.148Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring or admin_radiology role
- 404 Not Found: If the target organization does not exist
- 400 Bad Request: If a connection already exists between the organizations
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to create a new connection request from the current organization to a target organization.
- The connection status will be "pending" until it is approved by the target organization.
- Only users with admin_referring or admin_radiology roles can access this endpoint.
- Use this endpoint when implementing the connection request feature.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-comprehensive-api-with-roles.js

## Update Connection Status

**Endpoint:** `PUT /api/connections/{connectionId}`

**Description:** Updates the status of a connection.

**Authentication:** Required (admin_referring, admin_radiology roles)

**URL Parameters:**
- `connectionId`: The ID of the connection to update

**Request Body:**
```json
{
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "connection": {
    "id": "conn_123456",
    "status": "active",
    "requestingOrganizationId": 1,
    "targetOrganizationId": 2,
    "requestingOrganizationName": "Test Organization",
    "targetOrganizationName": "Test Radiology Group",
    "notes": "Connection request for testing",
    "createdAt": "2025-04-22T17:28:44.148Z",
    "updatedAt": "2025-04-22T17:30:12.345Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring or admin_radiology role
- 404 Not Found: If the connection does not exist
- 400 Bad Request: If the status is invalid
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to update the status of a connection.
- Valid status values are: "pending", "active", "rejected", "inactive".
- Only users with admin_referring or admin_radiology roles can access this endpoint.
- Use this endpoint when implementing the connection approval/rejection feature.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-comprehensive-api-with-roles.js

## List Incoming Connection Requests

**Endpoint:** `GET /api/connections/requests`

**Description:** Retrieves a list of pending incoming connection requests for the current organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Query Parameters:** None

**Response:**
```json
{
  "requests": [
    {
      "id": 5,
      "initiatingOrgId": 3,
      "initiatingOrgName": "Test Referring Practice",
      "initiatedBy": "John Smith",
      "initiatorEmail": "john.smith@example.com",
      "notes": "We would like to establish a connection with your radiology group",
      "createdAt": "2025-04-22T14:28:44.148Z"
    }
  ]
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring or admin_radiology role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a list of pending incoming connection requests for the current organization.
- These are requests initiated by other organizations that are waiting for approval or rejection.
- Only users with admin_referring or admin_radiology roles can access this endpoint.
- Use this endpoint when implementing the connection requests management view.
- After retrieving the requests, you can use the `POST /api/connections/{connectionId}/approve` or `POST /api/connections/{connectionId}/reject` endpoints to respond to them.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-connection-requests.js

## Role Restrictions

The following connection-related endpoints have role restrictions:

- `GET /api/connections`: Works correctly but is restricted to admin_referring and admin_radiology roles
- `GET /api/connections/requests`: Works correctly but is restricted to admin_referring and admin_radiology roles
- `GET /api/connections/{connectionId}`: Works correctly but is restricted to admin_referring and admin_radiology roles
- `POST /api/connections`: Works correctly but is restricted to admin_referring and admin_radiology roles
- `PUT /api/connections/{connectionId}`: Works correctly but is restricted to admin_referring and admin_radiology roles