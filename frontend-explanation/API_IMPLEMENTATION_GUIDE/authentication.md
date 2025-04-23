# Authentication

All protected endpoints in the RadOrderPad API require a valid JWT token in the Authorization header.

## Authentication Header

Include the token in the Authorization header for all protected requests:

```
Authorization: Bearer <token>
```

## Obtaining a Token

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user and returns a JWT token.

**Authentication:** None required

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "user@example.com",
    "role": "physician",
    "orgId": 1,
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the credentials are invalid
- 404 Not Found: If the endpoint is accessed with GET method instead of POST
- 500 Internal Server Error: If there is a server error

**Supported Roles:**
This endpoint works for all roles in the system:
- admin_staff
- physician
- admin_referring
- super_admin
- admin_radiology
- scheduler
- radiologist

## Token Structure

The returned JWT token contains the following claims:
```json
{
  "userId": 4,
  "orgId": 1,
  "role": "admin_staff",
  "email": "test.admin_staff@example.com",
  "iat": 1745340763,
  "exp": 1745427163
}
```

## Usage Notes

- The token should be included in the Authorization header for all subsequent requests.
- The token contains information about the user's role and organization, which is used for authorization.
- Token expiration is set to 24 hours by default.
- This endpoint only accepts POST requests. GET requests will return a 404 error.
- Response time is typically under 200ms for successful logins.

## Method Restrictions

- `GET /api/auth/login`: Returns 404 "Route not found" error - This is by design as the login endpoint only accepts POST requests.