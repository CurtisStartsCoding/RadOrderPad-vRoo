"use strict";
/**
 * Response validation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateValidationStatus = exports.validateRequiredFields = void 0;
// Import functions
const validate_required_fields_1 = require("./validate-required-fields");
Object.defineProperty(exports, "validateRequiredFields", { enumerable: true, get: function () { return validate_required_fields_1.validateRequiredFields; } });
const validate_validation_status_1 = require("./validate-validation-status");
Object.defineProperty(exports, "validateValidationStatus", { enumerable: true, get: function () { return validate_validation_status_1.validateValidationStatus; } });
// Default export for backward compatibility
exports.default = {
    validateRequiredFields: validate_required_fields_1.validateRequiredFields,
    validateValidationStatus: validate_validation_status_1.validateValidationStatus
};
//# sourceMappingURL=index.js.map