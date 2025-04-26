# Getting Started with RadOrderPad API

This guide will help you get started with the RadOrderPad API, covering the essential steps to begin integrating with the platform.

## Overview

RadOrderPad is a comprehensive platform for managing radiology orders, from initial clinical dictation to final radiology processing. The API provides access to all functionality, including:

- User authentication and management
- Organization and location management
- Connection management between organizations
- Order creation and validation
- Administrative finalization
- Radiology workflow
- File uploads
- Billing and credit management

## Base URL

All API endpoints are relative to the base URL:

```
https://api.radorderpad.com
```

## Authentication

Most endpoints require authentication using a JWT token. You'll need to include this token in the Authorization header of your requests:

```
Authorization: Bearer <token>
```

### Obtaining a Token

To obtain a token, you need to authenticate using the login endpoint:

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('https://api.radorderpad.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data; // Contains accessToken and refreshToken
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

The response will include both an access token and a refresh token:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "12345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "physician",
      "organizationId": "67890"
    }
  }
}
```

### Token Refresh

Access tokens expire after 1 hour. When an access token expires, you can use the refresh token to obtain a new one:

```javascript
const refreshToken = async (refreshToken) => {
  try {
    const response = await fetch('https://api.radorderpad.com/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data; // Contains new accessToken
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};
```

## User Roles

The API supports several user roles, each with different permissions:

- **admin_staff**: Administrative staff at referring organizations
- **physician**: Physicians at referring organizations
- **admin_referring**: Administrators at referring organizations
- **super_admin**: System administrators
- **admin_radiology**: Administrators at radiology organizations
- **scheduler**: Schedulers at radiology organizations
- **radiologist**: Radiologists at radiology organizations
- **trial_physician**: Trial users with limited access

Each endpoint specifies which roles are authorized to access it.

## Request Format

- All request bodies should be in JSON format
- Include the `Content-Type: application/json` header with all requests that include a body

## Response Format

All responses are in JSON format and typically follow this structure:

```json
{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  }
}
```

Or in case of an error:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": {
    // Additional error details (optional)
  }
}
```

## Error Handling

The API uses standard HTTP status codes:

- **200 OK**: Request succeeded
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but not authorized for the requested resource
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

## Pagination

Endpoints that return lists of items typically support pagination with these query parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 20)
- `sortBy`: Field to sort by (default varies by endpoint)
- `sortOrder`: Sort direction ("asc" or "desc", default: "desc")

Paginated responses include a pagination object:

```json
{
  "items": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

## Common Workflows

### Physician Workflow

1. Authenticate as a physician
2. Submit clinical dictation for validation
3. Handle clarification requests if needed
4. Finalize and sign the order

### Administrative Workflow

1. Authenticate as admin staff
2. Access the admin order queue
3. Update patient and insurance information
4. Add supplemental documentation
5. Send the order to radiology

### Radiology Workflow

1. Authenticate as radiology staff
2. Access the incoming order queue
3. Update order status
4. Request additional information if needed
5. Complete the order

## Testing Tools

A comprehensive token generator script is provided to simplify API testing across different user roles:

```bash
node generate-all-role-tokens.js
```

This script generates tokens for all roles and saves them to separate files in the `tokens` directory.

## Next Steps

Now that you understand the basics, you can explore the specific areas of the API that are relevant to your integration:

- [Authentication](./authentication/regular-auth.md) - Detailed authentication guide
- [Validation Workflow](./order-workflows/validation-workflow.md) - Guide to the validation process
- [Admin Workflow](./order-workflows/admin-workflow.md) - Guide to the admin finalization process
- [Radiology Workflow](./order-workflows/radiology-workflow.md) - Guide to the radiology process
- [File Uploads](./file-uploads/direct-to-s3.md) - Guide to file uploads
- [Trial Features](./trial-features/physician-sandbox.md) - Guide to the trial features

For a complete reference of all API endpoints, see the [OpenAPI Specification](../openapi/openapi.yaml).