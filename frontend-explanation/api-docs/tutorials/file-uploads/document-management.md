# Document Management

This guide covers the document management capabilities of the RadOrderPad API, which allow you to list, retrieve, update, and delete uploaded files.

## Prerequisites

- You must have a valid JWT token
- Your organization must be active
- You must have appropriate permissions for document management

## Document Management Overview

The document management system provides these capabilities:

1. Listing uploaded files
2. Retrieving file metadata
3. Generating download URLs
4. Updating file metadata
5. Deleting files
6. Managing file associations
7. Searching for files

## Listing Uploaded Files

### List Files by Entity

Retrieve files associated with a specific entity:

```javascript
const getFilesByEntity = async (token, entityType, entityId, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/uploads/by-entity/${entityType}/${entityId}?page=${page}&limit=${limit}`, {
      method: 'GET',
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
    console.error('Failed to retrieve files:', error);
    throw error;
  }
};
```

The `entityType` can be one of:
- `order`
- `patient`
- `organization`
- `user`

The response will include:
- `files`: Array of file records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of files
  - `itemsPerPage`: Number of files per page

Each file record includes:
- `id`: File ID
- `fileName`: Original file name
- `fileType`: MIME type of the file
- `fileSize`: Size of the file in bytes
- `uploadDate`: Date and time of the upload
- `uploadedBy`: User who uploaded the file
- `purpose`: Purpose of the upload
- `status`: File status (processing, available, deleted)
- `thumbnailUrl`: URL for file thumbnail (for images)

### List Files by Purpose

Retrieve files filtered by purpose:

```javascript
const getFilesByPurpose = async (token, purpose, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/uploads/by-purpose/${purpose}?page=${page}&limit=${limit}`, {
      method: 'GET',
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
    console.error('Failed to retrieve files:', error);
    throw error;
  }
};
```

The `purpose` can be one of:
- `order_attachment`
- `patient_record`
- `organization_document`
- `user_profile`
- `system_report`

### List Recent Uploads

Retrieve recently uploaded files:

```javascript
const getRecentUploads = async (token, days = 7, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/uploads/recent?days=${days}&page=${page}&limit=${limit}`, {
      method: 'GET',
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
    console.error('Failed to retrieve recent uploads:', error);
    throw error;
  }
};
```

## Retrieving File Information

### Get File Metadata

Retrieve metadata for a specific file:

```javascript
const getFileMetadata = async (token, fileId) => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/metadata`, {
      method: 'GET',
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
    console.error('Failed to retrieve file metadata:', error);
    throw error;
  }
};
```

The response will include:
- `id`: File ID
- `fileName`: Original file name
- `fileType`: MIME type of the file
- `fileSize`: Size of the file in bytes
- `uploadDate`: Date and time of the upload
- `uploadedBy`: User who uploaded the file
- `purpose`: Purpose of the upload
- `status`: File status
- `associations`: Array of entity associations
  - `entityType`: Type of associated entity
  - `entityId`: ID of associated entity
  - `associationDate`: Date of the association
- `metadata`: Additional file metadata
  - `contentCreationDate`: Date the content was created (if available)
  - `contentModificationDate`: Date the content was last modified (if available)
  - `author`: Author of the content (if available)
  - `pageCount`: Number of pages (for documents)
  - `dimensions`: Image dimensions (for images)
  - `duration`: Media duration (for audio/video)
  - `tags`: Array of tags

### Generate Download URL

Generate a temporary URL for downloading a file:

```javascript
const getDownloadUrl = async (token, fileId, expiresIn = 3600) => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/download-url?expiresIn=${expiresIn}`, {
      method: 'GET',
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
    console.error('Failed to generate download URL:', error);
    throw error;
  }
};
```

The response will include:
- `downloadUrl`: Temporary URL for downloading the file
- `expiresAt`: Expiration time for the download URL
- `fileName`: Original file name

### Download a File

Download a file using the generated download URL:

```javascript
const downloadFile = async (downloadUrl, fileName) => {
  try {
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    // Create a blob from the response
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    
    // Append to the document and trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error('Failed to download file:', error);
    throw error;
  }
};
```

## Updating File Information

### Update File Metadata

Update metadata for a specific file:

```javascript
const updateFileMetadata = async (token, fileId, metadata) => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update file metadata:', error);
    throw error;
  }
};
```

The `metadata` object can include:
- `fileName`: Updated file name
- `purpose`: Updated purpose
- `tags`: Array of tags
- `description`: File description
- `customMetadata`: Object with custom metadata fields

### Add File Tags

Add tags to a file:

```javascript
const addFileTags = async (token, fileId, tags) => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/tags`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tags })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to add file tags:', error);
    throw error;
  }
};
```

