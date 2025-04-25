import { Response } from 'express';
import logger from '../../utils/logger';

/**
 * Error handling utilities for authentication controllers
 */

/**
 * Handle authentication errors
 * @param error Error object
 * @param res Express response object
 * @param operation Name of the operation (for logging)
 * @param errorMap Map of error messages to HTTP status codes
 * @param defaultMessage Default error message
 */
export function handleAuthError(
  error: unknown,
  res: Response,
  operation: string,
  errorMap: { [key: string]: number } = {},
  defaultMessage: string = 'An error occurred'
): void {
  logger.error(`${operation} error:`, { error, operation });
  
  if (error instanceof Error) {
    // Check if the error message is in the error map
    for (const [message, statusCode] of Object.entries(errorMap)) {
      if (error.message === message || error.message.includes(message)) {
        res.status(statusCode).json({ message: error.message });
        return;
      }
    }
  }
  
  // Default error response
  res.status(500).json({ message: defaultMessage });
}

/**
 * Error map for registration
 */
export const registrationErrorMap = {
  'Invalid registration key': 403,
  'Organization already exists': 409,
  'Email already in use': 409
};

/**
 * Error map for login
 */
export const loginErrorMap = {
  'Invalid email or password': 401,
  'User account is inactive': 401
};

export default {
  handleAuthError,
  registrationErrorMap,
  loginErrorMap
};