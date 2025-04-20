import * as clinicalRecordManager from '../clinical-record-manager';
/**
 * Handle pasted supplemental documents
 * @param orderId Order ID
 * @param pastedText Pasted supplemental text
 * @param userId User ID
 * @returns Promise with result
 */
export async function handlePasteSupplemental(orderId, pastedText, userId) {
    try {
        // 1. Verify order exists and has status 'pending_admin'
        const order = await clinicalRecordManager.verifyOrderStatus(orderId);
        // 2. Save the raw pasted text to patient_clinical_records
        await clinicalRecordManager.saveSupplementalDocument(orderId, order.patient_id, pastedText, userId);
        return {
            success: true,
            orderId,
            message: 'Supplemental documents saved successfully'
        };
    }
    catch (error) {
        console.error('Error in handlePasteSupplemental:', error);
        throw error;
    }
}
export default handlePasteSupplemental;
//# sourceMappingURL=paste-supplemental.js.map