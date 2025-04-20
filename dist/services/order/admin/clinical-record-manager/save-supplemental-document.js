import { queryPhiDb } from '../../../../config/db';
/**
 * Save supplemental document text as a clinical record
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param text Supplemental document text
 * @param userId User ID
 * @returns Promise with result
 */
export async function saveSupplementalDocument(orderId, patientId, text, userId) {
    await queryPhiDb(`INSERT INTO patient_clinical_records
     (patient_id, order_id, record_type, content, added_by_user_id)
     VALUES ($1, $2, $3, $4, $5)`, [patientId, orderId, 'supplemental_docs_paste', text, userId]);
}
//# sourceMappingURL=save-supplemental-document.js.map