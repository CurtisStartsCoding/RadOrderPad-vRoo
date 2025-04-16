/**
 * Validation service module
 *
 * This module provides functionality for validating medical orders
 * using LLM-based validation.
 */
export * from './types';
export { runValidation } from './run-validation';
export { logValidationAttempt } from './logging';
export { logLLMUsage } from './llm-logging';
import { ValidationResult } from '../../models';
import { ValidationContext } from './types';
/**
 * Service for handling validation-related operations
 */
export declare class ValidationService {
    /**
     * Run validation on the provided text and context
     */
    static runValidation(text: string, context?: ValidationContext, testMode?: boolean): Promise<ValidationResult>;
}
export default ValidationService;
