# Validation Workflow

This guide covers the complete validation workflow for submitting clinical dictation and obtaining CPT and ICD-10 codes in the RadOrderPad system.

## Overview

The validation engine is the heart of RadOrderPad, processing clinical indications from physician dictation to assign appropriate CPT and ICD-10 codes. This functionality ensures accurate medical coding and compliance with clinical guidelines.

## Prerequisites

- You must have a physician role
- Your organization must be active
- You should have a valid JWT token

## Validation Architecture

The validation engine uses a sophisticated LLM orchestration system:

- **Primary LLM**: Claude 3.7
- **Fallback LLMs**: Grok 3 → GPT-4.0
- **Specialized Prompts**: Different prompts for various validation scenarios
- **Dual Database Interaction**: Reads from and writes to both PHI and Main databases

## Workflow Steps

The validation workflow consists of these steps:

1. Submit initial dictation
2. Handle clarification requests (if needed)
3. Override validation (if needed after 3 failed attempts)
4. Finalize and sign the order

### Step 1: Submit Initial Dictation

Submit the clinical dictation to the validation endpoint:

```javascript
const submitDictation = async (dictation, modalityType, token) => {
  try {
    const response = await fetch('/api/orders/validate', {
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

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dictation | string | Yes | The clinical dictation text to validate |
| modalityType | string | Yes | The type of imaging modality (CT, MRI, XRAY, ULTRASOUND, PET, NUCLEAR) |
| isOverrideValidation | boolean | No | Whether this is an override validation after multiple failed attempts |
| patientInfo | object | No | Patient information (firstName, lastName, dateOfBirth, gender) - only required for finalization |
| orderId | string | No | For subsequent validation attempts or finalization, the ID of the existing order |
| radiologyOrganizationId | number | No | ID of the radiology organization - only required for finalization |

#### Response Structure

For initial stateless validation calls, the response will include:

- `success`: Boolean indicating success
- `validationResult`: The validation result with CPT and ICD-10 codes
  - `cptCode`: The assigned CPT code
  - `cptDescription`: Description of the CPT code
  - `icd10Codes`: Array of assigned ICD-10 codes
  - `icd10Descriptions`: Array of ICD-10 code descriptions
  - `confidence`: Confidence score of the validation
- `requiresClarification`: Whether additional clarification is needed
- `clarificationPrompt`: The prompt for clarification if needed

Note: During initial stateless validation, no `orderId` is returned and no database records are created except for LLM usage logs.

#### Example Response

```json
{
  "success": true,
  "validationResult": {
    "cptCode": "70450",
    "cptDescription": "CT scan of head/brain without contrast",
    "icd10Codes": ["R51.9", "S06.0X0A"],
    "icd10Descriptions": ["Headache, unspecified", "Concussion without loss of consciousness, initial encounter"],
    "confidence": 0.92
  },
  "requiresClarification": false
}
```

### Step 2: Handle Clarification Requests

If `requiresClarification` is true, you need to submit additional information:

```javascript
const submitClarification = async (orderId, dictation, token) => {
  try {
    const response = await fetch('/api/orders/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId,
        dictation
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to submit clarification:', error);
    throw error;
  }
};
```

#### Clarification Flow

1. The system identifies that more information is needed
2. A clarification prompt is returned in the response
3. The physician provides additional information
4. The system attempts validation again with the combined information
5. This process can repeat up to 3 times before requiring an override

#### Example Clarification Prompt

```
"To accurately determine the appropriate CPT code, please provide more information about:
1. The duration of the patient's symptoms
2. Any prior imaging studies
3. Whether there is a history of trauma or surgery in the affected area"
```

### Step 3: Override Validation (If Needed)

After 3 failed attempts, you can submit an override validation:

```javascript
const submitOverride = async (orderId, dictation, token) => {
  try {
    const response = await fetch('/api/orders/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId,
        dictation,
        isOverrideValidation: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to submit override:', error);
    throw error;
  }
};
```

#### Override Flow

1. After 3 failed validation attempts, the system allows an override
2. The physician submits the dictation with `isOverrideValidation: true`
3. The system processes the override with a specialized prompt
4. The validation result is marked as an override in the database

### Step 4: Finalize and Sign the Order

Once validation is successful, finalize and sign the order:

```javascript
const finalizeOrder = async (orderId, token) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'pending_admin'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to finalize order:', error);
    throw error;
  }
};
```

#### Finalization Process

1. The order is updated with the final validation state
2. The physician's signature is recorded
3. The order status is changed to 'pending_admin'
4. The order is added to the admin queue for further processing

## Database Interactions

The validation process interacts with both databases:

### PHI Database
- Creates or updates the `orders` record
- Stores validation attempts in `validation_attempts`
- Logs order history in `order_history`

### Main Database
- Logs validation attempts in `llm_validation_logs` (with PHI sanitized)
- Retrieves prompt templates from `prompt_templates`
- Checks prompt assignments in `prompt_assignments`

## Error Handling

When working with validation endpoints, be prepared to handle these common errors:

- **400 Bad Request**: Invalid input (e.g., missing required fields)
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions (non-physician role)
- **503 Service Unavailable**: LLM service is temporarily unavailable

### Handling LLM Service Unavailability

The LLM service may occasionally be unavailable. Implement retry logic with exponential backoff:

```javascript
const validateWithRetry = async (dictation, modalityType, token, maxRetries = 3) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await submitDictation(dictation, modalityType, token);
    } catch (error) {
      if (error.message.includes('503') && retries < maxRetries - 1) {
        retries++;
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff
        console.log(`Retry ${retries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};
```

## Best Practices for Clinical Dictation

To maximize validation accuracy, follow these best practices:

1. **Include Patient Demographics**
   - Age and gender
   - Relevant physical characteristics

2. **Describe Clinical Symptoms**
   - Location (specific body part)
   - Duration (acute, chronic, specific timeframe)
   - Severity (mild, moderate, severe)
   - Pattern (constant, intermittent, progressive)

3. **Include Relevant History**
   - Prior diagnoses
   - Previous treatments
   - Family history if relevant
   - Prior imaging studies

4. **Provide Clinical Reasoning**
   - Suspected diagnosis
   - Differential diagnoses
   - Reason for the imaging study
   - What you hope to confirm or rule out

5. **Specify Modality Preferences**
   - Preferred imaging modality
   - With or without contrast
   - Special protocols if needed

### Example of Good Clinical Dictation

```
"45-year-old female with 3-week history of progressively worsening right lower quadrant abdominal pain. 
Pain is sharp, rated 7/10, and worse with movement. Patient reports low-grade fever and nausea. 
Physical exam reveals tenderness to palpation in RLQ with guarding. 
No prior abdominal surgeries. Family history significant for colon cancer in father. 
Last colonoscopy 5 years ago was normal. 
Requesting CT abdomen and pelvis with contrast to evaluate for appendicitis, diverticulitis, 
or possible mass lesion."
```

## Validation Performance Metrics

The validation engine achieves the following performance metrics:

- **First-attempt accuracy**: ~85%
- **After clarification accuracy**: ~92%
- **Overall accuracy (including overrides)**: ~98%
- **Average response time**: 2-3 seconds
- **Service availability**: 99.9%

## Conclusion

The validation workflow is a critical component of the RadOrderPad system, ensuring accurate CPT and ICD-10 code assignment for radiology orders. By following the steps outlined in this guide and adhering to best practices for clinical dictation, you can maximize the accuracy and efficiency of the validation process.