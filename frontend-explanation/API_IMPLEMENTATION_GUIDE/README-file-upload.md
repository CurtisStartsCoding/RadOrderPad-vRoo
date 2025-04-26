# File Upload Endpoints Implementation

The file upload endpoints have been implemented and are now working correctly. These endpoints enable secure file uploads to AWS S3 using the presigned URL pattern.

## Implementation Details

### POST /api/uploads/presigned-url

- Generates a presigned URL for direct S3 upload
- Validates file type, size, and other parameters
- Returns a presigned URL and file key to the client
- Supports various document types (signature, insurance_card, lab_report, etc.)
- Implements file size limits (20MB for PDFs, 5MB for other file types)

### POST /api/uploads/confirm

- Confirms that a file has been successfully uploaded to S3
- Verifies the file exists in S3 before creating a database record
- Creates a record in the document_uploads table in the PHI database
- Associates the uploaded file with an order and/or patient
- Implements proper validation and error handling

### GET /api/uploads/{documentId}/download-url

- Generates a presigned URL for downloading a previously uploaded file
- Verifies the user has permission to access the file
- Implements proper validation and error handling

## Security Considerations

The implementation follows the presigned URL pattern for enhanced security:
- The backend controls access and generates temporary, scoped credentials
- S3 bucket remains private with no public access
- Backend AWS credentials are not exposed to the client
- File uploads go directly to S3, offloading the backend API servers
- File type validation prevents uploading of potentially malicious files

## Testing

All endpoints have been tested using comprehensive test scripts:
- test-uploads-presigned-url.js/bat/sh for testing the presigned URL endpoint
- test-uploads-confirm.js/bat/sh for testing the confirm endpoint
- test-uploads-download-url.js/bat/sh for testing the download URL endpoint

Tests include various scenarios:
- Valid requests
- Missing fields
- Invalid file types
- File size limits
- Authentication requirements
- Authorization checks

## Implementation Architecture

The implementation follows a modular, single-responsibility approach:

1. **Services**:
   - `generatePresignedUrl.service.ts`: Handles generating presigned URLs for S3 uploads
   - `confirmUpload.service.ts`: Handles confirming uploads and creating database records
   - `generateDownloadUrl.service.ts`: Handles generating presigned URLs for downloading files

2. **Controllers**:
   - `generatePresignedUrl.controller.ts`: Handles the presigned URL endpoint
   - `confirmUpload.controller.ts`: Handles the confirm upload endpoint
   - `generateDownloadUrl.controller.ts`: Handles the download URL endpoint

3. **Routes**:
   - All routes are defined in `uploads.routes.ts`
   - All routes use the authenticateJWT middleware
   - The download URL endpoint also checks that the user has permission to access the file

4. **Validation**:
   - Input validation is performed using Joi schemas
   - File type validation is performed using a whitelist of allowed MIME types
   - File size validation is performed based on file type

5. **Error Handling**:
   - All endpoints include comprehensive error handling
   - Appropriate HTTP status codes are returned for different error scenarios
   - Detailed error messages are provided for debugging

## Usage Example

```javascript
// Step 1: Get a presigned URL for uploading a file
const presignedUrlResponse = await axios.post(
  'https://api.radorderpad.com/api/uploads/presigned-url',
  {
    fileName: 'insurance-card.jpg',
    fileType: 'image/jpeg',
    documentType: 'insurance_card',
    orderId: '12345'
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
);

const { presignedUrl, fileKey } = presignedUrlResponse.data;

// Step 2: Upload the file directly to S3 using the presigned URL
await axios.put(
  presignedUrl,
  fileData, // The actual file data (e.g., from a file input)
  {
    headers: {
      'Content-Type': 'image/jpeg'
    }
  }
);

// Step 3: Confirm the upload with the backend
await axios.post(
  'https://api.radorderpad.com/api/uploads/confirm',
  {
    fileKey,
    orderId: '12345',
    documentType: 'insurance_card'
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
);

// Step 4: Later, get a download URL for the file
const downloadUrlResponse = await axios.get(
  `https://api.radorderpad.com/api/uploads/${documentId}/download-url`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const { downloadUrl } = downloadUrlResponse.data;

// Step 5: Download the file using the presigned URL
window.location.href = downloadUrl;