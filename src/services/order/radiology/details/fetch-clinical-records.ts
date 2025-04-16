import { queryPhiDb } from '../../../../config/db';

/**
 * Fetch clinical records for an order
 * @param orderId Order ID
 * @returns Array of clinical records
 */
export async function fetchClinicalRecords(orderId: number): Promise<any[]> {
  const clinicalRecordsResult = await queryPhiDb(
    `SELECT cr.*
     FROM patient_clinical_records cr
     WHERE cr.order_id = $1
     ORDER BY cr.added_at DESC`,
    [orderId]
  );
  
  return clinicalRecordsResult.rows;
}