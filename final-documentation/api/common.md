# Common Endpoints

This document describes API endpoints that are shared across multiple user roles.

## Authentication

### Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

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
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 123,
      "email": "user@example.com",
      "role": "physician",
      "organization_id": 456
    }
  }
}
```

### Update Password
**Endpoint:** `PUT /api/auth/update-password`

**Description:** Update user password

**Authentication:** JWT token required

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

## User Profile

### Get Current User
**Endpoint:** `GET /api/users/me`

**Description:** Get current user profile information

**Authentication:** JWT token required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "physician",
    "organization_id": 456,
    "npi": "1234567890",
    "phone": "555-123-4567",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Update Current User
**Endpoint:** `PUT /api/users/me`

**Description:** Update current user profile information

**Authentication:** JWT token required

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "555-123-4567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "physician",
    "organization_id": 456,
    "phone": "555-123-4567"
  }
}
```

## Order Management

### Get Order Details
**Endpoint:** `GET /api/orders/:orderId`

**Description:** Get detailed information about a specific order

**Authentication:** JWT token required

**Authorization:** User must belong to either the referring organization or the radiology organization associated with the order

**Parameters:**
- `orderId` (path parameter) - The ID of the order to retrieve

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "order_number": "ORD-2024-001234",
    "status": "pending_radiology",
    "priority": "routine",
    "created_at": "2024-06-20T10:30:00Z",
    "updated_at": "2024-06-20T11:15:00Z",
    
    // Clinical Information
    "original_dictation": "Patient has chest pain, rule out PE",
    "clinical_indication": "Chest pain, rule out pulmonary embolism",
    "modality": "ct",
    "body_part": "chest",
    "laterality": "None",
    "is_contrast_indicated": true,
    "contrast": "IV contrast",
    
    // Final Coding Data (Available after order processing)
    "final_cpt_code": "71260",
    "final_cpt_code_description": "CT chest with IV contrast",
    "final_icd10_codes": "[\"R07.9\", \"I26.99\"]",
    "final_icd10_code_descriptions": "[\"Chest pain, unspecified\", \"Other pulmonary embolism without acute cor pulmonale\"]",
    
    // Validation Results
    "final_validation_status": "appropriate",
    "final_compliance_score": 8,
    "final_validation_notes": "Appropriate use of CT chest for chest pain evaluation",
    "validated_at": "2024-06-20T10:35:00Z",
    
    // Patient Information
    "patient_id": 456,
    "patient_first_name": "Jane",
    "patient_last_name": "Smith",
    "patient_middle_name": "Marie",
    "patient_date_of_birth": "1985-03-15",
    "patient_gender": "Female",
    "patient_address_line1": "123 Main St",
    "patient_address_line2": "Apt 4B",
    "patient_city": "Springfield",
    "patient_state": "IL",
    "patient_zip_code": "62701",
    "patient_phone_number": "555-123-4567",
    "patient_email": "jane.smith@email.com",
    "patient_mrn": "MRN123456",
    
    // Insurance Information (Primary)
    "insurance_name": "Blue Cross Blue Shield",
    "insurance_plan_name": "PPO Plus",
    "insurance_policy_number": "ABC123456789",
    "insurance_group_number": "GRP001",
    "insurance_policy_holder_name": "Jane Smith",
    "insurance_policy_holder_relationship": "Self",
    "insurance_policy_holder_dob": "1985-03-15",
    
    // Insurance Information (Secondary, if applicable)
    "secondary_insurance_name": null,
    "secondary_insurance_plan_name": null,
    "secondary_insurance_policy_number": null,
    "secondary_insurance_group_number": null,
    
    // Organization Information
    "referring_organization_id": 789,
    "radiology_organization_id": 101,
    "originating_location_id": 234,
    "target_facility_id": 567,
    
    // User Information
    "created_by_user_id": 345,
    "signed_by_user_id": 345,
    "updated_by_user_id": 345,
    "referring_physician_name": "Dr. John Doe",
    "referring_physician_npi": "1234567890",
    
    // Additional Clinical Data
    "patient_pregnant": "No",
    "patient_pregnancy_notes": null,
    "special_instructions": "Patient has claustrophobia, may need sedation",
    "prep_instructions": "Nothing by mouth 4 hours prior to exam",
    
    // Authorization Information
    "authorization_number": "AUTH789012",
    "authorization_status": "approved",
    "authorization_date": "2024-06-20T09:00:00Z",
    
    // Scheduling Information
    "scheduled_date": null,
    "signature_date": "2024-06-20T10:40:00Z",
    
    // Supplemental EMR Content (if available)
    "supplemental_emr_content": "Additional clinical notes from EMR system...",
    "supplemental_text": "Additional clinical notes from EMR system..."
  }
}
```

**Notes:**
- The coding fields (`final_cpt_code`, `final_cpt_code_description`, `final_icd10_codes`, `final_icd10_code_descriptions`) are populated after the order has been processed and validated
- `final_icd10_codes` and `final_icd10_code_descriptions` are stored as JSON strings containing arrays
- Insurance information may be null for cash-pay patients
- `supplemental_text` is an alias for `supplemental_emr_content` for frontend compatibility

### Get User Orders
**Endpoint:** `GET /api/orders`

**Description:** Get a list of orders accessible to the current user

**Authentication:** JWT token required

**Authorization:** Returns orders based on user's role and organization:
- **Physicians/Admin Staff**: Orders from their referring organization
- **Schedulers/Radiologists**: Orders sent to their radiology organization
- **Super Admins**: All orders in the system

**Query Parameters:**
- `status` (optional) - Filter by order status
- `limit` (optional) - Number of results to return (default: 50)
- `offset` (optional) - Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 123,
        "order_number": "ORD-2024-001234",
        "status": "pending_radiology",
        "priority": "routine",
        "patient_name": "Jane Smith",
        "patient_dob": "1985-03-15",
        "modality": "ct",
        "body_part": "chest",
        "created_at": "2024-06-20T10:30:00Z",
        "final_cpt_code": "71260",
        "final_validation_status": "appropriate"
      }
    ],
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

## File Upload

### Get Presigned URL
**Endpoint:** `POST /api/uploads/presigned-url`

**Description:** Get a presigned URL for uploading files to S3

**Authentication:** JWT token required

**Request Body:**
```json
{
  "filename": "document.pdf",
  "contentType": "application/pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/bucket/path?signature=...",
    "fileKey": "uploads/user123/document-uuid.pdf"
  }
}
```

### Confirm Upload
**Endpoint:** `POST /api/uploads/confirm`

**Description:** Confirm that a file has been uploaded successfully

**Authentication:** JWT token required

**Request Body:**
```json
{
  "fileKey": "uploads/user123/document-uuid.pdf",
  "originalFilename": "document.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileKey": "uploads/user123/document-uuid.pdf",
    "downloadUrl": "https://s3.amazonaws.com/bucket/uploads/user123/document-uuid.pdf"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized: Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request data",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "An internal server error occurred"
}
```