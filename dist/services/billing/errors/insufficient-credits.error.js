/**
 * Custom error class for insufficient credits
 */
export class InsufficientCreditsError extends Error {
    constructor(message = 'Insufficient credits available') {
        super(message);
        this.name = 'InsufficientCreditsError';
        Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
    }
}
//# sourceMappingURL=insufficient-credits.error.js.map