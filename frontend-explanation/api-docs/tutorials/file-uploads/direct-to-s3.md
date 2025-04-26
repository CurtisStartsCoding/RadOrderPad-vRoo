# Direct-to-S3 File Uploads

This guide covers the process of uploading files directly to Amazon S3 using presigned URLs in the RadOrderPad API.

## Prerequisites

- You must have a valid JWT token
- Your organization must be active
- You must have appropriate permissions for file uploads

## Direct-to-S3 Upload Flow

The direct-to-S3 upload flow consists of these steps:

1. Request a presigned URL from the API
2. Upload the file directly to S3 using the presigned URL
3. Notify the API that the upload is complete
4. Associate the uploaded file with an order or other entity

## Step 1: Request a Presigned URL

Request a presigned URL for file upload:

```javascript
const getPresignedUrl = async (token, fileInfo) => {
  try {
    const response = await fetch('/api/uploads/presigned-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fileInfo)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to get presigned URL:', error);
    throw error;
  }
};
```

The `fileInfo` object should include:
- `fileName`: Original file name
- `fileType`: MIME type of the file
- `fileSize`: Size of the file in bytes
- `purpose`: Purpose of the upload (order_attachment, patient_record, organization_document)
- `associatedId`: ID of the associated entity (optional)

Example:
```javascript
const fileInfo = {
  fileName: 'patient-history.pdf',
  fileType: 'application/pdf',
  fileSize: 1024000, // 1MB
  purpose: 'order_attachment',
  associatedId: 'order-123'
};
```

The response will include:
- `uploadId`: Unique identifier for this upload
- `presignedUrl`: The S3 presigned URL for uploading
- `fileKey`: The S3 object key for the file
- `expiresIn`: Expiration time for the presigned URL in seconds
- `fields`: Additional fields to include in the upload form (for POST uploads)

## Step 2: Upload the File to S3

### Method 1: Direct PUT Upload

Upload the file directly to S3 using the presigned URL with a PUT request:

```javascript
const uploadFileDirectPut = async (presignedUrl, file) => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    return {
      success: true,
      status: response.status
    };
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};
```

### Method 2: Form POST Upload

Upload the file using a multipart form POST:

```javascript
const uploadFileFormPost = async (presignedData, file) => {
  try {
    const formData = new FormData();
    
    // Add the fields from the presigned URL response
    Object.entries(presignedData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add the file as the last field
    formData.append('file', file);
    
    const response = await fetch(presignedData.presignedUrl, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    return {
      success: true,
      status: response.status
    };
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};
```

## Step 3: Notify the API of Completed Upload

After successfully uploading the file to S3, notify the API:

```javascript
const completeUpload = async (token, uploadId) => {
  try {
    const response = await fetch(`/api/uploads/${uploadId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to complete upload:', error);
    throw error;
  }
};
```

The response will include:
- `uploadId`: The upload ID
- `status`: Upload status (completed)
- `fileUrl`: URL for accessing the file
- `fileName`: Original file name
- `fileType`: MIME type of the file
- `fileSize`: Size of the file in bytes
- `uploadDate`: Date and time of the upload
- `expiryDate`: Date and time when the file will expire (if applicable)

## Step 4: Associate the File with an Entity

If you didn't specify an `associatedId` when requesting the presigned URL, you can associate the file with an entity after upload:

```javascript
const associateFile = async (token, uploadId, entityType, entityId) => {
  try {
    const response = await fetch(`/api/uploads/${uploadId}/associate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entityType,
        entityId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to associate file:', error);
    throw error;
  }
};
```

The `entityType` can be one of:
- `order`
- `patient`
- `organization`
- `user`

## Complete Example: File Upload Process

Here's a complete example of the file upload process:

```javascript
// Function to handle the entire upload process
const handleFileUpload = async (token, file, purpose, associatedId = null) => {
  try {
    // Step 1: Get a presigned URL
    const fileInfo = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      purpose,
      associatedId
    };
    
    const presignedData = await getPresignedUrl(token, fileInfo);
    
    // Step 2: Upload the file to S3
    let uploadResult;
    
    if (presignedData.fields) {
      // Use form POST method if fields are provided
      uploadResult = await uploadFileFormPost(presignedData, file);
    } else {
      // Use direct PUT method
      uploadResult = await uploadFileDirectPut(presignedData.presignedUrl, file);
    }
    
    if (!uploadResult.success) {
      throw new Error('File upload failed');
    }
    
    // Step 3: Notify the API that the upload is complete
    const completedUpload = await completeUpload(token, presignedData.uploadId);
    
    // Step 4: Associate the file with an entity (if not already associated)
    if (!associatedId && entityId) {
      await associateFile(token, presignedData.uploadId, entityType, entityId);
    }
    
    return completedUpload;
  } catch (error) {
    console.error('Upload process failed:', error);
    throw error;
  }
};
```

## File Upload Progress Tracking

To track upload progress, use the `XMLHttpRequest` API instead of `fetch`:

```javascript
const uploadFileWithProgress = (presignedUrl, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });
    
    // Handle successful upload
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          success: true,
          status: xhr.status
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });
    
    // Handle upload error
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });
    
    // Handle upload abort
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });
    
    // Set up and send the request
    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
};
```

Usage:
```javascript
uploadFileWithProgress(presignedUrl, file, (progress) => {
  console.log(`Upload progress: ${progress.toFixed(2)}%`);
  // Update UI with progress
  progressBar.style.width = `${progress}%`;
}).then(result => {
  console.log('Upload complete!');
}).catch(error => {
  console.error('Upload failed:', error);
});
```

## File Size Limits and Restrictions

The RadOrderPad API enforces these limits for file uploads:

- Maximum file size: 50MB
- Allowed file types:
  - Images: jpg, jpeg, png, gif, bmp, tiff
  - Documents: pdf, doc, docx, xls, xlsx, ppt, pptx, txt, rtf
  - Medical: dcm (DICOM)
- Maximum files per order: 10
- Maximum files per patient: 50
- Maximum files per organization: 1000

## Security Considerations

When implementing direct-to-S3 uploads:

1. **Never expose AWS credentials** in your client-side code
2. **Always use presigned URLs** for client-side uploads
3. **Validate file types and sizes** before requesting presigned URLs
4. **Set appropriate CORS configurations** on your S3 bucket
5. **Implement virus scanning** for uploaded files
6. **Use HTTPS** for all API and S3 communications
7. **Implement proper authentication** for file access
8. **Set appropriate expiration times** for presigned URLs

## Error Handling

When working with file upload endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid file information
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions
- 413 Payload Too Large: File exceeds size limit
- 415 Unsupported Media Type: File type not allowed
- 429 Too Many Requests: Upload rate limit exceeded
- 500 Internal Server Error: Server-side upload processing error

## Best Practices

1. **Validate files client-side** before uploading
2. **Implement retry logic** for failed uploads
3. **Show clear progress indicators** to users
4. **Provide cancel functionality** for long uploads
5. **Handle network interruptions** gracefully
6. **Implement chunked uploads** for large files
7. **Compress files when appropriate** before uploading
8. **Provide clear error messages** for upload failures
9. **Implement file type validation** using both extension and MIME type
10. **Consider implementing resumable uploads** for large files