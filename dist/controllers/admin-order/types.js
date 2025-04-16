"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControllerError = handleControllerError;
/**
 * Common error handler function for admin order controllers
 */
function handleControllerError(error, res, controllerName) {
    console.error(`Error in ${controllerName} controller:`, error);
    if (error instanceof Error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        }
        else if (error.message.includes('Unauthorized')) {
            res.status(403).json({ message: error.message });
        }
        else if (error.message.includes('missing')) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
    else {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
}
//# sourceMappingURL=types.js.map