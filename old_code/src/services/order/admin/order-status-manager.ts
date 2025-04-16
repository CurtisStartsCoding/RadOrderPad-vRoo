import { getPhiDbClient } from '../../../config/db';
import { OrderStatus } from '../../../models';
import { SendToRadiologyResult } from './types';

/**
 * Update order status to pending_radiology
 * @param orderId Order ID
 * @param userId User ID
 * @returns Promise with result
 */
export async function updateOrderStatusToRadiology(
  orderId: number,
  userId: number
): Promise<void> {
  const client = await getPhiDbClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Update order status to 'pending_radiology'
    await client.query(
      `UPDATE orders
       SET status = $1, updated_at = NOW(), updated_by_user_id = $2
       WHERE id = $3`,
      [OrderStatus.PENDING_RADIOLOGY, userId, orderId]
    );
    
    // Log the event in order_history
    await client.query(
      `INSERT INTO order_history
       (order_id, user_id, event_type, previous_status, new_status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [orderId, userId, 'sent_to_radiology', OrderStatus.PENDING_ADMIN, OrderStatus.PENDING_RADIOLOGY]
    );
    
    // Commit transaction
    await client.query('COMMIT');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Release client back to pool
    client.release();
  }
}

/**
 * Validate patient data for required fields
 * @param patient Patient data
 * @returns Array of missing field names
 */
export function validatePatientData(patient: any): string[] {
  const missingPatientFields = [];
  
  if (!patient.address_line1) missingPatientFields.push('address');
  if (!patient.city) missingPatientFields.push('city');
  if (!patient.state) missingPatientFields.push('state');
  if (!patient.zip_code) missingPatientFields.push('zip code');
  if (!patient.phone_number) missingPatientFields.push('phone number');
  
  return missingPatientFields;
}

/**
 * Validate insurance data for required fields
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
export function validateInsuranceData(insurance: any): string[] {
  const missingFields = [];
  
  if (!insurance) {
    missingFields.push('primary insurance');
    return missingFields;
  }
  
  if (!insurance.insurer_name) missingFields.push('insurance provider name');
  if (!insurance.policy_number) missingFields.push('insurance policy number');
  
  return missingFields;
}

export default {
  updateOrderStatusToRadiology,
  validatePatientData,
  validateInsuranceData
};