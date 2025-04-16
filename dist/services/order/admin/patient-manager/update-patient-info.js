"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientInfo = updatePatientInfo;
const db_1 = require("../../../../config/db");
const utils_1 = require("../utils");
/**
 * Update patient information
 * @param patientId Patient ID
 * @param patientData Patient data
 * @returns Promise with result
 */
async function updatePatientInfo(patientId, patientData) {
    // Map patientData fields to database columns
    const fieldMap = {
        firstName: 'first_name',
        lastName: 'last_name',
        middleName: 'middle_name',
        dateOfBirth: 'date_of_birth',
        gender: 'gender',
        addressLine1: 'address_line1',
        addressLine2: 'address_line2',
        city: 'city',
        state: 'state',
        zipCode: 'zip_code',
        phoneNumber: 'phone_number',
        email: 'email',
        mrn: 'mrn'
    };
    // Build the update query using the utility function
    const { query, values } = (0, utils_1.buildUpdateQuery)('patients', patientData, 'id', patientId, fieldMap, true, ['id']);
    const result = await (0, db_1.queryPhiDb)(query, values);
    return result.rows[0].id;
}
//# sourceMappingURL=update-patient-info.js.map