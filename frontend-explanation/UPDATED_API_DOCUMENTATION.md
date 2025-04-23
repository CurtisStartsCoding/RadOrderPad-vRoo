# RadOrderPad API Documentation (Updated)

This document provides detailed information about the API endpoints available in the RadOrderPad application, based on comprehensive testing performed against the Vercel deployment at `https://radorderpad-q20dishz7-capecomas-projects.vercel.app`.

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Obtaining a Token

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user and returns a JWT token.

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

**Usage Notes:**
- The token should be included in the Authorization header for all subsequent requests.
- The token contains information about the user's role and organization, which is used for authorization.
- Token expiration is set to 24 hours by default.

## Health Check

