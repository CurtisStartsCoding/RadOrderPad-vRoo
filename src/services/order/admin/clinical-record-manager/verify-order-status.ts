import { queryPhiDb } from '../../../../config/db';
import { OrderData } from '../types';

/**
 * Verify order exists and has status 'pending_admin'
 * @param orderId Order ID
 * @returns Promise with order data
 * @throws Error if order not found or not in pending_admin status
 */
export async function verifyOrderStatus(orderId: number): Promise<OrderData> {
  const orderResult = await queryPhiDb(
    `SELECT o.id, o.status, o.patient_id, o.referring_organization_id 
     FROM orders o
     WHERE o.id = $1`,
    [orderId]
  );
  
  if (orderResult.rows.length === 0) {
    throw new Error(`Order ${orderId} not found`);
  }
  
  const order = orderResult.rows[0];
  
  if (order.status !== 'pending_admin') {
    throw new Error(`Order ${orderId} is not in pending_admin status`);
  }
  
  return order;
}