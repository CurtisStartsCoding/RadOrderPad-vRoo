"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginErrorMap = exports.registrationErrorMap = void 0;
exports.handleAuthError = handleAuthError;
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
function handleAuthError(error, res, operation, errorMap = {}, defaultMessage = 'An error occurred') {
    console.error(`${operation} error:`, error);
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
exports.registrationErrorMap = {
    'Invalid registration key': 403,
    'Organization already exists': 409,
    'Email already in use': 409
};
/**
 * Error map for login
 */
exports.loginErrorMap = {
    'Invalid email or password': 401,
    'User account is inactive': 401
};
exports.default = {
    handleAuthError,
    registrationErrorMap: exports.registrationErrorMap,
    loginErrorMap: exports.loginErrorMap
};
//# sourceMappingURL=error-handler.js.map