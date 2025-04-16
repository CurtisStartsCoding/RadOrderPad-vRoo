import { queryPhiDb } from '../../../../config/db';

/**
 * Fetch validation attempts for an order
 * @param orderId Order ID
 * @returns Array of validation attempts
 */
export async function fetchValidationAttempts(orderId: number): Promise<any[]> {
  const validationAttemptsResult = await queryPhiDb(
    `SELECT va.id, va.attempt_number, va.validation_outcome, va.generated_compliance_score,
            va.created_at
     FROM validation_attempts va
     WHERE va.order_id = $1
     ORDER BY va.attempt_number ASC`,
    [orderId]
  );
  
  return validationAttemptsResult.rows;
}