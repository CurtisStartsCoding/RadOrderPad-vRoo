# API Workflow Guide

This document provides a comprehensive guide to the API workflow for the RadOrderPad application, focusing on Scenario A: Full Physician Order with Validation and Finalization.

## Base URL

```
https://api.radorderpad.com
```

## Workflow: Scenario A - Full Physician Order

### Step 1: Validate Dictation

This is the core functionality that processes clinical indications and assigns CPT and ICD-10 codes.

**Endpoint:** `POST /api/orders/validate`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "dictationText": "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy."
}
```

**Response:**
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

**Important Fields:**
- `validationStatus`: Can be "appropriate", "inappropriate", or "needs_clarification"
- `suggestedCPTCodes`: Array of CPT codes with descriptions
- `suggestedICD10Codes`: Array of ICD-10 codes with descriptions

**Important Notes:**
- This endpoint is now stateless and does not create any database records except for LLM usage logs
- No `orderId` is returned as no order is created during validation
- Patient information is not required for initial validation

### Step 2: Finalize/Sign Order

After validation, the order needs to be created and finalized with the physician's signature, patient information, and the validation results.

**Endpoint:** `PUT /api/orders/new`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
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

**Response:**
```json
{
  "success": true,
  "orderId": 599,
  "message": "Order created and submitted successfully.",
  "signatureUploadNote": "For security reasons, signature data is not returned in the response."
}
```

**Important Notes:**
- This is where the order is actually created in the database
- The `patientInfo` field is required and must include all patient details
- The `dictationText` field should contain the final dictation text
- The `referring_organization_name` field is required and must be included in the request
- The `finalCPTCode` should be the primary CPT code from the validation result
- The `finalICD10Codes` should be an array of ICD-10 codes from the validation result

### Step 3: View Orders Awaiting Admin Finalization

After physicians sign orders, admin staff need to view the queue of orders awaiting finalization.

**Endpoint:** `GET /api/admin/orders/queue`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
```
page=1&limit=20&sortBy=created_at&sortOrder=desc
```

**Response:**
```json
{
  "orders": [
    {
      "id": 599,
      "order_number": "ORD-1745331663206",
      "patient_name": "Robert Johnson",
      "patient_dob": "1950-05-15",
      "patient_gender": "male",
      "referring_physician_name": "Dr. Jane Doe",
      "modality": "MRI",
      "body_part": "LUMBAR_SPINE",
      "laterality": null,
      "final_cpt_code": "72148",
      "final_cpt_code_description": "MRI lumbar spine without contrast",
      "final_icd10_codes": "{\"M54.17\",\"M51.36\"}",
      "final_icd10_code_descriptions": null,
      "created_at": "2025-04-22T14:21:03.301Z",
      "updated_at": "2025-04-22T14:21:15.538Z"
    }
  ],
  "pagination": {
    "total": 32,
    "page": 1,
    "limit": 20,
    "pages": 2
  }
}
```

**Important Notes:**
- This endpoint is used by admin staff to view orders that need to be finalized
- The response includes pagination information for implementing pagination controls
- Admin staff can filter orders by patient name, physician name, and date range
- After identifying an order to process, admin staff would proceed to Step 4

### Step 4: Submit Order to Radiology

**Endpoint:** `POST /api/admin/orders/{orderId}/send-to-radiology-fixed`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

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
  "validationStatus": "appropriate",  // "appropriate", "inappropriate", or "needs_clarification"
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

4. **Admin Queue Flow**:
   - Create a dashboard view for admin staff to see orders awaiting finalization
   - Implement pagination controls for navigating through the queue
   - Add sorting and filtering options (by patient name, physician name, date)
   - Display key order information in a table or card format
   - Provide a way to select an order for finalization

5. **Error Handling**:
   - Implement proper error handling for all API requests
   - Display user-friendly error messages
   - Implement token refresh logic for expired tokens

6. **UI/UX Considerations**:
   - Provide clear feedback during API calls (loading indicators)
   - Implement form validation for required fields
   - Create a user-friendly interface for reviewing validation results
   - Design a clear workflow that guides users through each step

## Example API Call Sequence

```javascript
// Step 1: Login
async function login(email, password) {
  const response = await fetch('https://api.radorderpad.com/api/auth/login', {
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
  const response = await fetch('https://api.radorderpad.com/api/orders/validate', {
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

// Step 4: View Orders Awaiting Admin Finalization
async function getOrdersAwaitingFinalization(token, page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc') {
  const response = await fetch(`https://api.radorderpad.com/api/admin/orders/queue?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}

// Step 3: Finalize Order
async function finalizeOrder(token, orderId, signature, validationResult) {
  const response = await fetch(`https://api.radorderpad.com/api/orders/${orderId}`, {
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

// Step 5: Send Order to Radiology
async function sendOrderToRadiology(token, orderId) {
  const response = await fetch(`https://api.radorderpad.com/api/admin/orders/${orderId}/send-to-radiology-fixed`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}