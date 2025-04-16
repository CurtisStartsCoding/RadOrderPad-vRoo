"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEmrSummary = saveEmrSummary;
exports.saveSupplementalDocument = saveSupplementalDocument;
exports.verifyOrderStatus = verifyOrderStatus;
const db_1 = require("../../../config/db");
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
/**
 * Save supplemental document text as a clinical record
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param text Supplemental document text
 * @param userId User ID
 * @returns Promise with result
 */
async function saveSupplementalDocument(orderId, patientId, text, userId) {
    await (0, db_1.queryPhiDb)(`INSERT INTO patient_clinical_records
     (patient_id, order_id, record_type, content, added_by_user_id)
     VALUES ($1, $2, $3, $4, $5)`, [patientId, orderId, 'supplemental_docs_paste', text, userId]);
}
/**
 * Verify order exists and has status 'pending_admin'
 * @param orderId Order ID
 * @returns Promise with order data
 * @throws Error if order not found or not in pending_admin status
 */
async function verifyOrderStatus(orderId) {
    const orderResult = await (0, db_1.queryPhiDb)(`SELECT o.id, o.status, o.patient_id, o.referring_organization_id 
     FROM orders o
     WHERE o.id = $1`, [orderId]);
    if (orderResult.rows.length === 0) {
        throw new Error(`Order ${orderId} not found`);
    }
    const order = orderResult.rows[0];
    if (order.status !== 'pending_admin') {
        throw new Error(`Order ${orderId} is not in pending_admin status`);
    }
    return order;
}
exports.default = {
    saveEmrSummary,
    saveSupplementalDocument,
    verifyOrderStatus
};
//# sourceMappingURL=clinical-record-manager.js.map