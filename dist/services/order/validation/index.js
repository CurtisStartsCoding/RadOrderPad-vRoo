/**
 * Validation request handling module
 *
 * This module provides functionality for handling validation requests,
 * creating draft orders, and tracking validation attempts.
 */
// Export types
export * from './types';
// Export draft order functionality
export { createDraftOrder } from './draft-order';
// Export attempt tracking functionality
export { getNextAttemptNumber, logValidationAttempt } from './attempt-tracking';
// Export main handler
export { handleValidationRequest } from './handler';
// For backward compatibility, re-export handleValidationRequest as default
import { handleValidationRequest } from './handler';
export default handleValidationRequest;
//# sourceMappingURL=index.js.map