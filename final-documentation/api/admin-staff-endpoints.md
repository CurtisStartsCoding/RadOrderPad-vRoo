# Admin Staff Queue and Order Processing Endpoints

## Overview
This document describes the API endpoints used by admin staff for processing orders in the RadOrderPad system. All endpoints require authentication and the `admin_staff` role.

## Admin Staff Role and Workflow

Admin staff are responsible for finalizing physician-created orders by:
1. **Adding Demographics**: Completing patient information (address, phone, email)
2. **Adding Insurance**: Entering insurance details for billing
3. **Adding Supplemental Information**: Attaching EMR notes or other clinical documents
4. **Routing Orders**: Sending finalized orders to connected radiology organizations

Orders appear in the admin queue with status `pending_admin` after physicians create them. Admin staff process these orders and send them to radiology, changing the status to `sent_to_radiology`.

## Base URL
All endpoints are prefixed with `/api/admin/orders`

## Authentication
- **Method**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Required Role**: `admin_staff`

## Endpoints

### 1. Get Admin Order Queue
Retrieves a paginated list of orders awaiting admin finalization.

**Endpoint**: `GET /api/admin/orders/queue`

**Middleware**:
- `authenticateJWT`
- `authorizeRole(['admin_staff'])`

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number for pagination |
| limit | number | 20 | Number of items per page |
| sortBy | string | 'created_at' | Field to sort by (allowed: id, order_number, created_at, updated_at, patient_name, patient_dob, referring_physician_name, modality) |
| sortOrder | string | 'desc' | Sort direction (asc/desc) |
| patientName | string | - | Filter by patient name (partial match) |
| physicianName | string | - | Filter by physician name (partial match) |
| dateFrom | string | - | Filter orders created after this date |
| dateTo | string | - | Filter orders created before this date |
| originatingLocationId | number | - | Filter by the location where the order was created |
| targetFacilityId | number | - | Filter by the target radiology facility |

**Response Schema**:
```json
{
  "orders": [
    {
      "id": number,
      "order_number": string,
      "patient_name": string,
      "patient_dob": string,
      "patient_gender": string,
      "referring_physician_name": string,
      "modality": string,
      "body_part": string,
      "laterality": string,
      "final_cpt_code": string,
      "final_cpt_code_description": string,
      "final_icd10_codes": string[],
      "final_icd10_code_descriptions": string[],
      "originating_location_id": number | null,
      "target_facility_id": number | null,
      "created_at": string,
      "updated_at": string
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "pages": number
  }
}
```

**Code Location**: 
- Route: `/src/routes/admin-orders.routes.ts` (lines 12-17)
- Controller: `/src/controllers/admin-order/list-pending-admin.controller.ts`
- Service: `/src/services/order/admin/list-pending-admin.service.ts`

---

### 2. Update Patient Information
Manually update parsed patient information for an order.

**Endpoint**: `PUT /api/admin/orders/:orderId/patient-info`

**Middleware**:
- `authenticateJWT`
- `authorizeRole(['admin_staff'])`

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | The order ID to update |

**Request Body Schema**:
```json
{
  "first_name": string (optional),
  "last_name": string (optional),
  "middle_name": string (optional),
  "date_of_birth": string (optional, format: "YYYY-MM-DD"),
  "gender": string (optional, values: "male", "female", "other"),
  "address_line1": string (optional),
  "address_line2": string (optional),
  "city": string (optional),
  "state": string (optional),
  "zip_code": string (optional),
  "phone_number": string (optional),
  "email": string (optional),
  "mrn": string (optional)
}
```

**Response Schema**:
```json
{
  "success": boolean,
  "orderId": number,
  "patientId": number,
  "message": string
}
```

**Code Location**:
- Route: `/src/routes/admin-orders.routes.ts` (lines 77-83)
- Controller: `/src/controllers/admin-order/update-patient.controller.ts`
- Service Handler: `/src/services/order/admin/handlers/update-patient.ts`

---

### 3. Update Insurance Information
Manually update parsed insurance information for an order.

**Endpoint**: `PUT /api/admin/orders/:orderId/insurance-info`

**Middleware**:
- `authenticateJWT`
- `authorizeRole(['admin_staff'])`

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | The order ID to update |

**Request Body Schema**:
```json
{
  "insurerName": string (optional),
  "policyNumber": string (optional),
  "groupNumber": string (optional),
  "planType": string (optional),
  "policyHolderName": string (optional),
  "policyHolderRelationship": string (optional),
  "policyHolderDateOfBirth": string (optional),
  "verificationStatus": string (optional),
  "isPrimary": boolean (optional)
}
```

**Response Schema**:
```json
{
  "success": boolean,
  "orderId": number,
  "insuranceId": number,
  "message": string
}
```

**Code Location**:
- Route: `/src/routes/admin-orders.routes.ts` (lines 89-94)
- Controller: `/src/controllers/admin-order/update-insurance.controller.ts`
- Service Handler: `/src/services/order/admin/handlers/update-insurance.ts`

---

### 4. Paste EMR Summary
Submit pasted EMR summary for automatic parsing of patient and insurance information.

**Endpoint**: `POST /api/admin/orders/:orderId/paste-summary`

**Middleware**:
- `authenticateJWT`
- `authorizeRole(['admin_staff'])`

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | The order ID to update |

**Request Body Schema**:
```json
{
  "pastedText": string (required)
}
```

