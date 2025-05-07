# Validation Engine

This document provides a comprehensive guide to the validation engine in the RadOrderPad system, which processes clinical indications from physician dictation to assign appropriate CPT and ICD-10 codes.

## Overview

The validation engine is a sophisticated system that analyzes clinical dictation text to provide clinical decision support, code suggestions, and appropriateness scoring. It is a critical component of the RadOrderPad system, enabling accurate and compliant medical coding based on clinical indications.

## Validation Engine Architecture

### Core Components

1. **Input Processing**
   - Receives physician dictation text
   - Extracts patient context (age, gender)
   - Handles draft order creation on first attempt

2. **PHI Stripping**
   - Removes potential patient identifiers from the dictation text

3. **Medical Context Extraction**
   - Identifies medical terms, imaging modalities, anatomy, laterality, and clinical conditions
   - Uses database lookups for relevant medical codes and mappings

4. **LLM Orchestration**
   - Primary: Claude 3.7
   - Fallbacks: Grok 3 → GPT-4.0
   - Uses specialized prompts for different validation scenarios

5. **Response Processing**
   - Extracts structured JSON output
   - Parses diagnosis codes, procedure codes, validation status, compliance score, and feedback

6. **Feedback Generation**
   - Adjusts feedback based on validation status and scenario
   - Provides educational content based on guidelines

## Validation Workflow

### Step 1: Initial Dictation

1. Physician enters patient information
2. Physician dictates or types the clinical scenario, reason for the study, relevant history, and symptoms
3. System sends the dictation to the validation endpoint (`POST /api/orders/validate`)
4. On first call, a draft order is created with `status = 'pending_validation'`

### Step 2: Validation Processing

1. The validation engine processes the dictation:
   - Strips PHI information
   - Extracts medical context
   - Queries database for relevant codes and guidelines
   - Constructs prompts for the LLM
   - Calls the LLM (Claude 3.7 with fallbacks)
   - Processes the LLM response

2. The validation result includes:
   - `validationStatus`: 'appropriate', 'needs_clarification', or 'inappropriate'
   - `complianceScore`: Numerical score reflecting appropriateness (1-9 or 0-100)
   - `feedback`: Textual explanation and educational content
   - `suggestedICD10Codes`: Array of diagnosis codes with descriptions
   - `suggestedCPTCodes`: Array of procedure codes with descriptions

### Step 3: Clarification Loop (If Needed)

If the validation status is not 'appropriate', the system enters a clarification loop:

1. Physician is shown feedback with guidance on what additional information is needed
2. Physician adds clarification to the dictation
3. System sends the combined original + clarification text back to the validation endpoint
4. This process can repeat up to 3 times

### Step 4: Override Flow (After 3 Failed Attempts)

If validation still fails after 3 attempts:

1. Physician is given the option to override the validation
2. Physician provides clinical justification for the override
3. System sends a final validation request with the combined text and override justification
4. The LLM evaluates the justification and provides final feedback

### Step 5: Finalization

1. Physician reviews the final validation result
2. Physician signs the order
3. System updates the order with final validation state, codes, and signature

## API Integration

### Validation Endpoint

**Endpoint:** `POST /api/orders/validate`

**Authentication:** Required (physician role)

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dictationText | string | Yes | The clinical dictation text from the physician |
| patientInfo | object | Yes | Patient context information |
| orderId | string | No | Present on attempts after the first |
| isOverrideValidation | boolean | No | Set to true for override validation |

**Patient Info Object:**

```typescript
interface PatientInfo {
  id: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  pidn?: string; // Patient Identifier Number
  age?: number; // Can be derived from DOB
}
```

**PIDN Formats:**
The Patient Identifier Number (PIDN) can be provided in several formats:
- Standard format: `P12345` (P-prefix followed by numbers)
- Hyphenated format: `P-98765` (P-prefix, hyphen, then numbers)
- Leading zeros: `P00123` (P-prefix with leading zeros)

All formats are accepted by the validation engine.

**Response Structure:**

```typescript
interface ValidationResponse {
  success: boolean;
  orderId: number;
  validationResult: {
    validationStatus: 'appropriate' | 'needs_clarification' | 'inappropriate';
    complianceScore: number;
    feedback: string;
    suggestedCPTCodes: Array<{
      code: string;
      description: string;
    }>;
    suggestedICD10Codes: Array<{
      code: string;
      description: string;
    }>;
    internalReasoning?: string; // May not be present in all responses
  };
}
```

### Order Finalization Endpoint

**Endpoint:** `PUT /api/orders/{orderId}`

