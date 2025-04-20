"use strict";
/**
 * Functions for tracking validation attempts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logValidationAttempt = exports.getNextAttemptNumber = void 0;
// Import functions
const get_next_attempt_number_1 = require("./get-next-attempt-number");
Object.defineProperty(exports, "getNextAttemptNumber", { enumerable: true, get: function () { return get_next_attempt_number_1.getNextAttemptNumber; } });
const log_validation_attempt_1 = require("./log-validation-attempt");
Object.defineProperty(exports, "logValidationAttempt", { enumerable: true, get: function () { return log_validation_attempt_1.logValidationAttempt; } });
// Default export for backward compatibility
exports.default = {
    getNextAttemptNumber: get_next_attempt_number_1.getNextAttemptNumber,
    logValidationAttempt: log_validation_attempt_1.logValidationAttempt
};
//# sourceMappingURL=index.js.map