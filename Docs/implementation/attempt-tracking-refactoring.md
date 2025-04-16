# Validation Attempt Tracking Refactoring

**Date:** 2025-04-14
**Author:** Roo
**Status:** Completed

## Overview

This document details the refactoring of the `services/order/validation/attempt-tracking.ts` file, which was identified as having multiple functions (2 functions in 60 lines). The refactoring follows the extreme refactoring principles established for the project.

## Original Structure

The original `attempt-tracking.ts` file contained:

1. Two functions:
   - `getNextAttemptNumber`: Gets the next attempt number for an order
   - `logValidationAttempt`: Logs a validation attempt

2. No clear separation of concerns between different tracking functionalities

## New Structure

The refactored code is organized into a directory structure that separates concerns:

```
src/services/order/validation/attempt-tracking/
├── get-next-attempt-number.ts    (18 lines)
├── log-validation-attempt.ts     (35 lines)
└── index.ts                      (15 lines)
```

## Implementation Details

### Get Next Attempt Number (get-next-attempt-number.ts)

```typescript
import { queryPhiDb } from '../../../../config/db';

/**
 * Get the next attempt number for an order
 * 
 * @param orderId - The ID of the order
 * @returns The next attempt number
 */
export async function getNextAttemptNumber(orderId: number): Promise<number> {
  const attemptResult = await queryPhiDb(
    'SELECT MAX(attempt_number) as max_attempt FROM validation_attempts WHERE order_id = $1',
    [orderId]
  );
  
  if (attemptResult.rows.length > 0 && attemptResult.rows[0].max_attempt) {
    return attemptResult.rows[0].max_attempt + 1;
  }
  
  return 1;
}
```

### Log Validation Attempt (log-validation-attempt.ts)

```typescript
import { queryPhiDb } from '../../../../config/db';
import { ValidationResult } from '../../../../models';

/**
 * Log a validation attempt
 * 
 * @param orderId - The ID of the order
 * @param attemptNumber - The attempt number
 * @param dictationText - The dictation text used for validation
 * @param validationResult - The result of the validation
 * @param userId - The ID of the user who initiated the validation
 */
export async function logValidationAttempt(
  orderId: number,
  attemptNumber: number,
  dictationText: string,
  validationResult: ValidationResult,
  userId: number
): Promise<void> {
  await queryPhiDb(
    `INSERT INTO validation_attempts 
    (order_id, attempt_number, validation_input_text, validation_outcome, 
    generated_icd10_codes, generated_cpt_codes, generated_feedback_text, 
    generated_compliance_score, user_id, created_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
    [
      orderId,
      attemptNumber,
      dictationText,
      validationResult.validationStatus,
      JSON.stringify(validationResult.suggestedICD10Codes),
      JSON.stringify(validationResult.suggestedCPTCodes),
      validationResult.feedback,
      validationResult.complianceScore,
      userId
    ]
  );
}
```

### Main Entry Point (index.ts)

```typescript
/**
 * Functions for tracking validation attempts
 */

// Import functions
import { getNextAttemptNumber } from './get-next-attempt-number';
import { logValidationAttempt } from './log-validation-attempt';

// Re-export functions
export { getNextAttemptNumber };
export { logValidationAttempt };

// Default export for backward compatibility
export default {
  getNextAttemptNumber,
  logValidationAttempt
};
```

## Benefits

1. **Improved Maintainability**: Each file has a single responsibility, making it easier to understand and modify.
2. **Better Organization**: Related functionality is grouped together, making it easier to navigate the codebase.
3. **Enhanced Testability**: Smaller, focused modules are easier to test in isolation.
4. **Reduced Cognitive Load**: Developers only need to understand a small part of the codebase at a time.
5. **Backward Compatibility**: The original API is preserved through the index.ts file.

## Conclusion

The refactoring of the Validation Attempt Tracking module has successfully transformed a file with multiple functions into a set of smaller, more focused files. This improves maintainability while preserving the original functionality and API.