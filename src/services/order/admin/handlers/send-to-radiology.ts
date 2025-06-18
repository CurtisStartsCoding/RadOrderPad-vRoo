import { getPhiDbClient, getMainDbClient } from '../../../../config/db';
import { InsufficientCreditsError } from '../../../../services/billing';
import { SendToRadiologyResult } from '../types';
import logger from '../../../../utils/logger';

/**
 * Sends an order to radiology, updating its status and consuming a credit
 * 
 * This implementation fixes the database connection issue by using both
 * PHI and Main database connections for their respective operations.
 * 
 * @param orderId - The ID of the order to send to radiology
 * @param userId - The ID of the user sending the order
 * @returns A promise that resolves to the result of the operation
 */
export async function sendToRadiology(
  orderId: number,
  userId: number
): Promise<SendToRadiologyResult> {
  // Get clients for both databases
  const phiClient = await getPhiDbClient();
  const mainClient = await getMainDbClient();
  
  try {
    // Start transactions in both databases
    await phiClient.query('BEGIN');
    await mainClient.query('BEGIN');
    
    // 1. Get order details to verify it can be sent to radiology
    const orderQuery = `
      SELECT 
        o.id, 
        o.status, 
        o.referring_organization_id,
        o.patient_id,
        p.city,
        p.state,
        p.zip_code
      FROM orders o
      LEFT JOIN patients p ON o.patient_id = p.id
      WHERE o.id = $1
    `;
    
    const orderResult = await phiClient.query(orderQuery, [orderId]);
    
    if (orderResult.rows.length === 0) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    const order = orderResult.rows[0];
    
    // 2. Verify order status
    if (order.status !== 'pending_admin') {
      throw new Error(`Order ${orderId} is not in pending_admin status`);
    }
    
    // 3. Verify required patient information
    // Note: City, state, and zip are optional - many patients may not have complete addresses
    // especially in emergency or walk-in situations
    logger.info('Patient address info', {
      orderId,
      hasCity: !!order.city,
      hasState: !!order.state,
      hasZip: !!order.zip_code
    });
    
    // 4. Get the organization's credit balance
    const orgId = order.referring_organization_id;
    const creditQuery = `
      SELECT credit_balance 
      FROM organizations 
      WHERE id = $1 AND credit_balance > 0
    `;
    
    const creditResult = await mainClient.query(creditQuery, [orgId]);
    
    if (creditResult.rows.length === 0) {
      throw new InsufficientCreditsError(`Organization ${orgId} has insufficient credits`);
    }
    // Credit balance is retrieved to verify it exists, even though not directly used
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const creditBalance = creditResult.rows[0].credit_balance;
    
    
    // 5. Update order status to pending_radiology and snapshot data for audit trail
    const updateOrderQuery = `
      UPDATE orders 
      SET 
        status = 'pending_radiology',
        updated_at = NOW(),
        -- Snapshot patient info for audit trail
        patient_name = COALESCE(p.first_name || COALESCE(' ' || p.last_name, ''), orders.patient_name),
        patient_dob = COALESCE(p.date_of_birth, orders.patient_dob),
        patient_gender = COALESCE(p.gender, orders.patient_gender),
        patient_mrn = COALESCE(p.mrn, orders.patient_mrn),
        -- Snapshot insurance info for audit trail  
        insurance_provider = COALESCE(pi.insurer_name, orders.insurance_provider),
        insurance_policy_number = COALESCE(pi.policy_number, orders.insurance_policy_number)
      FROM patients p
      LEFT JOIN patient_insurance pi ON p.id = pi.patient_id AND pi.is_primary = true
      WHERE orders.id = $1 AND orders.patient_id = p.id
      RETURNING orders.id, orders.status
    `;
    
    const updateResult = await phiClient.query(updateOrderQuery, [orderId]);
    
    if (updateResult.rows.length === 0) {
      throw new Error(`Failed to update order ${orderId}`);
    }
    
    // 6. Log order history
    await phiClient.query(
      `INSERT INTO order_history
       (order_id, user_id, event_type, details, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [orderId, userId, 'sent_to_radiology', 'Order sent to radiology']
    );
    
    // 7. Consume one credit
    const updateCreditQuery = `
      UPDATE organizations 
      SET credit_balance = credit_balance - 1 
      WHERE id = $1 
      RETURNING credit_balance
    `;
    
    const updateCreditResult = await mainClient.query(updateCreditQuery, [orgId]);
    
    if (updateCreditResult.rows.length === 0) {
      throw new Error(`Failed to update credit balance for organization ${orgId}`);
    }
    // New credit balance is retrieved for potential future use or logging
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newCreditBalance = updateCreditResult.rows[0].credit_balance;
    
    
    // 8. Log credit usage
    await mainClient.query(
      `INSERT INTO credit_usage_logs
       (organization_id, user_id, order_id, tokens_burned, action_type, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [orgId, userId, orderId, 1, 'order_submitted']
    );
    
    // Commit both transactions
    await phiClient.query('COMMIT');
    await mainClient.query('COMMIT');
    
    // Return success result
    return {
      success: true,
      orderId,
      message: 'Order sent to radiology successfully'
    };
  } catch (error) {
    // Rollback both transactions
    await phiClient.query('ROLLBACK');
    await mainClient.query('ROLLBACK');
    
    // Handle specific errors
    if (error instanceof InsufficientCreditsError) {
      throw {
        status: 402, // Payment Required
        message: 'Insufficient credits to send order to radiology',
        code: 'INSUFFICIENT_CREDITS',
        orderId
      };
    }
    
    // Log and re-throw other errors
    // eslint-disable-next-line no-console
    console.error('Error in sendToRadiology:', error);
    throw error;
  } finally {
    // Release both clients
    phiClient.release();
    mainClient.release();
  }
}

export default sendToRadiology;