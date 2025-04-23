# Order Management

This section covers endpoints related to managing orders in the RadOrderPad system, including listing orders, validating dictations, retrieving order details, and updating orders.

## List Orders

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

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-get-orders-list.js, test-comprehensive-api-with-roles.js

## Validate Order

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

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the physician role
- 400 Bad Request: If the request body is missing required fields
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to validate a dictation and determine appropriate CPT and ICD-10 codes.
- The validation result includes a validation status, compliance score, feedback, and suggested CPT and ICD-10 codes.
- The validation status can be "appropriate", "inappropriate", or "needs_clarification".
- The orderId in the response can be used to update the order with the validation results.
- This endpoint is a critical part of the workflow for creating new orders.
- Processing takes approximately 11-15 seconds per request.
- The endpoint has a timeout of 30 seconds to allow for LLM processing.
- There is no evidence of Redis caching being used for validation requests, as each request takes a similar amount of time regardless of whether similar content has been validated before.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-validate-endpoint.js

## Get Order Details

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

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 404 Not Found: If the order does not exist
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to view the complete details of an order.
- The super_admin role cannot access this endpoint (returns 404 "User not found").
- Use this endpoint when you need to display order details on a detail page or when processing an order.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-comprehensive-api-with-roles.js

## Update Order

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

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the physician role
- 404 Not Found: If the order does not exist
- 400 Bad Request: If the request body is missing required fields
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used by physicians to finalize and sign an order after validation.
- The `final_validation_status` must be one of: "appropriate", "inappropriate", "needs_clarification".
- If `overridden` is true, an `override_justification` field should also be provided.
- This endpoint changes the order status to "pending_admin".
- After calling this endpoint, the order will be ready for admin staff to process.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-update-order.js

## Send Order to Radiology

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

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-send-to-radiology.js

## Non-Working or Restricted Endpoints

- `POST /api/orders` (direct order creation): Returns 404 "Route not found" error - This is by design, as order creation is handled implicitly by the `/api/orders/validate` endpoint when called without an existing orderId