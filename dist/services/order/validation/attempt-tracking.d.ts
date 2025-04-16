import { ValidationResult } from '../../../models';
/**
 * Get the next attempt number for an order
 *
 * @param orderId - The ID of the order
 * @returns The next attempt number
 */
export declare function getNextAttemptNumber(orderId: number): Promise<number>;
/**
 * Log a validation attempt
 *
 * @param orderId - The ID of the order
 * @param attemptNumber - The attempt number
 * @param dictationText - The dictation text used for validation
 * @param validationResult - The result of the validation
 * @param userId - The ID of the user who initiated the validation
 */
export declare function logValidationAttempt(orderId: number, attemptNumber: number, dictationText: string, validationResult: ValidationResult, userId: number): Promise<void>;
