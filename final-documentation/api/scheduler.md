# Scheduler Role API Endpoints

**Version:** 1.0  
**Date:** June 11, 2025  
**Role:** scheduler  

This document provides comprehensive documentation for all endpoints available to users with the `scheduler` role in the RadOrderPad system.

## Overview

The scheduler role is responsible for managing incoming radiology orders from referring organizations. Schedulers work in radiology organizations and handle:
1. **Viewing incoming orders** from connected referring organizations
2. **Requesting additional information** when orders are incomplete
3. **Updating order status** (scheduled, completed, cancelled)
4. **Exporting order data** for RIS/PACS integration
5. **Managing patient appointments** and radiology workflow

## Scheduler Workflow

### Typical Process
1. **View Incoming Orders Queue** - See all orders sent to their radiology organization
2. **Review Order Details** - Check patient info, insurance, clinical indications
3. **Request Information** (if needed) - Ask referring organization for missing data
4. **Schedule Appointment** - Update status to "scheduled" 
5. **Mark Complete** - Update status to "completed" after imaging
6. **Export Data** - Send order data to RIS/PACS systems

## Authentication & Common Endpoints

See [Common Endpoints](common-endpoints.md) for:
- Authentication (login, password management)
- User profile management
- Organization information
- File uploads and downloads

## Radiology Workflow Endpoints

### 1. Get Incoming Orders Queue

Retrieves all orders sent to the scheduler's radiology organization.

**Endpoint:** `GET /api/radiology/orders`

**Authorization:** Requires `scheduler` or `admin_radiology` role

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| referringOrgId | number | No | Filter by referring organization ID |
| priority | string | No | Filter by priority (stat, urgent, routine) |
| modality | string | No | Filter by modality (CT, MRI, XR, US, etc.) |
| startDate | string | No | Filter orders after this date (ISO format) |
| endDate | string | No | Filter orders before this date (ISO format) |
| validationStatus | string | No | Filter by validation status |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20) |
| sortBy | string | No | Sort field (default: created_at) |
| sortOrder | string | No | Sort direction (asc/desc, default: desc) |

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": 123,
      "orderNumber": "ORD-2025-0123",
      "status": "sent_to_radiology",
      "priority": "routine",
      "referringOrganization": {
        "id": 1,
        "name": "Medical Center ABC"
      },
      "patient": {
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1980-01-15",
        "gender": "male",
        "mrn": "MRN123456"
      },
      "modality": "CT",
      "bodyPart": "Chest",
      "laterality": "bilateral",
      "clinicalIndication": "Chest pain, rule out PE",
      "cptCode": "71250",
      "cptCodeDescription": "CT Chest without contrast",
      "icd10Codes": ["R07.9", "I26.99"],
      "orderingPhysician": {
        "name": "Dr. Jane Smith",
        "npi": "1234567890"
      },
      "createdAt": "2025-01-11T10:00:00Z",
      "hasInsurance": true,
      "hasDocuments": true
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

**Error Responses:**
- `401`: User authentication required
- `403`: Access denied (wrong role)
- `500`: Server error

**Code Location:**
- Route: `/src/routes/radiology-orders.routes.ts` (lines 12-17)
- Controller: `/src/controllers/radiology/incoming-orders.controller.ts`

---

### 2. Get Order Details

Retrieves complete details of a specific order including all patient information, insurance, and documents.

**Endpoint:** `GET /api/radiology/orders/:orderId`

