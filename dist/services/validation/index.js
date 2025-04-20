/**
 * Validation service module
 *
 * This module provides functionality for validating medical orders
 * using LLM-based validation.
 */
// Export types
export * from './types';
// Export validation functions
export { runValidation } from './run-validation';
export { logValidationAttempt } from './logging';
export { logLLMUsage } from './llm-logging';
import { runValidation } from './run-validation';
/**
 * Service for handling validation-related operations
 */
export class ValidationService {
    /**
     * Run validation on the provided text and context
     */
    static async runValidation(text, context = {}, testMode = false) {
        return runValidation(text, context, { testMode });
    }
}
// Export ValidationService as default for backward compatibility
export default ValidationService;
//# sourceMappingURL=index.js.map