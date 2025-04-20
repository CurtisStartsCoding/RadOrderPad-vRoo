"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchInsurance = fetchInsurance;
const db_1 = require("../../../../config/db");
/**
 * Fetch insurance information for a patient
 * @param patientId Patient ID
 * @returns Array of insurance records
 */
async function fetchInsurance(patientId) {
    const insuranceResult = await (0, db_1.queryPhiDb)(`SELECT i.*
     FROM patient_insurance i
     WHERE i.patient_id = $1
     ORDER BY i.is_primary DESC`, [patientId]);
    return insuranceResult.rows;
}
//# sourceMappingURL=fetch-insurance.js.map