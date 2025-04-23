# Radiology Order Management

This section covers endpoints related to managing radiology orders, which are used by radiology organizations to view and process orders sent to them by referring organizations.

## List Radiology Orders

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

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a list of orders in the radiology dashboard.
- The response includes pagination information for implementing pagination controls.
- You can combine multiple query parameters to create complex filters.
- This endpoint is only accessible to users with radiology roles (scheduler, admin_radiology).
- Use this endpoint to implement the radiology order queue view.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-radiology-orders.js

## Get Radiology Order Details

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

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the order does not exist
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display the complete details of a radiology order.
- The response includes related information such as patient details, insurance information, documents, clinical records, and validation history.
- Use this endpoint when implementing the radiology order detail view.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-radiology-orders.js

## Update Radiology Order Status

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

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the order does not exist
- 400 Bad Request: If the new status is invalid
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to update the status of a radiology order as it progresses through the workflow.
- Valid status values are: "pending_radiology", "scheduled", "completed", "cancelled".
- The status change is logged in the order history.
- Use this endpoint when implementing status change functionality in the radiology dashboard.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-radiology-orders.js

## Export Radiology Order

**Endpoint:** `GET /api/radiology/orders/{orderId}/export/{format}`

**Description:** Exports a radiology order in the specified format.

**Authentication:** Required (scheduler, admin_radiology roles)

**URL Parameters:**
- `orderId`: The ID of the order to export
- `format`: The export format ("json", "csv")

**Response:**
- For JSON format: Returns the order data as JSON
- For CSV format: Returns the order data as CSV text

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the order does not exist
- 400 Bad Request: If the format is invalid
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to export order data for integration with external systems or for reporting.
- The JSON format includes all order details and is suitable for programmatic processing.
- The CSV format includes the most important fields and is suitable for importing into spreadsheet applications.
- Use this endpoint when implementing export functionality in the radiology dashboard.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-radiology-orders.js