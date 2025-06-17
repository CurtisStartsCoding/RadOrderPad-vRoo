# File Upload API Endpoints

**Version:** 1.0  
**Last Updated:** June 2025  
**Service:** File Upload Management for RadOrderPad

## Overview

The file upload system provides secure document management for admin staff and other authorized users. It uses AWS S3 for storage with a presigned URL pattern for direct browser-to-S3 uploads, ensuring scalability and security.

## Authentication

All endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

## Endpoints

### 1. Get Presigned Upload URL

**Endpoint:** `POST /api/uploads/presigned-url`

**Description:** Generates a presigned URL for uploading a file directly to S3.

**Authorization:** Requires one of the following roles:
- `physician`
- `admin_referring`
- `admin_radiology`
- `radiologist`
- `admin_staff`

**Request Body:**
```json
{
  "fileType": "string",        // MIME type (e.g., "image/png", "application/pdf")
  "fileName": "string",        // Original filename
  "contentType": "string",     // Content type (same as fileType)
  "orderId": 123,             // Optional: Associated order ID
  "patientId": 456,           // Optional: Associated patient ID
  "documentType": "string",    // Optional: Document type (default: "signature")
  "fileSize": 1024000         // Optional: File size in bytes for validation
}
```

**Allowed File Types:**
- `image/jpeg`
- `image/png`
- `image/gif`
- `application/pdf`
- `text/plain`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**File Size Limits:**
- PDF files: Maximum 20MB
- Other files: Maximum 5MB

**Success Response (200):**
```json
{
  "success": true,
  "uploadUrl": "https://s3.amazonaws.com/bucket-name/...",  // Presigned URL for upload
  "fileKey": "uploads/123/orders/456/timestamp_random_filename.pdf"  // S3 key
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication
- `400 Bad Request` - Invalid request parameters or unsupported file type
- `500 Internal Server Error` - Server error during URL generation

**S3 Key Structure:**
```
uploads/{organization_id}/{context_type}/{context_id}/{timestamp}_{random}_{filename}
```
Where:
- `organization_id`: ID of the organization (derived from order)
- `context_type`: "orders", "patients", or "general"
- `context_id`: Order ID, Patient ID, or "no_id"

**Example Request:**
```bash
curl -X POST https://api.radorderpad.com/api/uploads/presigned-url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileType": "application/pdf",
    "fileName": "insurance_card.pdf",
    "contentType": "application/pdf",
    "orderId": 12345,
    "documentType": "insurance_card",
    "fileSize": 524288
  }'
