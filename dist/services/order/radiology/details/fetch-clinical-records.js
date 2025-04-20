"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchClinicalRecords = fetchClinicalRecords;
const db_1 = require("../../../../config/db");
/**
 * Fetch clinical records for an order
 * @param orderId Order ID
 * @returns Array of clinical records
 */
async function fetchClinicalRecords(orderId) {
    const clinicalRecordsResult = await (0, db_1.queryPhiDb)(`SELECT cr.*
     FROM patient_clinical_records cr
     WHERE cr.order_id = $1
     ORDER BY cr.added_at DESC`, [orderId]);
    return clinicalRecordsResult.rows;
}
//# sourceMappingURL=fetch-clinical-records.js.map