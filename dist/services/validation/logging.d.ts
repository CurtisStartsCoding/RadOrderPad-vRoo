/**
 * Validation attempt logging functionality
 */
import { ValidationResult } from '../../models';
import { LLMResponse } from '../../utils/llm';
/**
 * Log validation attempt to the PHI database
 */
export declare function logValidationAttempt(originalText: string, validationResult: ValidationResult, llmResponse: LLMResponse, orderId?: number, userId?: number): Promise<void>;
