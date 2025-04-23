# Uploads Management

This section covers endpoints related to managing file uploads in the RadOrderPad system.

## Get Presigned URL for Upload

**Endpoint:** `POST /api/uploads/presigned-url`

**Description:** Generates a presigned URL for uploading a file to S3. This is the first step in a two-step upload process.

**Authentication:** Required (physician role)

**Request Body:**
```json
{
  "fileName": "test-signature.png",
  "fileType": "image/png",
  "contentType": "image/png",
  "documentType": "signature",
  "orderId": 123,
  "patientId": 456
}
```

**Response:**
```json
{
  "url": "https://s3.amazonaws.com/bucket-name/path/to/file?AWSAccessKeyId=...",
  "fileKey": "uploads/org/context/id/example_file.png"
}
```

**Error Responses:**
- 400 Bad Request: If required fields are missing
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 500 Internal Server Error: If there is a server error (e.g., AWS credentials not configured)

**Usage Notes:**
- This endpoint is used to get a presigned URL for uploading a file to S3.
- After getting the URL, upload the file directly to S3 using the URL.
- Then call the `/api/uploads/confirm` endpoint to confirm the upload.
- Required fields: fileName, fileType, contentType, documentType, orderId, patientId

**Implementation Status:**
- **Status:** Exists but has server-side configuration issue
- **Tested With:** test-all-missing-endpoints.js
- **Error:** "AWS credentials or S3 bucket name not configured"

## Confirm Upload

**Endpoint:** `POST /api/uploads/confirm`

**Description:** Confirms that a file has been uploaded to S3 and associates it with an order.

**Authentication:** Required (physician role)

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
  "message": "File upload confirmed",
  "fileId": 789
}
```

**Error Responses:**
- 400 Bad Request: If required fields are missing or if the file does not exist in S3
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the appropriate role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to confirm that a file has been uploaded to S3.
- Call this endpoint after uploading a file to S3 using the presigned URL.
- Required fields: fileKey, orderId, patientId, documentType, fileName, fileSize, contentType
- The fileKey must match the one returned by the presigned URL endpoint.

**Implementation Status:**
- **Status:** Not tested (requires valid fileKey from presigned URL)
- **Tested With:** test-all-missing-endpoints.js
- **Error:** Skipped due to dependency on presigned URL