**Authorization:** Requires `scheduler` or `admin_radiology` role

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | The order ID to retrieve |

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 123,
    "orderNumber": "ORD-2025-0123",
    "status": "sent_to_radiology",
    "priority": "routine",
    "patient": {
      "id": 456,
      "firstName": "John",
      "lastName": "Doe",
      "middleName": "Michael",
      "dateOfBirth": "1980-01-15",
      "gender": "male",
      "mrn": "MRN123456",
      "addressLine1": "123 Main St",
      "addressLine2": "Apt 4B",
      "city": "Boston",
      "state": "MA",
      "zipCode": "02115",
      "phoneNumber": "(617) 555-1234",
      "email": "john.doe@email.com"
    },
    "insurance": {
      "insurerName": "Blue Cross Blue Shield",
      "policyNumber": "XYZ123456",
      "groupNumber": "GRP789",
      "policyHolderName": "John Doe",
      "policyHolderRelationship": "self",
      "isPrimary": true
    },
    "modality": "CT",
    "bodyPart": "Chest",
    "laterality": "bilateral",
    "clinicalIndication": "Chest pain, rule out PE",
    "cptCode": "71250",
    "cptCodeDescription": "CT Chest without contrast",
    "icd10Codes": ["R07.9", "I26.99"],
    "icd10CodeDescriptions": ["Chest pain, unspecified", "Other pulmonary embolism without acute cor pulmonale"],
    "dictationText": "Patient with acute onset chest pain...",
    "validationResult": {
      "complianceScore": 95,
      "validationStatus": "APPROPRIATE"
    },
    "orderingPhysician": {
      "id": 789,
      "firstName": "Jane",
      "lastName": "Smith",
      "npi": "1234567890",
      "specialty": "Internal Medicine"
    },
    "documents": [
      {
        "id": "doc123",
        "fileName": "clinical_notes.pdf",
        "fileType": "supplemental",
        "uploadedAt": "2025-01-11T09:30:00Z"
      }
    ],
    "referringOrganization": {
      "id": 1,
      "name": "Medical Center ABC",
      "phone": "(617) 555-0000",
      "address": "456 Medical Way, Boston, MA 02116"
    },
    "createdAt": "2025-01-11T10:00:00Z",
    "updatedAt": "2025-01-11T10:30:00Z"
  }
}
```

**Error Responses:**
- `400`: Invalid order ID
- `401`: User authentication required
- `403`: Access denied (order belongs to different organization)
- `404`: Order not found
- `500`: Server error

**Code Location:**
- Route: `/src/routes/radiology-orders.routes.ts` (lines 24-29)
- Controller: `/src/controllers/radiology/order-details.controller.ts`

---

### 3. Request Additional Information

Request missing or additional information from the referring organization about an order.

**Endpoint:** `POST /api/radiology/orders/:orderId/request-info`

**Authorization:** Requires `scheduler` or `admin_radiology` role

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | The order ID |

**Request Body:**
```json
{
  "requestedInfoType": "string",
  "requestedInfoDetails": "string"
}
```

**Valid Info Types:**
- `labs` - Laboratory results
- `priors` - Prior imaging studies
- `clinical` - Additional clinical information
- `insurance` - Insurance verification/authorization
- `other` - Other information

**Example Request:**
```json
{
  "requestedInfoType": "labs",
  "requestedInfoDetails": "Please provide recent CBC and BMP results for this patient. Specifically need creatinine level for contrast administration."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Information request sent successfully",
  "infoRequestId": 789,
  "orderId": 123,
  "requestedAt": "2025-01-11T11:00:00Z"
}
```

**Error Responses:**
- `400`: Invalid order ID or missing request data
- `401`: User authentication required
- `403`: Access denied (wrong organization)
- `404`: Order not found
- `500`: Server error

**Code Location:**
- Route: `/src/routes/radiology-orders.routes.ts` (lines 60-65)
- Controller: `/src/controllers/radiology/request-information.controller.ts`

**Notes:**
- This creates a notification for the referring organization
- The order status may change to indicate pending information
- Multiple information requests can be sent for the same order

---

### 4. Update Order Status

Update the status of an order as it moves through the radiology workflow.

**Endpoint:** `POST /api/radiology/orders/:orderId/update-status`

**Authorization:** Requires `scheduler` or `admin_radiology` role

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | The order ID |

**Request Body:**
```json
{
  "newStatus": "string",
  "notes": "string (optional)"
}
```

**Valid Status Values:**
- `scheduled` - Appointment has been scheduled
- `completed` - Imaging has been completed
- `cancelled` - Order has been cancelled

**Example Request:**
```json
{
  "newStatus": "scheduled",
  "notes": "Scheduled for 06/15/2025 at 2:00 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "orderId": 123,
  "previousStatus": "sent_to_radiology",
  "newStatus": "scheduled",
  "updatedAt": "2025-01-11T11:30:00Z"
}
```

**Error Responses:**
- `400`: Invalid order ID or status
- `401`: User authentication required
- `403`: Access denied (wrong organization)
- `404`: Order not found
- `500`: Server error

**Code Location:**
- Route: `/src/routes/radiology-orders.routes.ts` (lines 48-53)
- Controller: `/src/controllers/radiology/update-status.controller.ts`

**Notes:**
- Status changes are logged for audit purposes
- Notifications may be sent to referring organization
- Some status transitions may have business rules

---

### 5. Export Order Data

Export order data in various formats for integration with RIS/PACS systems.

**Endpoint:** `GET /api/radiology/orders/:orderId/export/:format`

**Authorization:** Requires `scheduler` or `admin_radiology` role

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | number | Yes | The order ID |
| format | string | Yes | Export format (csv, json, hl7) |

**Response:**
- **CSV Format**: Returns CSV file with headers
- **JSON Format**: Returns structured JSON data
- **HL7 Format**: Returns HL7 v2 message (ORM^O01)

**Example Response Headers:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="order-123.csv"
```

