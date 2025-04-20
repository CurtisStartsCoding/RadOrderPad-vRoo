"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateValidationStatus = validateValidationStatus;
const models_1 = require("../../../models");
/**
 * Validate that the validation status is a valid enum value
 */
function validateValidationStatus(status) {
    // Convert to lowercase for case-insensitive comparison
    const normalizedStatus = status.toLowerCase();
    // Map of possible status values to enum values
    const statusMap = {
        'appropriate': models_1.ValidationStatus.APPROPRIATE,
        'inappropriate': models_1.ValidationStatus.INAPPROPRIATE,
        'needs_clarification': models_1.ValidationStatus.NEEDS_CLARIFICATION,
        'needs clarification': models_1.ValidationStatus.NEEDS_CLARIFICATION,
        'override': models_1.ValidationStatus.OVERRIDE
    };
    // Check if the status is valid
    if (!statusMap[normalizedStatus]) {
        throw new Error(`Invalid validationStatus: ${status}`);
    }
}
//# sourceMappingURL=validate-validation-status.js.map