# Common API Endpoints

These endpoints are available to multiple or all user roles. See the [Endpoint Access Matrix](endpoint-access-matrix.md) for role-specific permissions.

## Authentication

### Login
**POST** `/api/auth/login`
- **Description**: Authenticate and receive a JWT token
- **Access**: Public (no authentication required)
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "user": {
      "id": "number",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string",
      "organizationId": "number"
    }
  }
  ```
- **Error Codes**:
  - `400`: Email and password are required
  - `401`: Invalid credentials
  - `500`: Server error

### Trial Login
**POST** `/api/auth/trial/login`
- **Description**: Login for trial users (limited access)
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: Same as regular login

### Update Password
**POST** `/api/auth/update-password`
- **Description**: Change user password
- **Access**: All authenticated users
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```

## User Profile Management

### Get Current User Profile
**GET** `/api/users/me`
- **Description**: Get the authenticated user's profile
- **Access**: All authenticated users
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "number",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "phoneNumber": "string",
      "role": "string",
      "organizationId": "number",
      "isActive": "boolean",
      "specialty": "string (physicians only)",
      "npi": "string (physicians only)"
    }
  }
  ```

### Update Current User Profile
**PUT** `/api/users/me`
- **Description**: Update the authenticated user's profile
- **Access**: All authenticated users
- **Headers**: `Authorization: Bearer {token}`
- **Request Body** (all fields optional):
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "phoneNumber": "string",
    "specialty": "string (physicians only)",
    "npi": "string (physicians only)"
  }
  ```
- **Response**: Updated user profile

## Organization Information

### Get My Organization
**GET** `/api/organizations/mine`
- **Description**: Get details of the user's organization
- **Access**: All authenticated users
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "number",
      "name": "string",
      "type": "referring|radiology",
      "ein": "string",
      "npi": "string",
      "phone": "string",
      "email": "string",
      "address": {
        "line1": "string",
        "line2": "string",
        "city": "string",
        "state": "string",
        "zipCode": "string"
      },
      "creditBalance": "number",
      "isActive": "boolean"
    }
  }
  ```

## Order Management (Shared)

### List Orders
**GET** `/api/orders`
- **Description**: List orders with role-based filtering
- **Access**: All authenticated users (filtered by role)
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `status`: Filter by status
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `sortBy`: Field to sort by
  - `sortOrder`: 'asc' or 'desc'
- **Response**: List of orders based on user's role and permissions
- **Role-Specific Behavior**:
  - **Physicians**: See only orders they created
  - **Admin Staff**: See organization's orders in specific statuses
  - **Schedulers**: See incoming orders from partner organizations
  - **Radiologists**: See assigned orders

### Get Order Details
**GET** `/api/orders/:orderId`
- **Description**: Get detailed order information
- **Access**: Users with permission to view the order
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Complete order object with all details
- **Access Control**: Based on user's role and relationship to the order

## File Management

### Get Presigned Upload URL
**POST** `/api/uploads/presigned-url`
- **Description**: Get a presigned URL for direct file upload to S3
- **Access**: All authenticated users
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "fileName": "string",
    "fileType": "string",
    "context": "signature|supplemental|report"
  }
  ```
- **Response**:
  ```json
  {
    "uploadUrl": "string",
    "fileKey": "string"
  }
  ```

### Confirm Upload
**POST** `/api/uploads/confirm`
- **Description**: Confirm successful file upload
- **Access**: All authenticated users
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "fileKey": "string",
    "fileName": "string",
    "fileSize": "number",
    "fileType": "string",
    "orderId": "number (optional)",
    "documentType": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "documentId": "number"
  }
  ```

### Get Download URL
**GET** `/api/uploads/:documentId/download-url`
- **Description**: Get a presigned URL to download a document
- **Access**: Users with permission to view the document
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "downloadUrl": "string",
    "expiresIn": "number"
  }
  ```

## Health Check

### API Health
**GET** `/api/health`
- **Description**: Check if the API is running
- **Access**: Public (no authentication required)
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "ISO date"
  }
  ```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (in development)",
  "code": "ERROR_CODE (optional)"
}
```

## Common Status Codes
- **200**: Success (GET, PUT, DELETE)
- **201**: Created (POST)
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **429**: Rate Limited
- **500**: Server Error
- **503**: Service Unavailable