"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControllerError = handleControllerError;
exports.checkAuthentication = checkAuthentication;
exports.validateLocationId = validateLocationId;
exports.validateUserId = validateUserId;
exports.validateUserAndLocationIds = validateUserAndLocationIds;
/**
 * Common error handling function
 * @param res Express response object
 * @param error Error object
 * @param message Error message
 */
function handleControllerError(res, error, message) {
    console.error(`Error in ${message}:`, error);
    res.status(500).json({ message, error: error.message });
}
/**
 * Check if user is authenticated
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if authentication check passed
 */
function checkAuthentication(req, res) {
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return false;
    }
    return true;
}
/**
 * Validate location ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if validation passed
 */
function validateLocationId(req, res) {
    const locationId = parseInt(req.params.locationId);
    if (isNaN(locationId)) {
        res.status(400).json({ message: 'Invalid location ID' });
        return false;
    }
    return true;
}
/**
 * Validate user ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if validation passed
 */
function validateUserId(req, res) {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ message: 'Invalid user ID' });
        return false;
    }
    return true;
}
/**
 * Validate both user ID and location ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns Boolean indicating if validation passed
 */
function validateUserAndLocationIds(req, res) {
    const userId = parseInt(req.params.userId);
    const locationId = parseInt(req.params.locationId);
    if (isNaN(userId) || isNaN(locationId)) {
        res.status(400).json({ message: 'Invalid user ID or location ID' });
        return false;
    }
    return true;
}
//# sourceMappingURL=types.js.map