"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEmrSummary = saveEmrSummary;
const db_1 = require("../../../../config/db");
/**
 * Save EMR summary text as a clinical record
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param text EMR summary text
 * @param userId User ID
 * @returns Promise with result
 */
async function saveEmrSummary(orderId, patientId, text, userId) {
    await (0, db_1.queryPhiDb)(`INSERT INTO patient_clinical_records
     (patient_id, order_id, record_type, content, added_by_user_id)
     VALUES ($1, $2, $3, $4, $5)`, [patientId, orderId, 'emr_summary_paste', text, userId]);
}
//# sourceMappingURL=save-emr-summary.js.map