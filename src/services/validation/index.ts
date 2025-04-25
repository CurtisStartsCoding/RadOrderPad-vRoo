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

// Create ValidationService class for backward compatibility
import { ValidationResult } from '../../models';
import { ValidationContext } from './types';
import { runValidation } from './run-validation';

/**
 * Service for handling validation-related operations
 */
export class ValidationService {
  /**
   * Run validation on the provided text and context
   */
  static async runValidation(
    text: string, 
    context: ValidationContext = {}, 
    testMode: boolean = false
  ): Promise<ValidationResult> {
    return runValidation(text, context, { testMode });
  }
}

// Export ValidationService as default for backward compatibility
export default ValidationService;