**Response Schema**:
```json
{
  "success": boolean,
  "orderId": number,
  "message": string,
  "parsedData": {
    "patientInfo": {
      "address": string (optional),
      "city": string (optional),
      "state": string (optional),
      "zipCode": string (optional),
      "phone": string (optional),
      "email": string (optional)
    },
    "insuranceInfo": {
      "insurerName": string (optional),
      "policyNumber": string (optional),
      "groupNumber": string (optional),
      "policyHolderName": string (optional),
      "relationship": string (optional),
      "authorizationNumber": string (optional)
    }
  }
}
```

**Code Location**:
- Route: `/src/routes/admin-orders.routes.ts` (lines 24-29)
- Controller: `/src/controllers/admin-order/paste-summary.controller.ts`
- Service Handler: `/src/services/order/admin/handlers/paste-summary.ts`
- EMR Parser: `/src/services/order/admin/emr-parser.ts`

---

### 5. Paste Supplemental Documents
Submit pasted supplemental documents to be attached to the order.

**Endpoint**: `POST /api/admin/orders/:orderId/paste-supplemental`

**Middleware**:
- `authenticateJWT`
- `authorizeRole(['admin_staff'])`

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | The order ID to update |

**Request Body Schema**:
```json
{
  "pastedText": string (required)
}
```

**Response Schema**:
```json
{
  "success": boolean,
  "orderId": number,
  "message": string
}
```

**Code Location**:
- Route: `/src/routes/admin-orders.routes.ts` (lines 36-41)
- Controller: `/src/controllers/admin-order/paste-supplemental.controller.ts`
- Service Handler: `/src/services/order/admin/handlers/paste-supplemental.ts`

---

### 6. Send Order to Radiology
Finalize and send the order to the radiology group.

**Endpoint**: `POST /api/admin/orders/:orderId/send-to-radiology-fixed`

**Note**: The endpoint uses `-fixed` suffix to avoid circular dependencies in the implementation.

**Middleware**:
- `authenticateJWT`
- `authorizeRole(['admin_staff'])`

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | The order ID to send |

**Request Body Schema**:
```json
{
  "radiologyOrganizationId": number (required)
}
```

**Response Schema**:
```json
{
  "success": boolean,
  "orderId": number,
  "message": string,
  "remainingCredits": number (optional)
}
```

**Important Notes**:
- Admin staff cannot list connected radiology organizations via API
- The radiology organization ID must be provided by the frontend UI
- Each send operation consumes 1 credit from the organization's balance
- The `remainingCredits` field may not always be returned

**Code Location**:
- Route: `/src/routes/admin-orders.routes.ts` (lines 60-70)
- Controller: `/src/controllers/admin-order/send-to-radiology-fixed.controller.ts`
- Service Handler: `/src/services/order/admin/handlers/send-to-radiology-fixed.ts`

---

### 7. Document Upload (via Common Endpoints)
Admin staff can upload supplemental documents using the common file upload endpoints.

See [Common Endpoints - File Management](common-endpoints.md#file-management) for:
- `POST /api/uploads/presigned-url` - Get upload URL
- `POST /api/uploads/confirm` - Confirm upload

**Typical Usage**:
1. Request presigned URL with `context: "supplemental"`
2. Upload file directly to S3
3. Confirm upload with `orderId` and `documentType: "supplemental"`

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request**:
```json
{
  "message": "Invalid order ID" | "Patient data is required" | "Insurance data is required" | "Pasted text is required"
}
```

**401 Unauthorized**:
```json
{
  "message": "Unauthorized: Organization ID not found" | "User authentication required"
}
```

**403 Forbidden**:
```json
{
  "message": "Access denied: Insufficient permissions",
  "requiredRoles": ["admin_staff"],
  "userRole": "current_user_role"
}
```

**500 Internal Server Error**:
```json
{
  "message": "Error in [functionName]: [error details]"
}
```

## Workflow

The typical workflow for admin staff processing orders is:

1. **Fetch Queue**: Call `GET /api/admin/orders/queue` to get pending orders
2. **Paste EMR Summary**: Call `POST /api/admin/orders/:orderId/paste-summary` with the EMR text
3. **Review/Update Patient Info**: If needed, call `PUT /api/admin/orders/:orderId/patient-info`
4. **Review/Update Insurance**: If needed, call `PUT /api/admin/orders/:orderId/insurance-info`
5. **Add Supplemental Docs**: If available, call `POST /api/admin/orders/:orderId/paste-supplemental`
6. **Select Radiology Partner**: Frontend must provide list of connected radiology organizations
7. **Send to Radiology**: Call `POST /api/admin/orders/:orderId/send-to-radiology-fixed` with radiologyOrganizationId

## Limitations

### Radiology Organization Selection
Admin staff cannot directly query connected radiology organizations via API. The frontend must:
- Maintain a list of connected radiology organizations
- Provide a UI for admin staff to select the target organization
- Pass the selected `radiologyOrganizationId` when sending orders

This limitation exists because connection management endpoints require `admin_referring` or `admin_radiology` roles.

### Location Filtering
Admin staff can filter orders by location to see only orders from their assigned location(s).

**How it works**:
- Orders are automatically tagged with the physician's current location when created
- The `originatingLocationId` parameter filters orders by where they were created
- The `targetFacilityId` parameter filters by the intended radiology facility

**For multi-location organizations**:
- Frontend should automatically apply location filtering based on the admin staff's assigned location(s)
- Admin staff can still search across all locations using patient name when needed
- This ensures efficient checkout desk workflows where staff only see relevant orders

## Implementation Notes

- All endpoints validate the order ID and check user authentication
- The service layer handles database transactions and business logic
- Patient and insurance updates support partial updates (only provided fields are updated)
- The EMR parser automatically extracts patient and insurance information from pasted text
- Orders must have status `pending_admin` to appear in the queue
- All operations are logged for audit purposes