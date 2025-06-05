# Validation Engine Integration Guide for Frontend Developers

**Version:** 2.0 (Stateless Validation Implementation)
**Date:** June 5, 2025
**Author:** Documentation Team
**Status:** Current

## Overview

This technical guide explains how to integrate with the RadOrderPad validation engine from a frontend application. It covers the API contracts, state management considerations, error handling, and implementation patterns for the validation workflow.

## Core Validation Flow

The validation engine follows a specific workflow:

1. **Initial Validation**: Submit dictation text
2. **Stateless Processing**: Backend processes the validation without creating any database records
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
| patientInfo | object | No | Patient context information (optional) |
| orderId | number | No | ID of an existing order (optional) |
| isOverrideValidation | boolean | No | Set to true for override validation (optional) |

#### Patient Info Object (Optional)

```typescript
interface PatientInfo {
  id?: number;
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
  orderId?: number; // Only included if orderId was provided in the request
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
PUT /api/orders/new
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| patientInfo | object | Yes | Patient information |
| dictationText | string | Yes | The clinical dictation text |
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
   - No orderId is needed during the validation process

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
   - Send dictation text
   - Receive validation result
   - No orderId is returned or needed

2. **Subsequent Attempts (2-3)**
   - Append clarification to existing dictation text
   - Send combined text
   - Update validation result with new response

3. **Override Attempt (After 3 Failed Attempts)**
   - Collect override justification
   - Send combined text with isOverrideValidation=true
   - Update validation result with final response

### Example Implementation

```typescript
// Track attempt count
const [attemptCount, setAttemptCount] = useState(1);
const [dictationText, setDictationText] = useState('');
const [clarificationText, setClarificationText] = useState('');
const [validationResult, setValidationResult] = useState(null);

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
      isOverrideValidation: attemptCount > 3 // Set for override attempt
    })
  });
  
  const data = await response.json();
  
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

## Finalization Implementation

After completing the validation process, you need to finalize the order:

```typescript
const finalizeOrder = async () => {
  try {
    const response = await fetch('/api/orders/new', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patientInfo,
        dictationText,
        signature: signatureData,
        status: 'pending_admin',
        finalValidationStatus: validationResult.validationStatus,
        finalCPTCode: selectedCPTCode,
        clinicalIndication: validationResult.feedback,
        finalICD10Codes: selectedICD10Codes,
        referring_organization_name: user.organization.name,
        overridden: isOverride,
        overrideJustification: overrideJustification
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      showErrorMessage(errorData.message || "An error occurred during finalization");
      return;
    }
    
    const data = await response.json();
    // Handle successful finalization
    setCurrentStep('finalized');
    showSuccessMessage("Order submitted successfully");
  } catch (error) {
    // Handle network or parsing errors
    showErrorMessage("A network error occurred. Please check your connection and try again.");
  }
};
```

## UI Components

Here are the key UI components needed for the validation workflow:

1. **PatientInfoForm**
   - Collects patient demographics
   - Validates required fields

2. **DictationForm**
   - Provides text area for dictation
   - Includes microphone button for voice input
   - Shows validation feedback banner

3. **ValidationFeedbackBanner**
   - Displays validation status, score, and feedback
   - Shows suggested codes
   - Provides buttons for clarification or override

4. **OverrideDialog**
   - Collects override justification
   - Validates minimum length

5. **ValidationView**
   - Shows final validation result
   - Displays selected codes
   - Provides option to go back or proceed to signature

6. **SignatureForm**
   - Provides canvas for signature
   - Collects attestation
   - Submits final order

## Performance Considerations

1. **Debounce Validation Requests**
   - Avoid triggering validation on every keystroke
   - Implement debounce for dictation input

2. **Progressive Loading**
   - Show loading indicators during validation
   - Implement skeleton UI while waiting for results

3. **Error Recovery**
   - Provide retry options for failed requests
   - Cache form data to prevent loss

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

## Example Workflow Implementation

