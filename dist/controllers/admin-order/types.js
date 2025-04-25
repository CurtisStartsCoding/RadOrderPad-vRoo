"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControllerError = handleControllerError;
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Common error handler function for admin order controllers
 */
function handleControllerError(error, res, controllerName) {
    logger_1.default.error(`Error in admin order controller:`, {
        error,
        controllerName
    });
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