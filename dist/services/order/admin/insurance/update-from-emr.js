import { queryPhiDb } from '../../../../config/db';
/**
 * Update insurance information from EMR data
 * @param patientId Patient ID
 * @param insuranceInfo Parsed insurance information from EMR
 * @returns Promise with insurance ID
 */
export async function updateInsuranceFromEmr(patientId, insuranceInfo) {
    // Check if patient already has primary insurance
    const existingInsuranceResult = await queryPhiDb(`SELECT id FROM patient_insurance 
     WHERE patient_id = $1 AND is_primary = true`, [patientId]);
    let insuranceId;
    if (existingInsuranceResult.rows.length > 0) {
        // Update existing insurance
        insuranceId = existingInsuranceResult.rows[0].id;
        await queryPhiDb(`UPDATE patient_insurance SET
       insurer_name = COALESCE($1, insurer_name),
       policy_number = COALESCE($2, policy_number),
       group_number = COALESCE($3, group_number),
       policy_holder_name = COALESCE($4, policy_holder_name),
       updated_at = NOW()
       WHERE id = $5`, [
            insuranceInfo.insurerName || null,
            insuranceInfo.policyNumber || null,
            insuranceInfo.groupNumber || null,
            insuranceInfo.policyHolderName || null,
            insuranceId
        ]);
    }
    else {
        // Create new insurance
        const newInsuranceResult = await queryPhiDb(`INSERT INTO patient_insurance
       (patient_id, insurer_name, policy_number, group_number, 
        policy_holder_name, is_primary, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
       RETURNING id`, [
            patientId,
            insuranceInfo.insurerName || null,
            insuranceInfo.policyNumber || null,
            insuranceInfo.groupNumber || null,
            insuranceInfo.policyHolderName || null
        ]);
        insuranceId = newInsuranceResult.rows[0].id;
    }
    return insuranceId;
}
//# sourceMappingURL=update-from-emr.js.map