"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPatient = fetchPatient;
const db_1 = require("../../../../config/db");
/**
 * Fetch patient data for an order
 * @param patientId Patient ID
 * @returns Patient data or null if not found
 */
async function fetchPatient(patientId) {
    const patientResult = await (0, db_1.queryPhiDb)(`SELECT p.*
     FROM patients p
     WHERE p.id = $1`, [patientId]);
    return patientResult.rows.length > 0 ? patientResult.rows[0] : null;
}
//# sourceMappingURL=fetch-patient.js.map