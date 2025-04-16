"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientFromEmr = updatePatientFromEmr;
const db_1 = require("../../../../config/db");
const utils_1 = require("../utils");
/**
 * Update patient information from parsed EMR data
 * @param patientId Patient ID
 * @param parsedPatientInfo Parsed patient information
 * @returns Promise with result
 */
async function updatePatientFromEmr(patientId, parsedPatientInfo) {
    if (!parsedPatientInfo || Object.keys(parsedPatientInfo).length === 0) {
        return;
    }
    // Map EMR fields to database columns
    const fieldMap = {
        address: 'address_line1',
        city: 'city',
        state: 'state',
        zipCode: 'zip_code',
        phone: 'phone_number',
        email: 'email'
    };
    // Build the update query using the utility function
    const { query, values } = (0, utils_1.buildUpdateQuery)('patients', parsedPatientInfo, 'id', patientId, fieldMap, true, []);
    // Only execute the query if there are fields to update
    if (values.length > 1) { // values includes patientId, so length > 1 means we have fields to update
        await (0, db_1.queryPhiDb)(query, values);
    }
}
//# sourceMappingURL=update-patient-from-emr.js.map