```

### 2. Confirm Upload

**Endpoint:** `POST /api/uploads/confirm`

**Description:** Confirms a successful S3 upload and creates a database record.

**Authorization:** Requires one of the following roles:
- `physician`
- `admin_referring`
- `admin_radiology`
- `radiologist`
- `admin_staff`

**Request Body:**
```json
{
  "fileKey": "string",           // S3 key returned from presigned URL
  "orderId": 123,                // Associated order ID
  "patientId": 456,              // Associated patient ID
  "documentType": "string",      // Document type
  "fileName": "string",          // Original filename
  "fileSize": 1024000,          // File size in bytes
  "contentType": "string",       // MIME type
  "processingStatus": "string"   // Optional: Default "uploaded"
}
```

**Processing Status Values:**
- `uploaded` (default)
- `processing`
- `processed`
- `failed`

**Success Response (200):**
```json
{
  "success": true,
  "documentId": 789,
  "message": "Upload confirmed and recorded"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication
- `400 Bad Request` - Missing required parameters
- `404 Not Found` - File not found in S3
- `500 Internal Server Error` - Database or server error

**Example Request:**
```bash
curl -X POST https://api.radorderpad.com/api/uploads/confirm \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileKey": "uploads/123/orders/456/1234567890_abc123_insurance_card.pdf",
    "orderId": 12345,
    "patientId": 67890,
    "documentType": "insurance_card",
    "fileName": "insurance_card.pdf",
    "fileSize": 524288,
    "contentType": "application/pdf"
  }'
```

### 3. Get Download URL

**Endpoint:** `GET /api/uploads/:documentId/download-url`

**Description:** Generates a presigned URL for downloading a file from S3.

**Authorization:** JWT required. Access is granted only if the requesting user's organization matches the document's associated order or patient organization.

**Path Parameters:**
- `documentId` (integer): The ID of the document to download

**Success Response (200):**
```json
{
  "success": true,
  "downloadUrl": "https://s3.amazonaws.com/bucket-name/..."  // Presigned URL valid for 5 minutes
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication
- `400 Bad Request` - Invalid document ID format
- `404 Not Found` - Document not found or access denied
- `500 Internal Server Error` - Server error during URL generation

**Example Request:**
```bash
curl -X GET https://api.radorderpad.com/api/uploads/789/download-url \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Complete Upload Workflow

### Step 1: Request Presigned URL
```javascript
const response = await fetch('/api/uploads/presigned-url', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileType: file.type,
    fileName: file.name,
    contentType: file.type,
    orderId: orderId,
    documentType: 'insurance_card',
    fileSize: file.size
  })
});

const { uploadUrl, fileKey } = await response.json();
```

### Step 2: Upload File to S3

**Important**: When uploading to S3, you must send ONLY the Content-Type header. Do not include Authorization, Origin, or any other headers.

```javascript
const uploadResponse = await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type  // ONLY include Content-Type - must match what was sent to presigned-url endpoint
  },
  body: file
});

if (!uploadResponse.ok) {
  const errorText = await uploadResponse.text();
  console.error('S3 upload failed:', errorText);
  throw new Error('S3 upload failed');
}
```

**Common Issues to Avoid:**
- Do NOT include Authorization header (auth is in the presigned URL)
- Do NOT add custom headers or x-amz-* headers
- Do NOT use axios interceptors that add headers
- Ensure Content-Type exactly matches what was used to generate the presigned URL

### Step 3: Confirm Upload
```javascript
const confirmResponse = await fetch('/api/uploads/confirm', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileKey: fileKey,
    orderId: orderId,
    patientId: patientId,
    documentType: 'insurance_card',
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type
  })
});

const { documentId } = await confirmResponse.json();
```

### Step 4: Download File (Later)
```javascript
const downloadResponse = await fetch(`/api/uploads/${documentId}/download-url`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { downloadUrl } = await downloadResponse.json();
window.open(downloadUrl); // Opens file in new tab
```

## Database Schema

### document_uploads Table (PHI Database)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | PRIMARY KEY, AUTO_INCREMENT | Unique document ID |
| user_id | integer | NOT NULL | ID of user who uploaded |
| order_id | integer | FK REFERENCES orders(id) | Associated order |
| patient_id | integer | FK REFERENCES patients(id) | Associated patient |
| document_type | text | NOT NULL | Type of document |
| filename | text | NOT NULL | Original filename |
| file_path | text | NOT NULL, UNIQUE | S3 object key |
| file_size | integer | NOT NULL | Size in bytes |
| mime_type | text | | MIME type |
| processing_status | text | DEFAULT 'uploaded' | Processing status |
| processing_details | text | | Processing notes |
| content_extracted | text | | Extracted text (optional) |
| uploaded_at | timestamp | DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: 
   - Upload endpoints check role-based permissions
   - Download endpoint verifies organization-level access
3. **S3 Security**:
   - Bucket is private with no public access
   - Presigned URLs expire after 1 hour for uploads, 5 minutes for downloads
   - Server-side encryption enabled
4. **File Validation**:
   - File type restrictions enforced
   - File size limits enforced
   - S3 existence verified before database record creation
5. **Access Control**:
   - Users can only download files from their own organization
   - Organization determined through order or patient relationships

## Test Mode

The system includes a test mode for development and testing:
- Test order IDs (1, 999) bypass S3 verification
- Returns mock document ID (999) for test uploads
- Activated when `NODE_ENV=test` or when using specific test order IDs

## Technical Implementation Details

### AWS SDK Version
The system uses AWS SDK v3.200.0 for S3 operations. This specific version is required to avoid automatic checksum parameters that cause browser upload failures.

### Presigned URL Configuration
Presigned URLs are generated with the following parameters:
- **Signed Headers**: None specified - S3 handles headers naturally for browser compatibility
- **Expiration**: 1 hour for uploads, 5 minutes for downloads
- **Content-SHA256**: Set to `UNSIGNED-PAYLOAD` for browser compatibility

### S3 Upload Requirements
When uploading files to S3 using the presigned URL:
1. **Use fetch API** instead of axios (to avoid interceptors)
2. **Include Content-Type header** that matches what was sent to generate the presigned URL
3. **Browser will automatically add other headers** (Origin, User-Agent, etc.) - this is normal
4. **Do not manually add**: Authorization, x-amz-*, or custom headers

## AWS S3 Configuration

Required S3 bucket settings:
- **Encryption**: Server-Side Encryption (SSE-S3 or SSE-KMS)
- **Versioning**: Recommended for recovery
- **CORS**: Allow PUT requests from frontend domains with Content-Type header
- **Lifecycle**: Optional rules for archiving old documents
- **Access**: Private bucket, access only via IAM roles and presigned URLs

### CORS Configuration Example
```json
[
  {
    "AllowedHeaders": ["content-type"],
    "AllowedMethods": ["PUT", "POST", "GET", "HEAD", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://app.radorderpad.com"],
    "ExposeHeaders": ["ETag", "x-amz-server-side-encryption", "x-amz-request-id", "x-amz-id-2"],
    "MaxAgeSeconds": 3000
  }
]
```

## Error Handling

All endpoints follow a consistent error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common error scenarios:
- Missing authentication: 401 Unauthorized
- Invalid parameters: 400 Bad Request
- Resource not found: 404 Not Found
- Server errors: 500 Internal Server Error

## Related Documentation

- [File Upload Service Architecture](../file_upload_service.md)
- [Role-Based Access Control](../role_based_access.md)
- [AWS S3 Setup Guide](../../all-backend-tests/role-tests/AWS-S3-SETUP-GUIDE.md)