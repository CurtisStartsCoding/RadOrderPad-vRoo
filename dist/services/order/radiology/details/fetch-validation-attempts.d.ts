import { ValidationAttempt } from './types';
/**
 * Fetch validation attempts for an order
 * @param orderId Order ID
 * @returns Array of validation attempts
 */
export declare function fetchValidationAttempts(orderId: number): Promise<ValidationAttempt[]>;
