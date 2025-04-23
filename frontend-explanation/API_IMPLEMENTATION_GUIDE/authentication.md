# Authentication API

This document provides detailed information about the authentication endpoints in the RadOrderPad API.

## Overview

The authentication API handles user registration, login, and token management. It provides endpoints for:

- Self-service organization and admin user registration
- User login
- Token refresh
- Email verification
- Password reset

## Endpoints

### POST /api/auth/register

**Description:** Registers a new organization and its admin user simultaneously. This endpoint implements a self-service registration flow with security measures including CAPTCHA verification and email verification.

**Authentication:** None (public endpoint)

**Request Body:**
```json
{
  "organization": {
    "name": "Organization Name",
    "type": "referring_practice",
    "npi": "1234567890",
    "tax_id": "12-3456789",
    "address_line1": "123 Main St",
    "address_line2": "Suite 100",
    "city": "San Francisco",
    "state": "CA",
    "zip_code": "94105",
    "phone_number": "555-123-4567",
    "fax_number": "555-123-4568",
    "contact_email": "contact@example.com",
    "website": "https://example.com"
  },
  "user": {
    "email": "admin@example.com",
    "password": "securePassword123!",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin_referring",
    "npi": "0987654321",
    "specialty": "Family Medicine",
    "phone_number": "555-987-6543"
  },
  "captchaToken": "recaptcha_verification_token"
}
```

**Response (201 Created):**
```json
{
  "token": "jwt_token_for_authentication",
  "user": {
    "id": 123,
    "email": "admin@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin_referring",
    "organization_id": 456,
    "npi": "0987654321",
    "specialty": "Family Medicine",
    "is_active": true,
    "email_verified": false,
    "created_at": "2025-04-23T14:30:00.000Z",
    "updated_at": "2025-04-23T14:30:00.000Z"
  },
  "organization": {
    "id": 456,
    "name": "Organization Name",
    "type": "referring_practice",
    "npi": "1234567890",
    "address_line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip_code": "94105",
    "phone_number": "555-123-4567",
    "contact_email": "contact@example.com",
    "website": "https://example.com",
    "status": "pending_verification",
    "created_at": "2025-04-23T14:30:00.000Z"
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Error Responses:**

- 400 Bad Request: If required fields are missing or invalid
  ```json
  {
    "message": "Organization name and type are required"
  }
  ```
  or
  ```json
  {
    "message": "User email, password, first name, last name, and role are required"
  }
  ```
  or
  ```json
  {
    "message": "Invalid email format"
  }
  ```
  or
  ```json
  {
    "message": "Password must be at least 8 characters long"
  }
  ```
  or
  ```json
  {
    "message": "CAPTCHA verification is required"
  }
  ```
  or
  ```json
  {
    "message": "CAPTCHA verification failed"
  }
  ```

- 409 Conflict: If an organization with the same name already exists
  ```json
  {
    "message": "Organization already exists"
  }
  ```
  or
  ```json
  {
    "message": "Email already in use"
  }
  ```

- 500 Internal Server Error: If there is a server error

### POST /api/auth/login

**Description:** Authenticates a user and returns a JWT token.

**Authentication:** None (public endpoint)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response (200 OK):**
```json
{
  "token": "jwt_token_for_authentication",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin_referring",
    "organization_id": 456,
    "npi": "0987654321",
    "specialty": "Family Medicine",
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-04-23T14:30:00.000Z",
    "updated_at": "2025-04-23T14:30:00.000Z"
  }
}
```

**Error Responses:**

- 401 Unauthorized: If the email or password is invalid
  ```json
  {
    "message": "Invalid email or password"
  }
  ```
  or
  ```json
  {
    "message": "User account is inactive"
  }
  ```

- 500 Internal Server Error: If there is a server error

## Implementation Details

### Self-Service Registration Process

1. The client submits a registration request with organization and user details, including a CAPTCHA token.
2. The server validates the CAPTCHA token with the reCAPTCHA API.
3. The server validates the required fields for both organization and user, including email format and password strength.
4. The server begins a database transaction.
5. The server checks for duplicate organization names and email addresses.
6. The server creates a new organization record with status set to `pending_verification`.
7. The server attempts to create a Stripe customer for the organization.
8. The server creates a new admin user record with a hashed password.
9. The server generates an email verification token and stores it in the database.
10. The server commits the transaction.
11. The server sends a verification email to the user's email address.
12. The server generates a JWT token for the new user.
13. The server returns the token, user details, organization details, and a message instructing the user to check their email.

### Security Considerations

- The registration endpoint is protected by CAPTCHA verification to prevent automated abuse.
- Email verification ensures that users have access to the email addresses they register with.
- Organizations start with a `pending_verification` status until the email is verified.
- Passwords are hashed using bcrypt before storage.
- Password strength validation ensures secure passwords.
- Database transactions ensure atomicity of organization and user creation.
- JWT tokens are signed with a secret key and have an expiration time.

### Testing

To test the self-service registration endpoint, you can use the provided test scripts:

- Windows: `debug-scripts/vercel-tests/test-register-modified.bat`
- Unix: `debug-scripts/vercel-tests/test-register-modified.sh`

These scripts test various scenarios including:
1. Valid registration
2. Duplicate organization name
3. Missing required fields
4. Invalid email format
5. Missing CAPTCHA token

The test scripts use a test CAPTCHA token that is accepted in development/test environments.