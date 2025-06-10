# Validation API Endpoints Reference

**Version:** 2.0 (Stateless Validation Implementation)
**Date:** June 5, 2025
**Author:** Documentation Team
**Status:** Current

## Overview

This document provides a comprehensive reference for the validation-related API endpoints in the RadOrderPad system. It covers request/response formats, error handling, and usage examples.

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

### 1. Validate Order

Validates a clinical dictation and returns suggested codes and feedback.

**Endpoint:** `POST /api/orders/validate`

**Description:**
This endpoint is completely stateless during the physician's iterative dictation and validation process. It performs LLM validation on the provided `dictationText` and returns the `validationResult`. It does NOT create any `orders` or `validation_attempts` database records. Only LLM usage is logged.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dictationText | string | Yes | The clinical dictation text from the physician |
| patientInfo | object | No | Patient context information (optional) |
| orderId | number | No | ID of an existing order (optional) |
| isOverrideValidation | boolean | No | Set to true for override validation (optional) |

**Patient Info Object (Optional):**
```typescript
interface PatientInfo {
  id?: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  pidn?: string; // Patient Identifier Number
  age?: number; // Can be derived from DOB
}
```

**Example Request:**
```json
{
  "dictationText": "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy."
}
```

#### Response

**Status Codes:**
- 200 OK: Validation successful
- 400 Bad Request: Missing required parameters
- 401 Unauthorized: Invalid or missing token
- 500 Internal Server Error: Server error
- 503 Service Unavailable: Validation service unavailable (all LLM providers failed)

**Response Body:**
```typescript
interface ValidationResponse {
  success: boolean;
  orderId?: number; // Only included if orderId was provided in the request
  validationResult: {
    validationStatus: 'appropriate' | 'needs_clarification' | 'inappropriate';
    complianceScore: number;
    feedback: string;
    suggestedCPTCodes: Array<{
      code: string;
      description: string;
    }>;
    suggestedICD10Codes: Array<{
      code: string;
      description: string;
    }>;
    internalReasoning?: string; // May not be present in all responses
  };
}
```

**Example Response:**
```json
{
  "success": true,
  "validationResult": {
    "validationStatus": "appropriate",
    "complianceScore": 8,
    "feedback": "MRI lumbar spine without contrast is appropriate for evaluating lower back pain with radicular symptoms, especially with history of degenerative disc disease. Clinical presentation suggests lumbar radiculopathy which warrants imaging evaluation.",
    "suggestedCPTCodes": [
      {
        "code": "72148",
        "description": "Magnetic resonance (eg, proton) imaging, spinal canal and contents, lumbar; without contrast material"
      }
    ],
    "suggestedICD10Codes": [
      {
        "code": "M54.17",
        "description": "Radiculopathy, lumbosacral region"
      },
      {
        "code": "M51.36",
        "description": "Other intervertebral disc degeneration, lumbar region"
      }
    ],
    "internalReasoning": "The patient presents with lower back pain radiating to the left leg, which is a classic presentation of lumbar radiculopathy. The history of degenerative disc disease increases the likelihood of nerve compression. MRI without contrast is the preferred imaging modality for evaluating disc pathology and nerve compression in the lumbar spine."
  }
}
```

### 2. Trial Validation

Validates a clinical dictation for trial users.

**Endpoint:** `POST /api/orders/validate/trial`

**Description:**
This endpoint provides validation functionality for trial users. It tracks validation usage and enforces limits on the number of validations a trial user can perform.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dictationText | string | Yes | The clinical dictation text from the physician |

**Example Request:**
```json
{
  "dictationText": "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy."
}
```

#### Response

**Status Codes:**
- 200 OK: Validation successful
- 400 Bad Request: Missing required parameters
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Validation limit reached
- 500 Internal Server Error: Server error
- 503 Service Unavailable: Validation service unavailable (all LLM providers failed)

**Response Body:**
```typescript
interface TrialValidationResponse {
  success: boolean;
  validationResult: {
    validationStatus: 'appropriate' | 'needs_clarification' | 'inappropriate';
    complianceScore: number;
    feedback: string;
    suggestedCPTCodes: Array<{
      code: string;
      description: string;
    }>;
    suggestedICD10Codes: Array<{
      code: string;
      description: string;
    }>;
    internalReasoning?: string;
  };
  trialInfo: {
    validationsUsed: number;
    maxValidations: number;
    validationsRemaining: number;
  };
}
```

