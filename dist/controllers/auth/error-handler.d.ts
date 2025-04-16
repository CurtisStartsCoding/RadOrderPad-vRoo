import { Response } from 'express';
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
export declare function handleAuthError(error: unknown, res: Response, operation: string, errorMap?: {
    [key: string]: number;
}, defaultMessage?: string): void;
/**
 * Error map for registration
 */
export declare const registrationErrorMap: {
    'Invalid registration key': number;
    'Organization already exists': number;
    'Email already in use': number;
};
/**
 * Error map for login
 */
export declare const loginErrorMap: {
    'Invalid email or password': number;
    'User account is inactive': number;
};
declare const _default: {
    handleAuthError: typeof handleAuthError;
    registrationErrorMap: {
        'Invalid registration key': number;
        'Organization already exists': number;
        'Email already in use': number;
    };
    loginErrorMap: {
        'Invalid email or password': number;
        'User account is inactive': number;
    };
};
export default _default;
