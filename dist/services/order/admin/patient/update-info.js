"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientInfo = updatePatientInfo;
const db_1 = require("../../../../config/db");
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
    // Build update query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];
    let valueIndex = 1;
    for (const [key, value] of Object.entries(patientData)) {
        if (fieldMap[key] && value !== undefined) {
            updateFields.push(`${fieldMap[key]} = $${valueIndex}`);
            updateValues.push(value);
            valueIndex++;
        }
    }
    if (updateFields.length === 0) {
        throw new Error('No valid patient fields provided for update');
    }
    // Add updated_at field
    updateFields.push(`updated_at = NOW()`);
    const updateQuery = `
    UPDATE patients
    SET ${updateFields.join(', ')}
    WHERE id = $${valueIndex}
    RETURNING id
  `;
    const result = await (0, db_1.queryPhiDb)(updateQuery, [...updateValues, patientId]);
    return result.rows[0].id;
}
exports.default = updatePatientInfo;
//# sourceMappingURL=update-info.js.map