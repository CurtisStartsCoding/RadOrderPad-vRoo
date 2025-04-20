"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientCreditsError = void 0;
/**
 * Custom error class for insufficient credits
 */
class InsufficientCreditsError extends Error {
    constructor(message = 'Insufficient credits available') {
        super(message);
        this.name = 'InsufficientCreditsError';
        Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
    }
}
exports.InsufficientCreditsError = InsufficientCreditsError;
//# sourceMappingURL=insufficient-credits.error.js.map