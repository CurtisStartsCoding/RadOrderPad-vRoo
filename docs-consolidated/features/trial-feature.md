# Physician Trial Sandbox Feature

## Overview

The Physician Trial Sandbox feature allows physicians to register for a limited trial account focused solely on testing the dictation-validation workflow without full registration or PHI involvement. This feature provides a way for physicians to try the validation engine easily without going through the full registration process.

Trial users can register with just their email, password, name, and specialty, and get a limited number of validations to test the system. This feature is completely separate from the main organization/user registration and the PHI database.

## Core Principles

1. **Modularity & Single Responsibility**: Complete separation between trial user data/workflows and production data/workflows.
2. **No PHI Involvement**: The trial process does not involve any PHI data.
3. **Limited Access**: Trial users have access only to the validation functionality, with a limited number of validations.
4. **Separate Storage**: Trial user data is stored only in the `radorder_main` database, with no interaction with the `radorder_phi` database.

## Feature Limitations

Trial users cannot:
- Finalize orders
- Access admin features
- Manage connections
- Upload non-signature files
- Store PHI data
- Exceed their validation limit (default: 10)

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

### Database Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Primary key for the trial user |
| email | TEXT | NOT NULL, UNIQUE | Trial user email address (used for login) |
| password_hash | TEXT | NOT NULL | Bcrypt hash of the trial user's password |
| first_name | TEXT | | Trial user first name |
| last_name | TEXT | | Trial user last name |
| specialty | TEXT | | Medical specialty (for trial physicians) |
| validation_count | INTEGER | NOT NULL, DEFAULT 0 | Number of validations performed by the trial user |
| max_validations | INTEGER | NOT NULL, DEFAULT 10 | Maximum number of validations allowed for the trial user |
| created_at | TIMESTAMP | DEFAULT NOW() | Timestamp when the trial user was created |
| last_validation_at | TIMESTAMP | | Timestamp of trial user's last validation |

## API Endpoints

### 1. Trial Registration

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
- **Database Interactions**:
  - **Reads**: `trial_users` (check if email exists), `users` (check if email is associated with a full account)
  - **Writes**: `trial_users` (create new trial user record)

### 2. Trial Login

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
  - `403 Forbidden`: Trial expired or usage limit reached
  - `500 Internal Server Error`: Server error
- **Database Interactions**:
  - **Reads**: `trial_users` (retrieve user by email to verify credentials)
  - **Writes**: None

### 3. Trial Validation

- **Endpoint**: `POST /api/orders/validate/trial`
- **Description**: Validate a dictation in trial mode
- **Authentication**: Required (trial user JWT token)
- **Request Body**:
  ```json
  {
    "dictation": "Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.",
    "modalityType": "CT"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "validationResult": {
        "cptCode": "71020",
        "cptDescription": "Radiologic examination, chest, two views, frontal and lateral",
        "icd10Codes": ["R07.9", "R06.02", "I10"],
        "icd10Descriptions": ["Chest pain, unspecified", "Shortness of breath", "Essential (primary) hypertension"],
        "confidence": 0.85
      },
      "validationsRemaining": 9
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing or invalid dictation text
  - `401 Unauthorized`: Invalid or expired token
  - `403 Forbidden`: Validation limit reached
  - `500 Internal Server Error`: Server error
  - `503 Service Unavailable`: LLM service unavailable
- **Database Interactions**:
  - **Reads**: 
    - `trial_users` (check validation count against max_validations)
    - `prompt_templates` (get validation prompt template)
    - `medical_*` (reference medical code data)
  - **Writes**: 
    - `trial_users` (update validation_count and last_validation_at)
    - `llm_validation_logs` (log validation attempt)

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

### Controllers

- `src/controllers/auth/trial/register.controller.ts`: Handles trial user registration
- `src/controllers/auth/trial/login.controller.ts`: Handles trial user login
- `src/controllers/order-validation/trial-validate.controller.ts`: Handles trial validation

### Services

- `src/services/auth/trial/register-trial-user.service.ts`: Registers a new trial user
- `src/services/auth/trial/login-trial-user.service.ts`: Authenticates a trial user
- `src/services/order/validation/trial/run-trial-validation.service.ts`: Runs validation for trial users

### Middleware

- `src/middleware/auth/authenticate-jwt.ts`: Modified to handle trial JWT tokens

```javascript
if (decoded.isTrial === true) {
  req.user = {
    userId: decoded.trialUserId,
    orgId: 0,
    role: 'trial_physician',
    email: decoded.email,
    isTrial: true,
    specialty: decoded.specialty
  };
}
```

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

### Frontend Implementation Notes

- Track remaining validations from the `validationsRemaining` field in the response
- Display appropriate messaging when approaching the validation limit
- Provide clear upgrade path when limit is reached

## Upgrading to Full Account

When a trial user wants to upgrade to a full account, they need to contact an administrator who can create a full account for them. The trial user's email cannot be used for a full account until the trial account is deleted.

## OpenAPI Specification

The trial feature is documented in the OpenAPI specification with the following components:

### Tags

```yaml
- name: Trial
  description: Trial user endpoints
```

### Schemas

```yaml
TrialInfo:
  type: object
  properties:
    validationsUsed:
      type: integer
      description: Number of validations used by the trial user
    validationsLimit:
      type: integer
      description: Maximum number of validations allowed for the trial user
    validationsRemaining:
      type: integer
      description: Number of validations remaining for the trial user
```

### User Role

```yaml
UserRole:
  type: string
  enum: [physician, admin_referring, admin_staff, admin_radiology, radiologist, scheduler, super_admin, trial_physician]
  description: Possible user role values
```

## Related Documentation

- [Validation Engine Integration Guide](../frontend/validation-engine-integration.md): Details on integrating with the validation engine
- [Validation Workflow Guide](../frontend/validation-workflow-guide.md): Overview of the validation workflow