"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatientData = validatePatientData;
/**
 * Validate patient data for required fields
 * @param patient Patient data
 * @returns Array of missing field names
 */
function validatePatientData(patient) {
    const missingPatientFields = [];
    if (!patient.address_line1)
        missingPatientFields.push('address');
    if (!patient.city)
        missingPatientFields.push('city');
    if (!patient.state)
        missingPatientFields.push('state');
    if (!patient.zip_code)
        missingPatientFields.push('zip code');
    if (!patient.phone_number)
        missingPatientFields.push('phone number');
    return missingPatientFields;
}
//# sourceMappingURL=validate-patient-data.js.map