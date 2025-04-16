# RadOrderPad Order Validation API

This document describes the API endpoints for order validation and finalization in the RadOrderPad application.

## Authentication

All endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Validate Order

Validates a dictation text and returns suggested codes and validation status.

**Endpoint:** `POST /api/orders/validate`

**Access:** Requires `physician` role

**Request Body:**
```json
{
  "dictationText": "Patient presents with lower back pain radiating to the left leg for 3 weeks. No improvement with NSAIDs. No history of trauma. Request MRI lumbar spine.",
  "patientInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1980-01-15",
    "gender": "Male",
    "mrn": "MRN12345"
  },
  "orderId": 123,  // Optional - if not provided, a new draft order will be created
  "isOverrideValidation": false  // Optional - set to true for override validation
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 123,
  "validationResult": {
    "validationStatus": "appropriate",
    "complianceScore": 8,
    "feedback": "The requested imaging study is appropriate for the clinical indication provided. The symptoms and history suggest a condition that would benefit from this imaging modality.",
    "suggestedICD10Codes": [
      { "code": "M54.5", "description": "Low back pain" },
      { "code": "M51.26", "description": "Intervertebral disc disorders with radiculopathy, lumbar region" },
      { "code": "M48.06", "description": "Spinal stenosis, lumbar region" }
    ],
    "suggestedCPTCodes": [
      { "code": "72148", "description": "MRI lumbar spine without contrast" }
    ],
    "internalReasoning": "Patient presents with chronic low back pain with radicular symptoms, which aligns with ACR guidelines for MRI lumbar spine as an appropriate initial study."
  }
}
```

### 2. Finalize Order

Finalizes an order with the selected codes and validation status.

**Endpoint:** `PUT /api/orders/:orderId`

**Access:** Requires `physician` role

**Request Body:**
```json
{
  "finalValidationStatus": "appropriate",
  "finalComplianceScore": 8,
  "finalICD10Codes": "M54.5,M51.26",
  "finalICD10CodeDescriptions": "Low back pain,Intervertebral disc disorders with radiculopathy, lumbar region",
  "finalCPTCode": "72148",
  "finalCPTCodeDescription": "MRI lumbar spine without contrast",
  "clinicalIndication": "Lower back pain radiating to left leg for 3 weeks, no improvement with NSAIDs",
  "isTemporaryPatient": true,  // Optional - set to true if creating a new patient
  "patientInfo": {  // Required if isTemporaryPatient is true
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1980-01-15",
    "gender": "Male",
    "mrn": "MRN12345"
  },
  "overridden": false,  // Optional - set to true if overriding validation
  "overrideJustification": "",  // Required if overridden is true
  "isUrgentOverride": false,  // Optional - set to true for urgent override
  "signatureData": "base64EncodedSignatureImage"  // Optional - signature image data
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 123,
  "message": "Order submitted successfully."
}
```

### 3. Get Order Details

Retrieves details for a specific order.

**Endpoint:** `GET /api/orders/:orderId`

**Access:** Any authenticated user with access to the order

**Response:**
```json
{
  "id": 123,
  "order_number": "ORD-1682541234567",
  "patient_id": 456,
  "referring_organization_id": 789,
  "radiology_organization_id": 101,
  "created_by_user_id": 202,
  "signed_by_user_id": 202,
  "status": "pending_admin",
  "priority": "routine",
  "original_dictation": "Patient presents with lower back pain radiating to the left leg for 3 weeks...",
  "clinical_indication": "Lower back pain radiating to left leg for 3 weeks, no improvement with NSAIDs",
  "final_cpt_code": "72148",
  "final_cpt_code_description": "MRI lumbar spine without contrast",
  "final_icd10_codes": "M54.5,M51.26",
  "final_icd10_code_descriptions": "Low back pain,Intervertebral disc disorders with radiculopathy, lumbar region",
  "final_validation_status": "appropriate",
  "final_compliance_score": 8,
  "created_at": "2025-04-26T14:53:54.567Z",
  "updated_at": "2025-04-26T15:12:33.789Z"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error response body:
```json
{
  "message": "Error message describing the issue"
}
```

## Testing with cURL

### Validate Order
```bash
curl -X POST http://localhost:3000/api/orders/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dictationText": "Patient presents with lower back pain radiating to the left leg for 3 weeks. No improvement with NSAIDs. No history of trauma. Request MRI lumbar spine."
  }'
```

### Finalize Order
```bash
curl -X PUT http://localhost:3000/api/orders/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "finalValidationStatus": "appropriate",
    "finalComplianceScore": 8,
    "finalICD10Codes": "M54.5,M51.26",
    "finalICD10CodeDescriptions": "Low back pain,Intervertebral disc disorders with radiculopathy, lumbar region",
    "finalCPTCode": "72148",
    "finalCPTCodeDescription": "MRI lumbar spine without contrast",
    "clinicalIndication": "Lower back pain radiating to left leg for 3 weeks, no improvement with NSAIDs"
  }'
```

### Get Order Details
```bash
curl -X GET http://localhost:3000/api/orders/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"