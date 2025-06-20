"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInsuranceData = validateInsuranceData;
/**
 * Validate insurance data for required fields
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
function validateInsuranceData(insurance) {
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
//# sourceMappingURL=validate-insurance-data.js.map