import { getPhiDbClient } from '../../../config/db';
import { OrderStatusUpdateResult } from './types';
import logger from '../../../utils/logger';

/**
 * Update order status
 * @param orderId Order ID
 * @param newStatus New status
 * @param userId User ID
 * @param orgId Radiology organization ID
 * @returns Promise with result
 */
export async function updateOrderStatus(
  orderId: number, 
  newStatus: string, 
  userId: number, 
  orgId: number
): Promise<OrderStatusUpdateResult> {
  // Get a client for transaction
  const client = await getPhiDbClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // 1. Verify order exists and belongs to the radiology group
    const orderResult = await client.query(
      `SELECT o.id, o.status, o.radiology_organization_id
       FROM orders o
       WHERE o.id = $1`,
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    const order = orderResult.rows[0];
    
    if (order.radiology_organization_id !== orgId) {
      throw new Error(`Unauthorized: Order ${orderId} does not belong to your organization`);
    }
    
    // 2. Update the order status
    const previousStatus = order.status;
    
    await client.query(
      `UPDATE orders
       SET status = $1, updated_at = NOW(), updated_by_user_id = $2
       WHERE id = $3`,
      [newStatus, userId, orderId]
    );
    
    // 3. Log the event in order_history
    await client.query(
      `INSERT INTO order_history
       (order_id, user_id, event_type, previous_status, new_status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [orderId, userId, `status_updated_to_${newStatus}`, previousStatus, newStatus]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    // TODO: Implement notification to referring group (future enhancement)
    
    return {
      success: true,
      orderId,
      previousStatus,
      newStatus,
      message: `Order status updated to ${newStatus}`
    };
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    logger.error('Error in updateOrderStatus:', {
      error,
      orderId,
      newStatus,
      userId,
      orgId
    });
    throw error;
  } finally {
    // Release client back to pool
    client.release();
  }
}

export default updateOrderStatus;