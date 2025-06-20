# Physician-Specific Endpoints Documentation

This document provides comprehensive documentation for all physician-specific endpoints in the RadOrderPad API, organized by the physician workflow.

> **Note**: Some endpoints have dedicated documentation for complex features. See linked documentation for full details.

## Complete Physician Workflow

### Overview
The physician workflow follows these key steps:
1. **Patient Identification** - Capture patient info via speech/search
2. **Clinical Dictation & Validation** - Record clinical indication and validate appropriateness
3. **Signature Capture** - Electronic signature via canvas/upload
4. **Order Creation** - Combine all elements into finalized order
5. **Order Management** - View and track orders

### Detailed Workflow

#### 1. Patient Identification (Frontend-Driven)
- **Frontend**: Use Web Speech API to capture patient name and DOB
- **Frontend**: Parse the speech data to extract structured information
- **Backend**: Call patient search endpoint with parsed data
- **Frontend**: Display results for physician to select correct patient
- **Result**: Patient ID to tag the order

#### 2. Dictation & Validation
- **Frontend**: Record clinical dictation (text or speech-to-text)
- **Backend**: Submit for validation (stateless - no order created yet)
- **Frontend**: Handle validation responses:
  - If `NEEDS_CLARIFICATION`: Show prompt, collect additional info, resubmit
  - If failed 3 times: Show override option with justification field
  - If `APPROPRIATE`: Proceed to signature
- **Result**: Validated CPT/ICD-10 codes and compliance score

#### 3. Signature Capture
- **Frontend**: Present signature canvas for physician to sign
- **Backend**: Request presigned URL for signature upload
- **Frontend**: Upload signature image directly to S3
- **Backend**: Confirm upload and get S3 key
- **Result**: Signature S3 key for order creation

#### 4. Order Creation
- **Frontend**: Combine all elements (patient ID, validation results, signature)
- **Backend**: Create finalized order with status `pending_admin`
- **Backend**: Link signature to order in database
- **Result**: Order queued for administrative processing

## Authentication & Session Management

See [Common Endpoints - Authentication](common.md#authentication) for login and password management endpoints available to all users.

## User Profile Management

See [Common Endpoints - User Profile](common.md#user-profile) for profile endpoints.

**Note for Physicians**: The profile endpoints include physician-specific fields like `specialty` and `npi`.

## Patient Management

### Search Patients
**POST** `/api/patients/search`

See [Patient Search API Documentation](patient-search-api.md) for comprehensive documentation of the dictation-based patient search endpoint, including:
- Natural language date parsing from dictation
- Multiple name format support  
- Frontend integration examples
- Testing scenarios

**Notes**:
  - This endpoint searches existing patients in the system
  - Frontend should handle speech-to-text parsing before calling this
  - Results are filtered by the physician's organization
  - `403`: Access denied (non-physician role)
  - `500`: Failed to search patients
- **Code Location**:
  - Route: `src/routes/patient.routes.ts` (lines 21-26)
  - Controller: `src/controllers/patient-search.controller.ts` (lines 22-69)

## Order Validation

### Validate Order (Stateless)
**POST** `/api/orders/validate`
- **Description**: Validate clinical dictation for appropriateness without creating an order
- **Access Control**: `authenticateJWT` + `authorizeRole(['physician'])` middleware
- **Rate Limiting**: 60 requests per minute per user
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "dictationText": "string",
    "isOverrideValidation": "boolean (optional)",
    "overrideJustification": "string (required if isOverrideValidation is true)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "validationResult": {
      "validationStatus": "APPROPRIATE | NEEDS_CLARIFICATION | NON_COMPLIANT",
      "complianceScore": "number (0-100)",
      "suggestedCPTCodes": [
        {
          "code": "string",
          "description": "string",
          "isPrimary": "boolean"
        }
      ],
      "suggestedICD10Codes": [
        {
          "code": "string",
          "description": "string",
          "isPrimary": "boolean"
        }
      ],
      "clarificationPrompt": "string (only if NEEDS_CLARIFICATION)",
      "missingElements": ["string"] (only if NEEDS_CLARIFICATION)",
      "feedback": "string",
      "overrideJustification": "string (only if override was used)"
    }
  }
  ```
- **Validation Workflow**:
  1. **Initial Validation**: Submit dictation text
  2. **Clarification Loop**: If status is `NEEDS_CLARIFICATION`
     - Frontend shows `clarificationPrompt` to physician
     - Physician adds more details to dictation
     - Resubmit with enhanced dictation text
     - Process repeats (typically max 3 attempts)
  3. **Override Option**: After 3 failed attempts
     - Frontend enables override option
     - Physician provides clinical justification
     - Submit with `isOverrideValidation: true` and `overrideJustification`
     - Validation proceeds with override noted
- **Error Responses**:
  - `400`: Dictation text is required
  - `401`: User authentication required
  - `403`: Access denied (non-physician role)
  - `429`: Rate limit exceeded
  - `503`: Validation service temporarily unavailable
  - `500`: An unexpected error occurred
- **Code Location**:
  - Route: `src/routes/orders.routes.ts` (lines 34-40)
  - Controller: `src/controllers/order-validation.controller.ts` (lines 12-72)

## Signature Management

### Upload Signature (Recommended Flow)

See [Common Endpoints - File Management](common-endpoints.md#file-management) for the complete file upload workflow.

**Physician-Specific Notes**:
1. Use `context: "signature"` when requesting presigned URLs
2. The signature fileKey should be included in the order creation request
3. Signatures are typically PNG images from canvas drawing

### Alternative: Base64 Signature (Deprecated)
- Signatures can be sent as base64 data in the order creation request
- Not recommended due to payload size limitations
- Backend will log deprecation warning

## Order Creation

### Create and Finalize Order
**POST** `/api/orders`
- **Description**: Create and finalize a new order after validation and signature. Automatically extracts imaging modality (CT, MRI, X-ray, etc.) from dictation text.
- **Access Control**: `authenticateJWT` + `authorizeRole(['physician'])` middleware
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "patientInfo": {
      "patientId": "number (optional - for existing patients)",
      "firstName": "string (required for new patients)",
      "lastName": "string (required for new patients)",
      "dateOfBirth": "YYYY-MM-DD",
      "gender": "string",
      "mrn": "string (optional)",
      "phoneNumber": "string (optional)"
    },
    "dictationText": "string",
    "finalValidationResult": {
      "validationStatus": "string",
      "complianceScore": "number",
      "icd10Codes": ["string"],
      "icd10CodeDescriptions": ["string"],
      "cptCode": "string",
      "cptCodeDescription": "string",
      "clinicalIndication": "string"
    },
    "signatureData": "string (S3 fileKey from signature upload or base64 data)",
    "signerFullName": "string",
    "isOverride": "boolean (optional)",
    "overrideJustification": "string (required if isOverride is true)",
    "radiologyOrganizationId": "number (optional)",
    "originatingLocationId": "number (optional - defaults to physician's assigned location)"
  }
  ```