**Error Responses:**
- `400`: Invalid order ID or unsupported format
- `401`: User authentication required
- `403`: Access denied (wrong organization)
- `404`: Order not found
- `500`: Server error

**Code Location:**
- Route: `/src/routes/radiology-orders.routes.ts` (lines 36-41)
- Controller: `/src/controllers/radiology/export-order.controller.ts`

---

## Additional Endpoints

### Order Management

Schedulers can also use the common order endpoints with specific access rules:

**GET /api/orders** - Lists all orders sent to their radiology organization
- See [Common Endpoints - Order Management](common-endpoints.md#order-management-shared)

**GET /api/orders/:orderId** - View specific orders sent to their organization
- See [Common Endpoints - Order Management](common-endpoints.md#order-management-shared)

### Location Management

**GET /api/organizations/mine/locations** - View radiology facility locations
- See [Organization & User Management](organization-user-management-endpoints.md#location-management)

### File Management

Schedulers can download order documents:

**GET /api/uploads/:documentId/download-url** - Get download URL for order documents
- See [Common Endpoints - File Management](common-endpoints.md#file-management)

---

## Error Response Format

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error information"
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `SERVER_ERROR` - Internal server error

---

## Workflow Integration

### Typical Scheduler Daily Workflow

1. **Morning Queue Review**
   - GET `/api/radiology/orders` - View new incoming orders
   - Filter by priority to handle STAT orders first

2. **Order Processing**
   - GET `/api/radiology/orders/:orderId` - Review complete order details
   - POST `/api/radiology/orders/:orderId/request-info` - Request missing information
   - POST `/api/radiology/orders/:orderId/update-status` - Mark as scheduled

3. **Appointment Management**
   - External scheduling system integration
   - Update order status when appointments are booked

4. **Completion Tracking**
   - POST `/api/radiology/orders/:orderId/update-status` - Mark completed orders
   - GET `/api/radiology/orders/:orderId/export/hl7` - Export for PACS

### Integration Points

1. **RIS Integration**
   - Use export endpoints to send order data to RIS
   - HL7 format for standard integration
   - JSON format for modern REST APIs

2. **PACS Integration**
   - Export order details with proper patient identifiers
   - Include ordering physician and clinical indication

3. **Scheduling Systems**
   - API can be integrated with third-party scheduling
   - Status updates reflect appointment booking

---

## Security Considerations

1. **Organization Isolation**: Schedulers can only see orders sent to their radiology organization
2. **PHI Protection**: Patient data is stored securely in separate database
3. **Audit Trail**: All actions are logged with user and timestamp
4. **Document Security**: Documents are accessed via time-limited presigned URLs

---

## Best Practices

1. **Queue Management**
   - Review high-priority orders first
   - Use filters to organize workflow
   - Process information requests promptly

2. **Communication**
   - Provide clear details when requesting information
   - Update order status promptly
   - Include notes for important status changes

3. **Data Export**
   - Verify patient identifiers before export
   - Use appropriate format for target system
   - Confirm successful import to RIS/PACS

---

## Testing & Development

For testing scheduler endpoints, use:
- Test scheduler account: `test.scheduler@example.com`
- Test radiology organization ID: 2
- Sample order IDs are available in test data

See test scripts:
- `/all-backend-tests/scripts/test-radiology-request-info.js`