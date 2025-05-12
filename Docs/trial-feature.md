# Trial Feature Documentation

**Version:** 1.0
**Date:** 2025-05-12

## Overview

The Trial Feature allows users to experience RadOrderPad's validation capabilities without requiring a full account or organization setup. Trial users can register with basic information, log in, and perform a limited number of order validations.

## Key Concepts

- **Trial User**: A user with limited access to the system, specifically for validation testing purposes.
- **Validation Limit**: Each trial user has a maximum number of validations they can perform (default: 100).
- **Validation Count**: The number of validations a trial user has already performed.
- **Validations Remaining**: The difference between the maximum validations and the validation count.

## Database Schema

Trial users are stored in the `trial_users` table in the `radorder_main` database:

```sql
CREATE TABLE trial_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  specialty VARCHAR(100),
  validation_count INTEGER NOT NULL DEFAULT 0,
  max_validations INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_validation_at TIMESTAMP
);
```

## API Endpoints

### 1. Trial Registration

**Endpoint:** `POST /auth/trial/register`

**Description:** Registers a new trial user with basic information and returns a JWT token along with validation usage information.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "specialty": "Cardiology"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Trial account created.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "trialInfo": {
    "validationsUsed": 0,
    "maxValidations": 100,
    "validationsRemaining": 100
  }
}
```

**Error Responses:**
- 400 Bad Request: Missing required fields or invalid email/password format
- 409 Conflict: Email already registered or associated with a full account

### 2. Trial Login

**Endpoint:** `POST /auth/trial/login`

**Description:** Authenticates a trial user and returns a JWT token along with validation usage information.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "trialInfo": {
    "validationsUsed": 5,
    "maxValidations": 100,
    "validationsRemaining": 95
  }
}
```

**Error Responses:**
- 400 Bad Request: Missing email or password
- 401 Unauthorized: Invalid email or password

### 3. Trial Validation

**Endpoint:** `POST /orders/validate/trial`

**Description:** Submits dictation text for validation in trial mode. Does not create any PHI records. Checks the trial user's validation count against their maximum allowed validations and increments the count on successful validation.

**Request Body:**
```json
{
  "dictationText": "Patient is a 45-year-old male with chest pain..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "validationResult": {
    // Validation result object with codes, scores, etc.
  },
  "trialInfo": {
    "validationsUsed": 6,
    "maxValidations": 100,
    "validationsRemaining": 94
  }
}
```

**Error Responses:**
- 400 Bad Request: Missing or invalid dictation text
- 403 Forbidden: Validation limit reached
  ```json
  {
    "success": false,
    "message": "Validation limit reached. Please contact support to upgrade to a full account.",
    "trialInfo": {
      "validationsUsed": 100,
      "maxValidations": 100,
      "validationsRemaining": 0
    }
  }
  ```
- 404 Not Found: Trial user not found
- 503 Service Unavailable: Validation service temporarily unavailable

## JWT Token Structure

The JWT token for trial users includes the following payload:

```json
{
  "trialUserId": 123,
  "userId": 123,  // Maps to trialUserId for compatibility
  "orgId": 0,     // No org for trial users
  "role": "trial_physician",
  "email": "user@example.com",
  "specialty": "Cardiology",
  "isTrial": true
}
```

## Implementation Details

### Trial User Registration

1. Validates email format and password strength
2. Checks if the email is already associated with a full account or trial account
3. Hashes the password using bcrypt
4. Creates a new trial user record with validation_count=0 and max_validations=100
5. Generates a JWT token with trial user information
6. Returns the token and trial information

### Trial User Login

1. Authenticates the trial user's email and password
2. Retrieves validation_count and max_validations from the database
3. Calculates validationsRemaining
4. Generates a JWT token with trial user information
5. Returns the token and trial information

### Trial Validation

1. Verifies the user is a trial user using the JWT token
2. Checks if the user has reached their validation limit
3. Runs the validation on the provided dictation text
4. Increments the validation_count in the database
5. Returns the validation result and updated trial information

## Administration

### Checking Trial User Status

To check a trial user's status, use the following SQL query:

```sql
SELECT 
  id, 
  email, 
  validation_count, 
  max_validations, 
  created_at, 
  last_validation_at 
FROM trial_users 
WHERE email = 'user@example.com';
```

### Updating Trial User Validation Limit

To update a trial user's validation limit, use the following SQL query:

```sql
UPDATE trial_users 
SET max_validations = 200 
WHERE email = 'user@example.com';
```

### Resetting Trial User Validation Count

To reset a trial user's validation count, use the following SQL query:

```sql
UPDATE trial_users 
SET validation_count = 0 
WHERE email = 'user@example.com';
```

## Security Considerations

- Trial users have limited access to the system and cannot access PHI data
- Trial validations are run in test mode to prevent PHI logging
- Trial JWT tokens include the `isTrial: true` flag to ensure proper authorization checks
- Password hashing uses bcrypt with appropriate salt rounds
- Trial user data is stored in the main database, not the PHI database

## Limitations

- Trial users cannot create organizations or invite other users
- Trial users cannot access the full RadOrderPad workflow
- Trial users are limited to a fixed number of validations
- Trial validations do not persist order data or patient information