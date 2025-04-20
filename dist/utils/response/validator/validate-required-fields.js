"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequiredFields = validateRequiredFields;
/**
 * Validate that all required fields are present
 */
function validateRequiredFields(response) {
    const requiredFields = [
        'validationStatus',
        'complianceScore',
        'feedback',
        'suggestedICD10Codes',
        'suggestedCPTCodes'
    ];
    const missingFields = requiredFields.filter(field => !response[field]);
    if (missingFields.length > 0) {
        throw new Error(`LLM response missing required fields: ${missingFields.join(', ')}`);
    }
}
//# sourceMappingURL=validate-required-fields.js.map