```typescript
import React, { useState } from 'react';
import PatientInfoForm from './PatientInfoForm';
import DictationForm from './DictationForm';
import ValidationFeedbackBanner from './ValidationFeedbackBanner';
import OverrideDialog from './OverrideDialog';
import ValidationView from './ValidationView';
import SignatureForm from './SignatureForm';

const ValidationWorkflow = () => {
  // State management
  const [currentStep, setCurrentStep] = useState('patientInfo');
  const [attemptCount, setAttemptCount] = useState(1);
  const [patientInfo, setPatientInfo] = useState(null);
  const [dictationText, setDictationText] = useState('');
  const [clarificationText, setClarificationText] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isOverride, setIsOverride] = useState(false);
  const [overrideJustification, setOverrideJustification] = useState('');
  const [signatureData, setSignatureData] = useState('');
  
  // Handle patient info submission
  const handlePatientInfoSubmit = (info) => {
    setPatientInfo(info);
    setCurrentStep('dictation');
  };
  
  // Handle dictation submission
  const handleDictationSubmit = async () => {
    // Combine original dictation with clarification if this is a subsequent attempt
    const combinedText = attemptCount === 1 
      ? dictationText 
      : `${dictationText}\n\n--- CLARIFICATION ${attemptCount - 1} ---\n${clarificationText}`;
    
    try {
      const response = await fetch('/api/orders/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dictationText: combinedText,
          isOverrideValidation: isOverride
        })
      });
      
      if (!response.ok) {
        throw new Error('Validation failed');
      }
      
      const data = await response.json();
      setValidationResult(data.validationResult);
      
      // Update UI based on validation status
      if (data.validationResult.validationStatus === 'appropriate') {
        setCurrentStep('validation');
      } else if (attemptCount >= 3) {
        setCurrentStep('override');
      } else {
        // Increment attempt count for next attempt
        setAttemptCount(prev => prev + 1);
        // Clear clarification field for next attempt
        setClarificationText('');
      }
    } catch (error) {
      console.error('Error during validation:', error);
      // Show error message to user
    }
  };
  
  // Handle override submission
  const handleOverrideSubmit = (justification) => {
    setIsOverride(true);
    setOverrideJustification(justification);
    // Resubmit with override flag
    handleDictationSubmit();
  };
  
  // Handle signature submission
  const handleSignatureSubmit = async (signature) => {
    setSignatureData(signature);
    
    try {
      const response = await fetch('/api/orders/new', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientInfo,
          dictationText,
          signature,
          status: 'pending_admin',
          finalValidationStatus: validationResult.validationStatus,
          finalCPTCode: validationResult.suggestedCPTCodes[0].code,
          clinicalIndication: validationResult.feedback,
          finalICD10Codes: validationResult.suggestedICD10Codes.map(code => code.code),
          referring_organization_name: 'Test Organization',
          overridden: isOverride,
          overrideJustification
        })
      });
      
      if (!response.ok) {
        throw new Error('Finalization failed');
      }
      
      const data = await response.json();
      setCurrentStep('finalized');
    } catch (error) {
      console.error('Error during finalization:', error);
      // Show error message to user
    }
  };
  
  // Render the current step
  return (
    <div className="validation-workflow">
      {currentStep === 'patientInfo' && (
        <PatientInfoForm onSubmit={handlePatientInfoSubmit} />
      )}
      
      {currentStep === 'dictation' && (
        <DictationForm
          dictationText={dictationText}
          onDictationChange={setDictationText}
          clarificationText={clarificationText}
          onClarificationChange={setClarificationText}
          attemptCount={attemptCount}
          validationResult={validationResult}
          onSubmit={handleDictationSubmit}
        />
      )}
      
      {currentStep === 'override' && (
        <OverrideDialog onSubmit={handleOverrideSubmit} />
      )}
      
      {currentStep === 'validation' && (
        <ValidationView
          validationResult={validationResult}
          dictationText={dictationText}
          isOverride={isOverride}
          overrideJustification={overrideJustification}
          onBack={() => setCurrentStep('dictation')}
          onNext={() => setCurrentStep('signature')}
        />
      )}
      
      {currentStep === 'signature' && (
        <SignatureForm onSubmit={handleSignatureSubmit} />
      )}
      
      {currentStep === 'finalized' && (
        <div className="success-message">
          <h2>Order Submitted Successfully</h2>
          <p>Your order has been submitted and is pending admin review.</p>
          <button onClick={() => window.location.reload()}>Start New Order</button>
        </div>
      )}
    </div>
  );
};

export default ValidationWorkflow;
```

## Conclusion

Integrating with the RadOrderPad validation engine requires careful state management and error handling. By following the patterns outlined in this guide, frontend developers can create a robust implementation that handles the complexities of the validation workflow while providing a smooth user experience.

Key points to remember:
1. The validation process is stateless - no orderId is needed or returned during validation
2. Multiple validation attempts should be handled by combining the original dictation with clarifications
3. Order records are only created during finalization
4. Robust error handling is essential for a good user experience