import { queryPhiDb } from '../../../../config/db';
import { OrderHistoryEntry } from './types';

/**
 * Fetch order history
 * @param orderId Order ID
 * @returns Array of order history records
 */
export async function fetchOrderHistory(orderId: number): Promise<OrderHistoryEntry[]> {
  const orderHistoryResult = await queryPhiDb(
    `SELECT oh.*
     FROM order_history oh
     WHERE oh.order_id = $1
     ORDER BY oh.created_at DESC`,
    [orderId]
  );
  
  return orderHistoryResult.rows;
}