- **Automatic Processing**: The system automatically extracts the imaging modality from the dictation text and stores it with the order. Recognized modalities include: CT, MRI, X-ray, ultrasound, mammography, nuclear medicine, PET, and others.
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "orderId": "number",
      "orderNumber": "string",
      "status": "pending_admin",
      "createdAt": "ISO timestamp"
    }
  }
  ```
- **Error Responses**:
  - `400`: Invalid request (missing required fields)
  - `401`: User authentication required
  - `403`: Access denied (non-physician role)
  - `404`: Patient not found
  - `500`: Server error
- **Code Location**:
  - Route: `src/routes/orders.routes.ts` (lines 94-99)
  - Controller: `src/controllers/order-creation.controller.ts` (lines 51-130)

## Order Management

See [Common Endpoints - Order Management](common.md#order-management) for detailed documentation on listing and viewing orders, including the complete response format with coding fields.

**Physician-Specific Behavior**:
- Physicians only see orders they created (`created_by_user_id = userId`)
- Cannot view orders created by other physicians, even in the same organization


## Middleware and Authorization

### Authentication Middleware (`authenticateJWT`)
- **Location**: `src/middleware/auth/authenticate-jwt.ts`
- **Function**: Validates JWT token and adds user information to request object
- **Adds to Request**:
  ```typescript
  req.user = {
    userId: number,
    email: string,
    role: string,
    orgId: number
  }
  ```

### Authorization Middleware (`authorizeRole`)
- **Location**: `src/middleware/auth/authorize-role.ts`
- **Function**: Restricts access based on user role
- **Usage**: `authorizeRole(['physician'])` - allows only physician role

### Rate Limiting Middleware
- **Location**: `src/middleware/rate-limit.ts`
- **Function**: Limits API calls per user per time window
- **Applied to**: Order validation endpoint (60 requests/minute)


## Notes for Physicians

1. **Authentication**: All endpoints except login require a valid JWT token in the Authorization header
2. **Order Workflow**: 
   - Search for patient (optional)
   - Validate order with dictation text
   - Review validation results
   - Sign and finalize order
3. **Patient Handling**: If patient search returns no results, new patient info can be provided during order creation
4. **Override Capability**: Physicians can override validation warnings with justification
5. **Order Status**: New orders are created with `pending_admin` status for administrative review

## Location Context

Orders are automatically tagged with the physician's current location when created:
- The system uses the physician's assigned location from the user profile
- If a physician works at multiple locations, the first assigned location is used
- Frontend implementations can optionally allow physicians to select their current location

**For multi-location physicians**:
- Future enhancement: Allow location selection at login or order creation
- Current behavior: Uses primary assigned location automatically

## Additional Resources

- See [Common Endpoints](common.md) for authentication, profile management, and file operations
- See [Endpoint Access Matrix](endpoint-access-matrix.md) for a complete list of accessible endpoints

## Integration Notes

### Frontend Implementation Checklist
1. **Speech Recognition**: Implement Web Speech API for patient name/DOB capture
2. **Validation UI**: Handle clarification prompts and override workflow
3. **Signature Canvas**: Implement signature drawing and upload to S3
4. **Error Handling**: Implement retry logic for network failures
5. **Token Management**: Store JWT securely, handle expiration/refresh

### Security Considerations
1. **PHI Protection**: Patient data is stored in separate PHI database
2. **Signature Security**: Signatures are stored in S3 with restricted access
3. **Role Verification**: All physician endpoints verify role before processing
4. **Audit Trail**: All order actions are logged with user and timestamp