# Validation Engine Integration Guide for Frontend Developers

## Overview

This technical guide explains how to integrate with the RadOrderPad validation engine from a frontend application. It covers the API contracts, state management considerations, error handling, and implementation patterns for the validation workflow.

## Core Validation Flow

The validation engine follows a specific workflow:

1. **Initial Validation**: Submit dictation text and patient context
2. **Draft Order Creation**: Backend creates a draft order on first validation
3. **Clarification Loop**: If needed, submit additional information (up to 3 attempts)
4. **Override Flow**: If validation still fails, provide justification for override
5. **Finalization**: Submit final order with signature and validation results

## API Integration

### Validation Endpoint

```
POST /api/orders/validate
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dictationText | string | Yes | The clinical dictation text from the physician |
| patientInfo | object | Yes | Patient context information |
| orderId | string | No | Present on attempts after the first |
| isOverrideValidation | boolean | No | Set to true for override validation |

#### Patient Info Object

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

#### Response Structure

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

```
PUT /api/orders/{orderId}
```

#### Request Parameters

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

## State Management

When implementing the validation workflow, you need to maintain several pieces of state:

1. **Authentication State**
   - JWT token
   - User information

2. **Patient Information**
   - Basic demographics
   - Patient Identifier Number (PIDN)

3. **Validation State**
   - Current attempt count
   - Dictation text (cumulative)
   - Validation result
   - Order ID

4. **Override State**
   - Override flag
   - Justification text

5. **Finalization State**
   - Signature data
   - Final selected codes

### Example State Structure

```typescript
interface ValidationWorkflowState {
  // Authentication
  token: string;
  user: User | null;
  
  // Workflow
  currentStep: 'login' | 'patientInfo' | 'dictation' | 'validation' | 'override' | 'signature' | 'finalized';
  attemptCount: number;
  
  // Form data
  patientInfo: PatientInfo;
  dictationText: string;
  
  // Validation results
  validationResult: ValidationResult | null;
  orderId: number | null;
  
  // Override
  isOverride: boolean;
  overrideJustification: string;
  
  // Signature
  signatureData: string;
}
```

## Handling Multiple Validation Attempts

The validation engine supports multiple attempts to provide clarification:

1. **First Attempt**
   - Send dictation text and patient info
   - Receive orderId and validation result
   - Store orderId for subsequent attempts

2. **Subsequent Attempts (2-3)**
   - Append clarification to existing dictation text
   - Send combined text with stored orderId
   - Update validation result with new response

3. **Override Attempt (After 3 Failed Attempts)**
   - Collect override justification
   - Send combined text with orderId and isOverrideValidation=true
   - Update validation result with final response

### Example Implementation

```typescript
// Track attempt count
const [attemptCount, setAttemptCount] = useState(1);
const [dictationText, setDictationText] = useState('');
const [clarificationText, setClarificationText] = useState('');
const [orderId, setOrderId] = useState<number | null>(null);

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

## Error Handling

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

### Example Error Handling

```typescript
try {
  const response = await fetch('/api/orders/validate', { /* ... */ });
  
  if (!response.ok) {
    const errorData = await response.json();
    
    if (response.status === 401) {
      // Handle authentication error
      handleTokenExpiration();
    } else if (response.status === 503) {
      // Handle validation engine unavailability
      showServiceUnavailableMessage("The validation service is temporarily unavailable. Please try again later.");
    } else {
      // Handle other API errors
      showErrorMessage(errorData.message || "An error occurred during validation");
    }
    return;
  }
  
  const data = await response.json();
  // Process successful response
} catch (error) {
  // Handle network or parsing errors
  showErrorMessage("A network error occurred. Please check your connection and try again.");
}
```

## Performance Considerations

1. **Debounce Validation Requests**
   - Avoid triggering validation on every keystroke
   - Implement debounce for dictation input

2. **Caching Validation Results**
   - Store validation results in local state
   - Consider caching for similar dictations

3. **Progressive Loading**
   - Show loading indicators during validation
   - Implement skeleton UI while waiting for results

## Testing Strategies

1. **Mock API Responses**
   - Create mock validation responses for testing
   - Simulate different validation statuses

2. **Test Edge Cases**
   - Very short/long dictations
   - Multiple clarification attempts
   - Override scenarios

3. **End-to-End Testing**
   - Test the complete validation workflow
   - Verify integration with backend services

## Conclusion

Integrating with the RadOrderPad validation engine requires careful state management and error handling. By following the patterns outlined in this guide, frontend developers can create a robust implementation that handles the complexities of the validation workflow while providing a smooth user experience.