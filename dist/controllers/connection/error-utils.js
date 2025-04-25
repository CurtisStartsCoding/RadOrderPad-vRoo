"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnectionError = handleConnectionError;
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Handle errors in connection controllers
 * @param error The error object
 * @param res Express response object
 * @param controllerName The name of the controller for logging purposes
 */
function handleConnectionError(error, res, controllerName) {
    logger_1.default.error(`Error in ${controllerName} controller:`, {
        error,
        controllerName
    });
    if (error instanceof Error) {
        // Handle not found or not authorized errors
        if (error.message.includes('not found') || error.message.includes('not authorized')) {
            res.status(404).json({ message: error.message });
            return;
        }
        // Handle other specific error types if needed
        // Default error response
        res.status(500).json({
            message: `Failed to ${controllerName.toLowerCase()}`,
            error: error.message
        });
    }
    else {
        // Handle unknown errors
        res.status(500).json({
            message: `Failed to ${controllerName.toLowerCase()}`,
            error: 'An unknown error occurred'
        });
    }
}
//# sourceMappingURL=error-utils.js.map