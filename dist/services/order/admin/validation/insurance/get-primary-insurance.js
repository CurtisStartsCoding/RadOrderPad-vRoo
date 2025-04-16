"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrimaryInsurance = getPrimaryInsurance;
const db_1 = require("../../../../../config/db");
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
//# sourceMappingURL=get-primary-insurance.js.map