import { queryPhiDb } from '../../../../config/db';
import { InsuranceUpdateData } from '../types';

/**
 * Update insurance information for a patient
 * @param patientId Patient ID
 * @param insuranceData Insurance data
 * @returns Promise with insurance ID
 */
export async function updateInsuranceInfo(
  patientId: number,
  insuranceData: InsuranceUpdateData
): Promise<number> {
  // Check if patient already has primary insurance
  const existingInsuranceResult = await queryPhiDb(
    `SELECT id FROM patient_insurance 
     WHERE patient_id = $1 AND is_primary = true`,
    [patientId]
  );

  let insuranceId: number;

  if (existingInsuranceResult.rows.length > 0) {
    // Update existing insurance
    insuranceId = existingInsuranceResult.rows[0].id;
    
    await queryPhiDb(
      `UPDATE patient_insurance SET
       insurer_name = $1,
       policy_number = $2,
       group_number = $3,
       policy_holder_name = $4,
       policy_holder_relationship = $5,
       updated_at = NOW()
       WHERE id = $6`,
      [
        insuranceData.insurerName,
        insuranceData.policyNumber,
        insuranceData.groupNumber,
        insuranceData.policyHolderName,
        insuranceData.policyHolderRelationship,
        insuranceId
      ]
    );
  } else {
    // Create new insurance
    const newInsuranceResult = await queryPhiDb(
      `INSERT INTO patient_insurance
       (patient_id, insurer_name, policy_number, group_number, 
        policy_holder_name, policy_holder_relationship, is_primary, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
       RETURNING id`,
      [
        patientId,
        insuranceData.insurerName,
        insuranceData.policyNumber,
        insuranceData.groupNumber,
        insuranceData.policyHolderName,
        insuranceData.policyHolderRelationship
      ]
    );
    
    insuranceId = newInsuranceResult.rows[0].id;
  }

  return insuranceId;
}