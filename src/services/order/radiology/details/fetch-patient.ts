import { queryPhiDb } from '../../../../config/db';

/**
 * Fetch patient data for an order
 * @param patientId Patient ID
 * @returns Patient data or null if not found
 */
export async function fetchPatient(patientId: number): Promise<any> {
  const patientResult = await queryPhiDb(
    `SELECT p.*
     FROM patients p
     WHERE p.id = $1`,
    [patientId]
  );
  
  return patientResult.rows.length > 0 ? patientResult.rows[0] : null;
}