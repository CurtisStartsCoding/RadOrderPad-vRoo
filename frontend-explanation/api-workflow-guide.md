# RadOrderPad API Workflow Guide

This document provides a comprehensive guide to the API workflow for the RadOrderPad application, focusing on Scenario A: Full Physician Order with Validation and Finalization.

## Base URL

```
https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api
```

## Authentication

All API requests (except login) require a JWT token in the Authorization header.

### Login

**Endpoint:** `POST /auth/login`

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
    "id": 1,
    "organization_id": 1,
    "role": "physician",
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com"
  }
}
```

**Usage Notes:**
- Store the token for subsequent API requests
- Include the token in the Authorization header as `Bearer {token}`

## Workflow: Scenario A - Full Physician Order

### Step 1: Validate Dictation

This is the core functionality that processes clinical indications and assigns CPT and ICD-10 codes.

**Endpoint:** `POST /orders/validate`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "dictationText": "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.",
  "patientInfo": {
    "id": 1,
    "firstName": "Robert",
    "lastName": "Johnson",
    "dateOfBirth": "1950-05-15",
    "gender": "male",
    "pidn": "P12345"
  }
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 599,
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

**Important Fields:**
- `orderId`: The ID of the created order, needed for subsequent steps
- `validationStatus`: Can be "appropriate", "inappropriate", or "indeterminate"
- `suggestedCPTCodes`: Array of CPT codes with descriptions
- `suggestedICD10Codes`: Array of ICD-10 codes with descriptions

### Step 2: Finalize/Sign Order

After validation, the order needs to be finalized with the physician's signature and the validation results.

**Endpoint:** `PUT /orders/{orderId}`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "status": "pending_admin",
  "finalValidationStatus": "appropriate",
  "finalCPTCode": "72148",
  "clinicalIndication": "MRI lumbar spine without contrast is appropriate for evaluating lower back pain with radicular symptoms, especially with history of degenerative disc disease.",
  "finalICD10Codes": ["M54.17", "M51.36"],
  "referring_organization_name": "Test Referring Practice"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 599,
  "message": "Order submitted successfully.",
  "signatureUploadNote": "For security reasons, signature data is not returned in the response."
}
```

**Important Notes:**
- The `referring_organization_name` field is required and must be included in the request
- The `finalCPTCode` should be the primary CPT code from the validation result
- The `finalICD10Codes` should be an array of ICD-10 codes from the validation result

### Step 3: Submit Order to Radiology (Currently Not Implemented)

The API endpoints for submitting orders to radiology organizations are not currently implemented. The following endpoints return 404 errors:

- `POST /orders/{orderId}/submit`
- `POST /referring/orders/{orderId}/submit`

When these endpoints are implemented, they will likely accept a request body like:

```json
{
  "radiologyOrgId": 1
}
```

### Step 4: Check Order Status (Currently Not Implemented)

The API endpoint for checking order status in the radiology organization is not currently implemented. The following endpoint returns a 403 error for physicians:

- `GET /radiology/orders/{orderId}`

This is likely due to role-based access control, as the error message indicates that this endpoint requires "scheduler" or "admin_radiology" roles.

## Data Models

### Patient Information

```json
{
  "id": 1,                      // Required: Patient ID (temporary or permanent)
  "firstName": "Robert",        // Required: Patient's first name
  "lastName": "Johnson",        // Required: Patient's last name
  "dateOfBirth": "1950-05-15",  // Required: Date of birth in YYYY-MM-DD format
  "gender": "male",             // Required: "male", "female", or "other"
  "pidn": "P12345"              // Required: Patient Identifier Number
}
```

### Dictation Text

The dictation text should include:
- Patient demographics (age, gender)
- Clinical symptoms and their duration
- Relevant medical history
- Clinical concerns or suspected diagnoses
- Requested imaging study (if specified by the physician)

Example:
```
72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.
```

### Validation Result

```json
{
  "validationStatus": "appropriate",  // "appropriate", "inappropriate", or "indeterminate"
  "complianceScore": 8,               // 1-10 score indicating compliance with guidelines
  "feedback": "...",                  // Clinical feedback for the physician
  "suggestedCPTCodes": [              // Array of suggested CPT codes
    {
      "code": "72148",
      "description": "Magnetic resonance imaging, lumbar spine without contrast"
    }
  ],
  "suggestedICD10Codes": [            // Array of suggested ICD-10 codes
    {
      "code": "M54.17",
      "description": "Radiculopathy, lumbosacral region"
    }
  ],
  "internalReasoning": "..."          // Internal reasoning (may not be present in all responses)
}
```

## Error Handling

API errors are returned in the following format:

```json
{
  "message": "Error message here"
}
```

Common error status codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (invalid or expired token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (endpoint doesn't exist)
- 500: Internal Server Error

## Implementation Recommendations for Frontend

1. **Authentication Flow**:
   - Implement a login form that collects email and password
   - Store the JWT token securely (e.g., in HttpOnly cookies or secure localStorage)
   - Include the token in all subsequent API requests

2. **Validation Flow**:
   - Create a form for entering patient information
   - Provide a text area for dictation input
   - Submit the data to the validation endpoint
   - Display the validation results, including CPT and ICD-10 codes
   - Allow the physician to review and potentially modify the suggested codes

3. **Finalization Flow**:
   - Implement a signature capture component
   - Create a form for finalizing the order with the validation results
   - Include the referring_organization_name field
   - Submit the data to the order update endpoint

4. **Error Handling**:
   - Implement proper error handling for all API requests
   - Display user-friendly error messages
   - Implement token refresh logic for expired tokens

5. **UI/UX Considerations**:
   - Provide clear feedback during API calls (loading indicators)
   - Implement form validation for required fields
   - Create a user-friendly interface for reviewing validation results
   - Design a clear workflow that guides users through each step

## Example API Call Sequence

```javascript
// Step 1: Login
async function login(email, password) {
  const response = await fetch('https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  return data.token;
}

// Step 2: Validate Dictation
async function validateDictation(token, dictationText, patientInfo) {
  const response = await fetch('https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api/orders/validate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dictationText,
      patientInfo
    })
  });
  
  return await response.json();
}

// Step 3: Finalize Order
async function finalizeOrder(token, orderId, signature, validationResult) {
  const response = await fetch(`https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      signature,
      status: 'pending_admin',
      finalValidationStatus: validationResult.validationStatus,
      finalCPTCode: validationResult.suggestedCPTCodes[0].code,
      clinicalIndication: validationResult.feedback,
      finalICD10Codes: validationResult.suggestedICD10Codes.map(code => code.code),
      referring_organization_name: "Test Referring Practice"
    })
  });
  
  return await response.json();
}
```

## Conclusion

This guide provides a comprehensive overview of the API workflow for the RadOrderPad application, focusing on Scenario A: Full Physician Order with Validation and Finalization. By following this guide, frontend developers should be able to implement the necessary components to interact with the backend API and create a seamless user experience.