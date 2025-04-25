# Physician Trial Sandbox Feature

This document provides an overview of the Physician Trial Sandbox feature, which allows physicians to register for a limited trial account focused solely on testing the dictation-validation workflow without full registration or PHI involvement.

## Overview

The Physician Trial Sandbox feature provides a way for physicians to try the validation engine easily without going through the full registration process. Trial users can register with just their email, password, name, and specialty, and get a limited number of validations to test the system.

This feature is completely separate from the main organization/user registration and the PHI database. It uses a dedicated `trial_users` table in the `radorder_main` database and separate API endpoints.

## Core Principles

1. **Modularity & Single Responsibility**: Complete separation between trial user data/workflows and production data/workflows.
2. **No PHI Involvement**: The trial process does not involve any PHI data.
3. **Limited Access**: Trial users have access only to the validation functionality, with a limited number of validations.
4. **Separate Storage**: Trial user data is stored only in the `radorder_main` database, with no interaction with the `radorder_phi` database.

## Database Schema

The trial user data is stored in the `trial_users` table in the `radorder_main` database:

```sql
CREATE TABLE trial_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  specialty TEXT,
  validation_count INTEGER NOT NULL DEFAULT 0,
  max_validations INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW(),
  last_validation_at TIMESTAMP NULL
);

-- Add index on email for faster lookups
CREATE INDEX idx_trial_users_email ON trial_users(email);
```

## API Endpoints

### Trial Registration

- **Endpoint**: `POST /api/auth/trial/register`
- **Description**: Register a new trial user
- **Authentication**: None (public endpoint)
- **Request Body**:
  ```json
  {
    "email": "trial-user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "specialty": "Cardiology"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Trial account created.",
    "token": "jwt-token-here"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Invalid input (missing required fields, invalid email format, password too short)
  - `409 Conflict`: Email already registered for a trial or associated with a full account
  - `500 Internal Server Error`: Server error

### Trial Login

- **Endpoint**: `POST /api/auth/trial/login`
- **Description**: Authenticate a trial user and get a JWT token
- **Authentication**: None (public endpoint)
- **Request Body**:
  ```json
  {
    "email": "trial-user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "jwt-token-here"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing required fields
  - `401 Unauthorized`: Invalid email or password
  - `500 Internal Server Error`: Server error

### Trial Validation

- **Endpoint**: `POST /api/orders/validate/trial`
- **Description**: Validate a dictation in trial mode
- **Authentication**: Required (trial user JWT token)
- **Request Body**:
  ```json
  {
    "dictationText": "Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "validationResult": {
      "validationStatus": "needs_clarification",
      "complianceScore": 5,
      "feedback": "Dictation lacks specific chest pain characteristics...",
      "suggestedICD10Codes": [
        {
          "code": "R07.9",
          "description": "Chest pain, unspecified"
        },
        {
          "code": "R06.02",
          "description": "Shortness of breath"
        },
        {
          "code": "I10",
          "description": "Essential (primary) hypertension"
        }
      ],
      "suggestedCPTCodes": [
        {
          "code": "71020",
          "description": "Radiologic examination, chest, two views, frontal and lateral"
        },
        {
          "code": "93000",
          "description": "Electrocardiogram, routine ECG with at least 12 leads; with interpretation and report"
        }
      ]
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing or invalid dictation text
  - `401 Unauthorized`: Invalid or expired token
  - `403 Forbidden`: Validation limit reached
  - `500 Internal Server Error`: Server error
  - `503 Service Unavailable`: LLM service unavailable

## Authentication

Trial users are authenticated using JWT tokens with a specific structure:

```javascript
{
  trialUserId: 123,
  userId: 123, // Mapped from trialUserId for compatibility
  orgId: 0, // No org for trial users
  role: 'trial_physician',
  email: 'trial-user@example.com',
  specialty: 'Cardiology',
  isTrial: true
}
```

The `isTrial` flag is used to identify trial users and route them to the appropriate endpoints.

## Validation Limit

Trial users are limited to a configurable number of validations (default: 10). The validation count is tracked in the `validation_count` column of the `trial_users` table. When a trial user reaches their validation limit, they receive a 403 Forbidden response with a message to contact support to upgrade to a full account.

## Implementation Details

1. **Controllers**:
   - `src/controllers/auth/trial/register.controller.ts`: Handles trial user registration
   - `src/controllers/auth/trial/login.controller.ts`: Handles trial user login
   - `src/controllers/order-validation/trial-validate.controller.ts`: Handles trial validation

2. **Services**:
   - `src/services/auth/trial/register-trial-user.service.ts`: Registers a new trial user
   - `src/services/auth/trial/login-trial-user.service.ts`: Authenticates a trial user
   - `src/services/order/validation/trial/run-trial-validation.service.ts`: Runs validation for trial users

3. **Middleware**:
   - `src/middleware/auth/authenticate-jwt.ts`: Modified to handle trial JWT tokens

## Error Handling

All endpoints implement robust error handling with appropriate HTTP status codes:

- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Validation limit reached
- `409 Conflict`: Email already registered
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: LLM service unavailable

## Testing

The trial feature can be tested using the following scripts:

- `debug-scripts/vercel-tests/test-trial-feature.js`: Tests the trial registration, login, and validation endpoints
- `debug-scripts/vercel-tests/run-trial-feature-test.bat/sh`: Batch/shell script to run the test

To test the validation limit, run:

```
node debug-scripts/vercel-tests/test-trial-feature.js limit
```

## Frontend Integration

The frontend can integrate with the trial feature by:

1. Adding a "Try it now" button on the landing page
2. Creating a simplified registration form that collects only email, password, name, and specialty
3. Implementing a trial validation page that shows the remaining validation count
4. Displaying a prompt to upgrade when the validation limit is reached

## Upgrading to Full Account

When a trial user wants to upgrade to a full account, they need to contact an administrator who can create a full account for them. The trial user's email cannot be used for a full account until the trial account is deleted.