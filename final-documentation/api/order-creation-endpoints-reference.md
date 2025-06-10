# Order Creation API Endpoints Reference

**Version:** 1.0 (Order Finalization Implementation)
**Date:** June 9, 2025
**Author:** Documentation Team
**Status:** Current

## Overview

This document provides a comprehensive reference for the order creation and finalization API endpoints in the RadOrderPad system. It covers request/response formats, error handling, and usage examples.

## Base URL

```
https://api.radorderpad.com
```

## Authentication

All endpoints require authentication using a JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

## Endpoints

### 1. Create and Finalize Order

Creates a new order with validation results, patient information, and signature data.

**Endpoint:** `POST /api/orders`

**Description:**
This endpoint creates a new order record with the final validation state, patient information, and signature. This is where database records are actually created. The endpoint performs all operations within a PHI database transaction to ensure data consistency.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| patientInfo | object | Yes | Patient information object |
| dictationText | string | Yes | The clinical dictation text |
| finalValidationResult | object | Yes | The final validation result |
| isOverride | boolean | Yes | Whether validation was overridden |
| overrideJustification | string | Conditional | Required if isOverride is true |
| signatureData | string | Yes | Base64-encoded signature image or fileKey |
| signerFullName | string | Yes | Full name of the signer |
| radiologyOrganizationId | number | No | ID of the radiology organization |

**Patient Info Object:**
```typescript
interface PatientInfo {
  id?: number;            // Required for existing patient
  firstName?: string;     // Required for new patient
  lastName?: string;      // Required for new patient
  dateOfBirth?: string;   // Required for new patient (YYYY-MM-DD)
  gender?: string;        // Required for new patient
  mrn?: string;           // Optional
  pidn?: string;          // Optional
}
```

**Final Validation Result Object:**
```typescript
interface FinalValidationResult {
  validationStatus: 'appropriate' | 'needs_clarification' | 'inappropriate';
  complianceScore: number;
  feedback: string;
  suggestedCPTCodes: Array<{
    code: string;
    description: string;
    isPrimary?: boolean;
  }>;
  suggestedICD10Codes: Array<{
    code: string;
    description: string;
    isPrimary?: boolean;
  }>;
  internalReasoning?: string;
}
```

**Example Request:**
```json
{
  "patientInfo": {
    "firstName": "Robert",
    "lastName": "Johnson",
    "dateOfBirth": "1950-05-15",
    "gender": "male",
    "mrn": "MRN12345"
  },
  "dictationText": "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.",
  "finalValidationResult": {
    "validationStatus": "appropriate",
    "complianceScore": 8,
    "feedback": "MRI lumbar spine without contrast is appropriate for evaluating lower back pain with radicular symptoms, especially with history of degenerative disc disease. Clinical presentation suggests lumbar radiculopathy which warrants imaging evaluation.",
    "suggestedCPTCodes": [
      {
        "code": "72148",
        "description": "Magnetic resonance (eg, proton) imaging, spinal canal and contents, lumbar; without contrast material",
        "isPrimary": true
      }
    ],
    "suggestedICD10Codes": [
      {
        "code": "M54.17",
        "description": "Radiculopathy, lumbosacral region",
        "isPrimary": true
      },
      {
        "code": "M51.36",
        "description": "Other intervertebral disc degeneration, lumbar region",
        "isPrimary": false
      }
    ],
    "internalReasoning": "The patient presents with lower back pain radiating to the left leg, which is a classic presentation of lumbar radiculopathy. The history of degenerative disc disease increases the likelihood of nerve compression. MRI without contrast is the preferred imaging modality for evaluating disc pathology and nerve compression in the lumbar spine."
  },
  "isOverride": false,
  "signatureData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "signerFullName": "Dr. Jane Doe",
  "radiologyOrganizationId": 123
}
```

#### Response

**Status Codes:**
- 201 Created: Order created successfully
- 400 Bad Request: Missing required parameters
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Unauthorized access
- 404 Not Found: Patient not found
- 500 Internal Server Error: Server error

**Response Body:**
```typescript
interface CreateOrderResponse {
  success: boolean;
  orderId: number;
  message: string;
}
```

**Example Response:**
```json
{
  "success": true,
  "orderId": 599,
  "message": "Order created and submitted successfully."
}
```


## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Patient information is required"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "User authentication required"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Patient not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

## Implementation Notes

1. The order creation endpoint (`POST /api/orders`) creates records in the following tables:
   - `patients` (PHI) - If a new patient is created
   - `orders` (PHI) - The order record
   - `validation_attempts` (PHI) - The final validation attempt
   - `order_history` (PHI) - Order creation and signing events
   - `document_uploads` (PHI) - Signature data

2. All database operations are performed within a transaction to ensure data consistency.

3. The endpoint can handle both new patients and existing patients:
   - For new patients, provide full patient details in the `patientInfo` object
   - For existing patients, provide only the `id` field in the `patientInfo` object

4. The `signatureData` field can be either:
   - A base64-encoded data URL of the signature image
   - A fileKey reference to a previously uploaded signature file

5. The `isPrimary` flag in the CPT and ICD-10 code objects indicates the primary code.

6. The `radiologyOrganizationId` field is optional and can be set later by admin staff.

7. The legacy endpoint (`PUT /api/orders/new`) will be deprecated in future versions.