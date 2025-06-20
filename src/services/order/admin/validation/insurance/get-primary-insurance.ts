import { queryPhiDb } from '../../../../../config/db';
import { InsuranceData } from '../types';

/**
 * Get primary insurance data for validation
 * @param patientId Patient ID
 * @returns Promise with insurance data or null if not found
 */
export async function getPrimaryInsurance(patientId: number): Promise<InsuranceData | null> {
  const insuranceResult = await queryPhiDb(
    `SELECT i.id, i.insurer_name, i.policy_number
     FROM patient_insurance i
     WHERE i.patient_id = $1 AND i.is_primary = true`,
    [patientId]
  );
  
  if (insuranceResult.rows.length === 0) {
    return null;
  }
  
  return insuranceResult.rows[0];
}