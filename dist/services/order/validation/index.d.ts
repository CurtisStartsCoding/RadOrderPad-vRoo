/**
 * Validation request handling module
 *
 * This module provides functionality for handling validation requests,
 * creating draft orders, and tracking validation attempts.
 */
export * from './types';
export { createDraftOrder } from './draft-order';
export { getNextAttemptNumber, logValidationAttempt } from './attempt-tracking';
export { handleValidationRequest } from './handler';
import { handleValidationRequest } from './handler';
export default handleValidationRequest;
