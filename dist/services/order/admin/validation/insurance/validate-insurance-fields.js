"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInsuranceFields = validateInsuranceFields;
/**
 * Validate insurance has required information for sending to radiology
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
function validateInsuranceFields(insurance) {
    const missingFields = [];
    if (!insurance) {
        missingFields.push('primary insurance');
        return missingFields;
    }
    if (!insurance.insurer_name)
        missingFields.push('insurance provider name');
    if (!insurance.policy_number)
        missingFields.push('insurance policy number');
    return missingFields;
}
//# sourceMappingURL=validate-insurance-fields.js.map