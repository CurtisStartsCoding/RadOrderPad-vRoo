# Admin Order Management

This section covers endpoints related to managing orders from an administrative perspective in the RadOrderPad system.

## Get Admin Order Queue

**Endpoint:** `GET /api/admin/orders/queue`

**Description:** Retrieves a queue of orders for administrative processing.

**Authentication:** Required (admin_staff role)

**Response:**
```json
{
  "orders": [
    {
      "id": 123,
      "status": "pending_admin",
      "patientName": "John Doe",
      "createdAt": "2025-04-01T12:00:00.000Z",
      "priority": "routine"
    }
  ]
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_staff role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a queue of orders that need administrative processing.
- Use this endpoint when implementing the admin order queue view.

**Implementation Status:**
- **Status:** Exists but has implementation issues
- **Tested With:** test-all-missing-endpoints.js
- **Error:** Returns 500 "Internal server error"

## Paste Summary to Order

**Endpoint:** `POST /api/admin/orders/{orderId}/paste-summary`

**Description:** Adds or updates the EMR summary for an order.

**Authentication:** Required (admin_staff role)

**URL Parameters:**
- orderId: The ID of the order to update

**Request Body:**
```json
{
  "pastedText": "EMR Summary: Patient John Doe, DOB 1980-01-01. Insurance: BCBS Policy: 123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Summary updated successfully",
  "order": {
    "id": 123,
    "summary": "EMR Summary: Patient John Doe, DOB 1980-01-01. Insurance: BCBS Policy: 123",
    "status": "pending_admin"
  }
}
```

**Error Responses:**
- 400 Bad Request: If required fields are missing
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_staff role
- 500 Internal Server Error: If the order is not in pending_admin status or other server error

**Usage Notes:**
- This endpoint is used to add or update the EMR summary for an order.
- The order must be in the "pending_admin" status.
- Required fields: pastedText

**Implementation Status:**
- **Status:** Exists but has database schema issues
- **Tested With:** test-admin-endpoints-directly.js
- **Error:** "column authorization_number does not exist"
- **Note:** This endpoint consistently fails with all tested order IDs

## Paste Supplemental Information to Order

**Endpoint:** `POST /api/admin/orders/{orderId}/paste-supplemental`

**Description:** Adds or updates supplemental information for an order.

**Authentication:** Required (admin_staff role)

**URL Parameters:**
- orderId: The ID of the order to update

**Request Body:**
```json
{
  "pastedText": "Supplemental Info: Prior imaging report attached."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Supplemental information updated successfully",
  "order": {
    "id": 123,
    "supplementalInfo": "Supplemental Info: Prior imaging report attached.",
    "status": "pending_admin"
  }
}
```

**Error Responses:**
- 400 Bad Request: If required fields are missing
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_staff role
- 500 Internal Server Error: If the order is not in pending_admin status or other server error

**Usage Notes:**
- This endpoint is used to add or update supplemental information for an order.
- The order must be in the "pending_admin" status.
- Required fields: pastedText

**Implementation Status:**
- **Status:** Working with specific order IDs
- **Tested With:** test-admin-endpoints-directly.js
- **Working Order IDs:** 600, 601, 603, 604, 609, 612
- **Note:** Works even though orders may not be in pending_admin status

## Update Patient Information

**Endpoint:** `PUT /api/admin/orders/{orderId}/patient-info`

**Description:** Updates patient information for an order.

**Authentication:** Required (admin_staff role)

**URL Parameters:**
- orderId: The ID of the order to update

**Request Body:**
```json
{
  "city": "Updated City",
  "phoneNumber": "555-555-1212"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Patient information updated successfully",
  "order": {
    "id": 123,
    "patientInfo": {
      "city": "Updated City",
      "phoneNumber": "555-555-1212"
    },
    "status": "pending_admin"
  }
}
```

**Error Responses:**
- 400 Bad Request: If required fields are missing
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_staff role
- 500 Internal Server Error: If the order is not in pending_admin status or other server error

**Usage Notes:**
- This endpoint is used to update patient information for an order.
- The order must be in the "pending_admin" status.
- Include only the fields you want to update in the request body.

**Implementation Status:**
- **Status:** Working with specific order IDs
- **Tested With:** test-admin-endpoints-directly.js
- **Working Order IDs:** 600, 601, 603, 604, 609, 612
- **Note:** Works even though orders may not be in pending_admin status

## Update Insurance Information

**Endpoint:** `PUT /api/admin/orders/{orderId}/insurance-info`

**Description:** Updates insurance information for an order.

**Authentication:** Required (admin_staff role)

**URL Parameters:**
- orderId: The ID of the order to update

**Request Body:**
```json
{
  "insurerName": "Updated Insurer",
  "policyNumber": "UPDATEDPOL123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Insurance information updated successfully",
  "order": {
    "id": 123,
    "insuranceInfo": {
      "insurerName": "Updated Insurer",
      "policyNumber": "UPDATEDPOL123"
    },
    "status": "pending_admin"
  }
}
```

**Error Responses:**
- 400 Bad Request: If required fields are missing
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_staff role
- 500 Internal Server Error: If the order is not in pending_admin status or other server error

**Usage Notes:**
- This endpoint is used to update insurance information for an order.
- The order must be in the "pending_admin" status.
- Include only the fields you want to update in the request body.

**Implementation Status:**
- **Status:** Working with specific order IDs
- **Tested With:** test-admin-endpoints-directly.js
- **Working Order IDs:** 600, 601, 603, 604, 609, 612
- **Note:** Works even though orders may not be in pending_admin status