**Authentication:** Required (physician role)

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| signature | string | Yes | Base64-encoded signature image |
| status | string | Yes | Should be 'pending_admin' |
| finalValidationStatus | string | Yes | The final validation status |
| finalCPTCode | string | Yes | The primary CPT code |
| clinicalIndication | string | Yes | The clinical indication text |
| finalICD10Codes | string[] | Yes | Array of ICD-10 codes |
| referring_organization_name | string | Yes | Name of the referring organization |
| overridden | boolean | No | Whether validation was overridden |
| overrideJustification | string | No | Justification for override |

## Implementation Considerations

### Handling Multiple Validation Attempts

```javascript
// Track attempt count
const [attemptCount, setAttemptCount] = useState(1);
const [dictationText, setDictationText] = useState('');
const [clarificationText, setClarificationText] = useState('');
const [orderId, setOrderId] = useState(null);

// Handle validation submission
const handleValidate = async () => {
  // Combine original dictation with clarification if this is a subsequent attempt
  const combinedText = attemptCount === 1 
    ? dictationText 
    : `${dictationText}\n\n--- CLARIFICATION ${attemptCount - 1} ---\n${clarificationText}`;
  
  const response = await fetch('/api/orders/validate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dictationText: combinedText,
      patientInfo,
      orderId: orderId, // Include orderId for attempts after the first
      isOverrideValidation: attemptCount > 3 // Set for override attempt
    })
  });
  
  const data = await response.json();
  
  // Store orderId from first attempt
  if (attemptCount === 1) {
    setOrderId(data.orderId);
  }
  
  // Update validation result
  setValidationResult(data.validationResult);
  
  // Increment attempt count for next attempt
  setAttemptCount(prev => prev + 1);
  
  // Update UI based on validation status
  if (data.validationResult.validationStatus === 'appropriate') {
    setCurrentStep('signature');
  } else if (attemptCount >= 3) {
    setCurrentStep('override');
  } else {
    // Clear clarification field for next attempt
    setClarificationText('');
  }
};
```

### Error Handling

Implement robust error handling for the validation workflow:

1. **Network Errors**
   - Handle connection issues
   - Implement retry logic for transient failures

2. **API Errors**
   - Parse error responses (400, 401, 403, 500)
   - Display user-friendly error messages

3. **Validation Engine Failures**
   - Handle cases where the LLM might be unavailable
   - Provide fallback options for users

### Performance Considerations

1. **Debounce Validation Requests**
   - Avoid triggering validation on every keystroke
   - Implement debounce for dictation input

2. **Progressive Loading**
   - Show loading indicators during validation
   - Implement skeleton UI while waiting for results

## Best Practices for Clinical Dictation

To ensure accurate CPT and ICD-10 code assignment, physicians should include:

1. **Patient Demographics**
   - Age
   - Gender
   - Relevant medical history

2. **Clinical Symptoms**
   - Primary symptoms and their duration
   - Location and radiation of symptoms
   - Severity and progression

3. **Relevant History**
   - Prior diagnoses related to current symptoms
   - Previous imaging or treatments
   - Risk factors

4. **Clinical Reasoning**
   - Suspected diagnosis or differential diagnoses
   - Reason for the imaging study
   - What information is being sought

### Example of Good Clinical Dictation

```
72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. 
Pain is worse with standing and walking. Patient has history of degenerative disc disease 
diagnosed 5 years ago. Physical exam shows positive straight leg raise on left side. 
No bowel or bladder symptoms. No recent trauma. Clinical concern for lumbar radiculopathy 
due to disc herniation. Need MRI lumbar spine without contrast to evaluate for nerve 
compression and guide treatment planning.
```

This example includes:
- Patient demographics (age, gender)
- Symptom description (location, radiation, duration, aggravating factors)
- Relevant history (degenerative disc disease)
- Physical exam findings (positive straight leg raise)
- Negative findings (no bowel/bladder symptoms, no trauma)
- Clinical reasoning (concern for radiculopathy)
- Requested study (MRI lumbar spine without contrast)
- Purpose of the study (evaluate nerve compression, guide treatment)

## Testing and Verification

The validation endpoint has been tested using the `test-validate-endpoint.js` script, which confirms:

1. The endpoint is operational and responding to requests
2. Processing time is approximately 11-12 seconds per request
3. No Redis caching is being used (each request takes similar time)
4. The endpoint correctly processes clinical indications and returns appropriate CPT and ICD-10 codes

## Conclusion

The RadOrderPad validation engine is designed to ensure accurate CPT and ICD-10 code assignment based on clinical indications provided by physicians. By following the guidelines in this document, frontend developers can implement an effective interface that guides physicians through the validation process and helps ensure compliance with clinical guidelines.