import { queryPhiDb } from '../../../../config/db';
import { Insurance } from './types';

/**
 * Fetch insurance information for a patient
 * @param patientId Patient ID
 * @returns Array of insurance records
 */
export async function fetchInsurance(patientId: number): Promise<Insurance[]> {
  const insuranceResult = await queryPhiDb(
    `SELECT i.*
     FROM patient_insurance i
     WHERE i.patient_id = $1
     ORDER BY i.is_primary DESC`,
    [patientId]
  );
  
  return insuranceResult.rows;
}