**Example Response:**
```json
{
  "success": true,
  "validationResult": {
    "validationStatus": "appropriate",
    "complianceScore": 8,
    "feedback": "MRI lumbar spine without contrast is appropriate for evaluating lower back pain with radicular symptoms, especially with history of degenerative disc disease. Clinical presentation suggests lumbar radiculopathy which warrants imaging evaluation.",
    "suggestedCPTCodes": [
      {
        "code": "72148",
        "description": "Magnetic resonance (eg, proton) imaging, spinal canal and contents, lumbar; without contrast material"
      }
    ],
    "suggestedICD10Codes": [
      {
        "code": "M54.17",
        "description": "Radiculopathy, lumbosacral region"
      },
      {
        "code": "M51.36",
        "description": "Other intervertebral disc degeneration, lumbar region"
      }
    ]
  },
  "trialInfo": {
    "validationsUsed": 5,
    "maxValidations": 100,
    "validationsRemaining": 95
  }
}
```

### 3. Finalize Order

Creates and finalizes an order with validation results.

**Endpoint:** `PUT /api/orders/new`

**Description:**
This endpoint creates a new order record with the final validation state, patient information, and signature. This is where database records are actually created.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| patientInfo | object | Yes | Patient information |
| dictationText | string | Yes | The clinical dictation text |
| signature | string | Yes | Base64-encoded signature image |
| status | string | Yes | Should be 'pending_admin' |
| finalValidationStatus | string | Yes | The final validation status |
| finalCPTCode | string | Yes | The primary CPT code |
| clinicalIndication | string | Yes | The clinical indication text |
| finalICD10Codes | string[] | Yes | Array of ICD-10 codes |
| referring_organization_name | string | Yes | Name of the referring organization |
| overridden | boolean | No | Whether validation was overridden |
| overrideJustification | string | No | Justification for override |

**Example Request:**
```json
{
  "patientInfo": {
    "id": 1,
    "firstName": "Robert",
    "lastName": "Johnson",
    "dateOfBirth": "1950-05-15",
    "gender": "male",
    "pidn": "P12345"
  },
  "dictationText": "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.",
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "status": "pending_admin",
  "finalValidationStatus": "appropriate",
  "finalCPTCode": "72148",
  "clinicalIndication": "MRI lumbar spine without contrast is appropriate for evaluating lower back pain with radicular symptoms, especially with history of degenerative disc disease.",
  "finalICD10Codes": ["M54.17", "M51.36"],
  "referring_organization_name": "Test Referring Practice"
}
```

#### Response

**Status Codes:**
- 200 OK: Order created successfully
- 400 Bad Request: Missing required parameters
- 401 Unauthorized: Invalid or missing token
- 500 Internal Server Error: Server error

**Response Body:**
```typescript
interface FinalizeOrderResponse {
  success: boolean;
  orderId: number;
  message: string;
  signatureUploadNote?: string;
}
```

**Example Response:**
```json
{
  "success": true,
  "orderId": 599,
  "message": "Order created and submitted successfully.",
  "signatureUploadNote": "For security reasons, signature data is not returned in the response."
}
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Dictation text is required"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "User authentication required"
}
```

#### 403 Forbidden (Trial Validation Limit)
```json
{
  "success": false,
  "message": "Trial validation limit reached",
  "trialInfo": {
    "validationsUsed": 100,
    "maxValidations": 100,
    "validationsRemaining": 0
  }
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

#### 503 Service Unavailable
```json
{
  "success": false,
  "message": "Validation service temporarily unavailable. All LLM providers failed.",
  "code": "VALIDATION_SERVICE_UNAVAILABLE"
}
```

## Implementation Notes

1. The validation endpoint (`POST /api/orders/validate`) is completely stateless and does not create any database records except for LLM usage logs.

2. Order records are only created during finalization via the `PUT /api/orders/new` endpoint.

3. The validation status values are:
   - `appropriate`: The requested study is appropriate based on the clinical information provided
   - `needs_clarification`: Additional information is needed to determine appropriateness
   - `inappropriate`: The requested study is not appropriate based on the clinical information provided

4. The compliance score is a numeric value (typically 1-9) that indicates the level of compliance with clinical guidelines.

5. For trial users, validation usage is tracked and limited to a maximum number of validations.