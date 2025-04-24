# Uploads Management

This section covers endpoints related to managing file uploads in the RadOrderPad system.

## Get Presigned URL for Upload

**Endpoint:** `POST /api/uploads/presigned-url`

**Description:** Generates a presigned URL for uploading a file to S3. This is the first step in a two-step upload process.

**Authentication:** Required (physician, admin_referring, admin_radiology, radiologist, admin_staff roles)

**Request Body:**
```json
{
  "fileName": "test-signature.png",
  "fileType": "image/png",
  "contentType": "image/png",
  "documentType": "signature",
  "orderId": 123,
  "patientId": 456,
  "fileSize": 1048576
}
```

**Response:**
```json
{
  "success": true,
  "uploadUrl": "https://s3.amazonaws.com/bucket-name/path/to/file?AWSAccessKeyId=...",
  "fileKey": "uploads/org/context/id/example_file.png"
}
```

**Error Responses:**
- 400 Bad Request: If required fields are missing or validation fails (e.g., invalid file type, file size too large)
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 500 Internal Server Error: If there is a server error (e.g., AWS credentials not configured)

**Usage Notes:**
- This endpoint is used to get a presigned URL for uploading a file to S3.
- After getting the URL, upload the file directly to S3 using a PUT request with the appropriate Content-Type header.
- Then call the `/api/uploads/confirm` endpoint to confirm the upload.
- Required fields: fileName, fileType, contentType
- Optional fields: documentType, orderId, patientId, fileSize
- File size limits: 20MB for PDFs, 5MB for other file types
- Allowed file types: image/jpeg, image/png, image/gif, application/pdf, text/plain, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-uploads-presigned-url.js, test-uploads-presigned-url.bat, test-uploads-presigned-url.sh
- **Notes:** Successfully generates presigned URLs for S3 uploads with proper AWS credentials

## Confirm Upload

**Endpoint:** `POST /api/uploads/confirm`

**Description:** Confirms that a file has been uploaded to S3 and associates it with an order.

**Authentication:** Required (physician, admin_referring, admin_radiology, radiologist, admin_staff roles)

**Request Body:**
```json
{
  "fileKey": "uploads/org/context/id/example_file.png",
  "orderId": 123,
  "patientId": 456,
  "documentType": "signature",
  "fileName": "test-signature.png",
  "fileSize": 10240,
  "contentType": "image/png"
}
```

**Response:**
```json
{
  "success": true,
  "documentId": 789,
  "message": "Upload confirmed and recorded"
}
```

**Error Responses:**
- 400 Bad Request: If required fields are missing
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have permission to access the specified order
- 404 Not Found: If the order does not exist
- 500 Internal Server Error: If there is a server error (e.g., file not found in S3, database error)

**Usage Notes:**
- This endpoint is used to confirm that a file has been uploaded to S3.
- Call this endpoint after uploading a file to S3 using the presigned URL.
- Required fields: fileKey, orderId, patientId, documentType, fileName, fileSize, contentType
- The fileKey must match the one returned by the presigned URL endpoint.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-uploads-confirm.js, test-uploads-confirm.bat, test-uploads-confirm.sh
- **Notes:** Successfully verifies file existence in S3 and creates database record in the PHI database