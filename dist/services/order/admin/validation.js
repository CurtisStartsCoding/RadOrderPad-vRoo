"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientForValidation = getPatientForValidation;
exports.getPrimaryInsurance = getPrimaryInsurance;
exports.validatePatientFields = validatePatientFields;
exports.validateInsuranceFields = validateInsuranceFields;
const db_1 = require("../../../config/db");
/**
 * Get patient data for validation
 * @param patientId Patient ID
 * @returns Promise with patient data
 */
async function getPatientForValidation(patientId) {
    const patientResult = await (0, db_1.queryPhiDb)(`SELECT p.id, p.first_name, p.last_name, p.date_of_birth, p.gender, 
            p.address_line1, p.city, p.state, p.zip_code, p.phone_number
     FROM patients p
     WHERE p.id = $1`, [patientId]);
    if (patientResult.rows.length === 0) {
        throw new Error(`Patient not found with ID ${patientId}`);
    }
    return patientResult.rows[0];
}
/**
 * Get primary insurance data for validation
 * @param patientId Patient ID
 * @returns Promise with insurance data or null if not found
 */
async function getPrimaryInsurance(patientId) {
    const insuranceResult = await (0, db_1.queryPhiDb)(`SELECT i.id, i.insurer_name, i.policy_number
     FROM patient_insurance i
     WHERE i.patient_id = $1 AND i.is_primary = true`, [patientId]);
    if (insuranceResult.rows.length === 0) {
        return null;
    }
    return insuranceResult.rows[0];
}
/**
 * Validate patient has required information for sending to radiology
 * @param patient Patient data
 * @returns Array of missing field names
 */
function validatePatientFields(patient) {
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
exports.default = {
    getPatientForValidation,
    getPrimaryInsurance,
    validatePatientFields,
    validateInsuranceFields
};
//# sourceMappingURL=validation.js.map