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
//# sourceMappingURL=index.js.map