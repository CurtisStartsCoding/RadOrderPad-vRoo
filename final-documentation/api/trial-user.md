# Trial User API Reference

## Overview

Trial user endpoints provide limited access to the RadOrderPad platform for evaluation purposes. Trial users can explore the physician workflow with restrictions on persistent data creation and validation limits.

## Trial User Capabilities

- **Limited Validations**: 100 free validations per account
- **No Persistent Orders**: Cannot create finalized orders
- **Demo Patient Data**: Access to sample patient records
- **Simplified Authentication**: No organization required
- **Password Reset**: Simplified password update process

## Authentication Endpoints

### Trial Registration

Create a new trial user account.

**Endpoint:** `POST /api/auth/trial/register`

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "specialty": "Internal Medicine"
}
```

**Required Fields:**
- `email`: Valid email address
- `password`: Minimum 8 characters
- `firstName`: User's first name
- `lastName`: User's last name

**Optional Fields:**
- `specialty`: Medical specialty

**Response:**
```json
{
  "success": true,
  "message": "Trial account created.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "trialInfo": {
    "validationsUsed": 0,
    "maxValidations": 100,
    "validationsRemaining": 100
  }
}
```

**Error Responses:**
- `409 Conflict`: Email already registered
```json
{
  "success": false,
  "message": "This email is already registered for a trial. Please login instead."
}
```

### Trial Login

Authenticate an existing trial user.

**Endpoint:** `POST /api/auth/trial/login`

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "doctor@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "trial",
      "specialty": "Internal Medicine",
      "validationsUsed": 14,
      "validationsRemaining": 186
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
```json
{
  "success": false,
  "message": "Invalid email or password for trial account."
}
```

### Get Trial Profile

Get current trial user profile and validation status.

**Endpoint:** `GET /api/auth/trial/me`

**Headers:**
```
Authorization: Bearer <trial_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "doctor@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "trial",
    "specialty": "Internal Medicine",
    "createdAt": "2025-06-01T10:00:00.000Z",
    "lastValidationAt": "2025-06-13T15:30:00.000Z",
    "trialInfo": {
      "validationsUsed": 14,
      "maxValidations": 200,
      "validationsRemaining": 186
    }
  }
}
```

### Update Trial Password

Update password without email verification (simplified flow).

**Endpoint:** `POST /api/auth/trial/update-password`

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword456!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trial user password updated successfully."
}
```

**Error Responses:**
- `401 Unauthorized`: Current password incorrect
```json
{
  "success": false,
  "message": "Current password is incorrect."
}
```

## Physician Workflow Endpoints

### Patient Search

Search for demo patients (same as regular physicians).

**Endpoint:** `POST /api/patients/search`

**Headers:**
```
Authorization: Bearer <trial_token>
```

**Request Body:**
```json
{
  "searchTerm": "John",
  "searchType": "name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "patientId": "DEMO-001",
        "name": "John Smith",
        "dateOfBirth": "1970-01-15",
        "sex": "M",
        "insuranceInfo": {
          "primaryInsurance": "Demo Insurance Co",
          "memberId": "DEMO123456"
        }
      }
    ]
  }
}
```

### Trial Order Validation

Validate clinical dictation with trial limitations.

**Endpoint:** `POST /api/orders/validate/trial`

**Headers:**
```
Authorization: Bearer <trial_token>
```

**Request Body:**
```json
{
  "dictationText": "Patient is a 45-year-old male presenting with acute chest pain..."
}
```

**Required Fields:**
- `dictationText`: Clinical dictation (minimum 10 characters)

**Success Response:**
```json
{
  "success": true,
  "validationResult": {
    "validationStatus": "appropriate",
    "complianceScore": 9,
    "feedback": "",
    "suggestedICD10Codes": [
      {
        "code": "R07.9",
        "description": "Chest pain, unspecified",
        "isPrimary": true
      }
    ],
    "suggestedCPTCodes": [
      {
        "code": "71275",
        "description": "CT angiography, chest"
      }
    ],
    "improvedDictation": "CLINICAL INDICATION: 45-year-old male with acute chest pain..."
  },
  "trialInfo": {
    "validationsUsed": 15,
    "maxValidations": 200,
    "validationsRemaining": 185
  }
}
```

**Validation Limit Reached:**
```json
{
  "success": false,
  "message": "Validation limit reached. See your practice manager for a full account.",
  "trialInfo": {
    "validationsUsed": 100,
    "maxValidations": 100,
    "validationsRemaining": 0
  }
}
```

## Trial Limitations

### Cannot Access:
- `POST /api/orders` - Create finalized orders
- `PUT /api/orders/:orderId/finalize` - Finalize orders
- `/api/admin/*` - Admin endpoints
- `/api/radiology/*` - Radiology endpoints
- `/api/billing/*` - Billing endpoints
- `/api/organizations/*` - Organization endpoints
- `/api/connections/*` - Connection endpoints
- `/api/locations/*` - Location endpoints

### Rate Limits:
- Order validation: 60 requests per minute (same as physicians)
- Authentication endpoints: 5 requests per minute

## Trial Token Structure

Trial JWT tokens include special fields:

```json
{
  "userId": 999,
  "orgId": null,
  "role": "trial",
  "email": "trial-test@example.com",
  "isTrial": true,
  "specialty": "Internal Medicine",
  "iat": 1749778584,
  "exp": 1749782184
}
```

Key differences:
- `orgId` is null (no organization)
- `role` is "trial"
- `isTrial` flag is true

## Upgrade Path

When trial users reach their validation limit:

1. System returns 403 with upgrade message
2. User contacts support for full account
3. Support creates organization and migrates user
4. Trial validation history is preserved
5. User gains full physician capabilities

## Error Handling

All endpoints return standard error format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details"
}
```

Common status codes:
- `200` OK - Request successful
- `400` Bad Request - Invalid input
- `401` Unauthorized - Authentication failed
- `403` Forbidden - Validation limit reached
- `409` Conflict - Email already registered
- `500` Internal Server Error

## Best Practices

1. **Show Validation Count**: Always display remaining validations
2. **Graceful Limits**: Handle validation limit errors smoothly
3. **Upgrade Prompts**: Suggest upgrade when < 20 validations remain
4. **Demo Data**: Clearly indicate when using demo patients
5. **Feature Comparison**: Show what full accounts can access