import { OrderStatus } from '../../../../models';
/**
 * Update the order with final data
 *
 * @param client Database client for transaction
 * @param orderId The ID of the order to update
 * @param patientId The ID of the patient
 * @param payload The finalize order payload
 * @param userId The ID of the user performing the update
 */
export async function updateOrderWithFinalData(client, orderId, patientId, payload, userId) {
    await client.query(`UPDATE orders SET
    patient_id = $1,
    status = $2,
    clinical_indication = $3,
    final_cpt_code = $4,
    final_cpt_code_description = $5,
    final_icd10_codes = $6,
    final_icd10_code_descriptions = $7,
    final_validation_status = $8,
    final_compliance_score = $9,
    overridden = $10,
    override_justification = $11,
    is_urgent_override = $12,
    signed_by_user_id = $13,
    signature_date = NOW(),
    validated_at = NOW(),
    updated_at = NOW(),
    updated_by_user_id = $14
    WHERE id = $15`, [
        patientId,
        OrderStatus.PENDING_ADMIN,
        payload.clinicalIndication,
        payload.finalCPTCode,
        payload.finalCPTCodeDescription,
        payload.finalICD10Codes,
        payload.finalICD10CodeDescriptions,
        payload.finalValidationStatus,
        payload.finalComplianceScore,
        payload.overridden || false,
        payload.overrideJustification || null,
        payload.isUrgentOverride || false,
        userId, // Signed by the current user
        userId, // Updated by the current user
        orderId
    ]);
}
//# sourceMappingURL=update-order-with-final-data.js.map