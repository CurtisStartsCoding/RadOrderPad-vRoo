"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControllerError = handleControllerError;
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Handles controller errors and sends appropriate response
 * @param error The error that occurred
 * @param res Express response object
 * @param context Additional context for logging (e.g., function name)
 */
function handleControllerError(error, res, context) {
    logger_1.default.error(`Error in controller:`, {
        error,
        context
    });
    if (error instanceof Error) {
        // Handle specific error types based on error message
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        }
        else if (error.message.includes('Unauthorized')) {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
    else {
        // Handle unknown error types
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
}
//# sourceMappingURL=handle-controller-error.js.map