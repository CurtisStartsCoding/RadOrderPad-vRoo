# Physician Trial Sandbox

This guide covers the Physician Trial Sandbox feature, which allows physicians to test the RadOrderPad validation engine without full registration or PHI involvement.

## Overview

The Physician Trial Sandbox is designed to provide a risk-free way for physicians to experience the power of RadOrderPad's validation engine. This feature allows physicians to submit clinical dictations and receive CPT and ICD-10 code assignments without creating an organization account or storing any Protected Health Information (PHI).

## Key Features

- **Limited Registration**: Simple registration with minimal information
- **No PHI Storage**: Dictations are processed but not stored as PHI
- **Limited Validation Count**: Default limit of 10 validations per trial account
- **Full Validation Capabilities**: Access to the same validation engine used in the full system
- **No Administrative Workflow**: Focus solely on the validation experience

## Trial User Registration

### Registration Endpoint

```
POST /api/auth/trial/register
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password (min 8 characters) |
| firstName | string | Yes | User's first name |
| lastName | string | Yes | User's last name |
| specialty | string | Yes | User's medical specialty |

### Example Request

```javascript
const registerTrialUser = async () => {
  try {
    const response = await fetch('/api/auth/trial/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'doctor.smith@example.com',
        password: 'SecurePassword123',
        firstName: 'John',
        lastName: 'Smith',
        specialty: 'Neurology'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to register trial user:', error);
    throw error;
  }
};
```

### Response Structure

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "trial_12345",
      "email": "doctor.smith@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "specialty": "Neurology",
      "role": "trial_physician",
      "validationsRemaining": 10
    }
  }
}
```

## Trial User Login

### Login Endpoint

```
POST /api/auth/trial/login
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password |

### Example Request

```javascript
const loginTrialUser = async (email, password) => {
  try {
    const response = await fetch('/api/auth/trial/login', {
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
    return data.data;
  } catch (error) {
    console.error('Failed to login trial user:', error);
    throw error;
  }
};
```

### Response Structure

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "trial_12345",
      "email": "doctor.smith@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "specialty": "Neurology",
      "role": "trial_physician",
      "validationsRemaining": 8
    }
  }
}
```

## Trial Validation

### Validation Endpoint

```
POST /api/orders/validate/trial
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dictation | string | Yes | The clinical dictation text to validate |
| modalityType | string | Yes | The type of imaging modality (CT, MRI, XRAY, ULTRASOUND, PET, NUCLEAR) |

### Example Request

```javascript
const submitTrialValidation = async (dictation, modalityType, token) => {
  try {
    const response = await fetch('/api/orders/validate/trial', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dictation,
        modalityType
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to validate dictation:', error);
    throw error;
  }
};
```

### Response Structure

```json
{
  "success": true,
  "data": {
    "validationResult": {
      "cptCode": "70450",
      "cptDescription": "CT scan of head/brain without contrast",
      "icd10Codes": ["R51.9", "S06.0X0A"],
      "icd10Descriptions": ["Headache, unspecified", "Concussion without loss of consciousness, initial encounter"],
      "confidence": 0.92
    },
    "validationsRemaining": 7
  }
}
```

### Error Responses

#### Validation Limit Reached

```json
{
  "success": false,
  "message": "Validation limit reached. Please register for a full account to continue using the service.",
  "error": {
    "code": "VALIDATION_LIMIT_REACHED",
    "validationsUsed": 10,
    "validationsLimit": 10
  }
}
```

#### LLM Service Unavailable

```json
{
  "success": false,
  "message": "Validation service temporarily unavailable. Please try again later.",
  "error": {
    "code": "SERVICE_UNAVAILABLE"
  }
}
```

## Technical Implementation

### Database Structure

Trial users are stored in a separate `trial_users` table in the Main database:

```sql
CREATE TABLE trial_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100),
  validation_count INTEGER DEFAULT 0,
  validation_limit INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

### Key Differences from Regular Validation

1. **No Order Creation**: Trial validations do not create order records in the PHI database
2. **Validation Counting**: Each validation increments the `validation_count` in the `trial_users` table
3. **Limit Enforcement**: Validations are rejected when `validation_count >= validation_limit`
4. **No Clarification Loop**: Trial validations are one-time only, without the clarification loop
5. **No Override Flow**: Trial validations do not support the override flow
6. **Sanitized Logging**: Validation attempts are logged with fully sanitized inputs

## Best Practices for Trial Validation

1. **Use Real-World Examples**: Test with realistic clinical scenarios
2. **Try Different Modalities**: Test across different imaging modalities
3. **Vary Dictation Length**: Test both concise and detailed dictations
4. **Include Edge Cases**: Test unusual or complex clinical scenarios
5. **Follow Clinical Dictation Guidelines**: Use the same best practices as in the full system

### Example Trial Dictation

```
"72-year-old male with progressive memory loss over the past 6 months. 
Patient reports difficulty finding words and getting lost while driving in familiar areas. 
Family reports personality changes and increased confusion in the evenings. 
No history of head trauma or stroke. 
Requesting MRI brain to evaluate for neurodegenerative disease vs. normal pressure hydrocephalus."
```

## Converting from Trial to Full Account

When a trial user is ready to convert to a full account:

1. They must register a new organization through the standard registration process
2. They can use the same email address as their trial account
3. Their trial account will remain separate but inactive
4. No data is transferred from the trial account to the full account

## Conclusion

The Physician Trial Sandbox provides a valuable way for physicians to experience the power of RadOrderPad's validation engine without committing to a full account. By following the steps outlined in this guide, physicians can quickly test the system's ability to accurately assign CPT and ICD-10 codes based on clinical dictations.