### Remove File Tags

Remove tags from a file:

```javascript
const removeFileTags = async (token, fileId, tags) => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/tags`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tags })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to remove file tags:', error);
    throw error;
  }
};
```

## Managing File Associations

### Associate File with Entity

Associate a file with an entity:

```javascript
const associateFile = async (token, fileId, entityType, entityId) => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/associate`, {
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

### Disassociate File from Entity

Remove a file's association with an entity:

```javascript
const disassociateFile = async (token, fileId, entityType, entityId) => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/disassociate`, {
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
    console.error('Failed to disassociate file:', error);
    throw error;
  }
};
```

## Deleting Files

### Mark File for Deletion

Mark a file for deletion (soft delete):

```javascript
const markFileForDeletion = async (token, fileId, reason = '') => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/mark-for-deletion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to mark file for deletion:', error);
    throw error;
  }
};
```

### Restore Deleted File

Restore a file that was marked for deletion:

```javascript
const restoreDeletedFile = async (token, fileId) => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/restore`, {
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
    console.error('Failed to restore file:', error);
    throw error;
  }
};
```

### Permanently Delete File

Permanently delete a file (requires admin permissions):

```javascript
const permanentlyDeleteFile = async (token, fileId, confirmationCode) => {
  try {
    const response = await fetch(`/api/uploads/${fileId}/permanently-delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ confirmationCode })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to permanently delete file:', error);
    throw error;
  }
};
```

## Searching for Files

### Search Files by Criteria

Search for files using various criteria:

```javascript
const searchFiles = async (token, searchCriteria, page = 1, limit = 20) => {
  try {
    const response = await fetch('/api/uploads/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...searchCriteria,
        page,
        limit
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to search files:', error);
    throw error;
  }
};
```

The `searchCriteria` object can include:
- `fileName`: Search by file name (partial match)
- `fileType`: Search by file type (exact match)
- `uploadDateStart`: Filter by upload date (start)
- `uploadDateEnd`: Filter by upload date (end)
- `uploadedBy`: Filter by uploader user ID
- `purpose`: Filter by purpose
- `tags`: Array of tags to filter by
- `entityType`: Filter by associated entity type
- `entityId`: Filter by associated entity ID
- `status`: Filter by file status

Example:
```javascript
const searchCriteria = {
  fileName: 'report',
  fileType: 'application/pdf',
  uploadDateStart: '2025-01-01',
  tags: ['important', 'patient-history']
};
```

## Document Management Best Practices

1. **Implement proper file organization** using purpose and tags
2. **Use descriptive file names** for better searchability
3. **Add relevant metadata** to improve file management
4. **Implement file versioning** for important documents
5. **Regularly clean up temporary files** that are no longer needed
6. **Implement proper access controls** for sensitive documents
7. **Use file previews** when available instead of downloading
8. **Implement file expiration policies** for temporary documents
9. **Maintain audit logs** for file operations
10. **Implement file retention policies** based on document types

## Error Handling

When working with document management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: File not found
- 409 Conflict: File already associated or disassociated
- 410 Gone: File has been deleted
- 429 Too Many Requests: Rate limit exceeded

## File Security Considerations

1. **Implement proper access controls** based on file purpose and associations
2. **Use temporary download URLs** with short expiration times
3. **Validate file types** before allowing downloads
4. **Scan files for malware** before making them available
5. **Implement audit logging** for all file operations
6. **Use secure transmission** (HTTPS) for all file operations
7. **Implement proper backup procedures** for important documents
8. **Consider encryption** for sensitive documents
9. **Implement data retention policies** in compliance with regulations
10. **Provide secure file preview** capabilities when possible