import { queryPhiDb } from '../../../../config/db';
import { Order } from './types';

/**
 * Fetch order data from the database
 * @param orderId Order ID
 * @param orgId Radiology organization ID
 * @returns Order data
 * @throws Error if order not found or not authorized
 */
export async function fetchOrder(orderId: number, orgId: number): Promise<Order> {
  const orderResult = await queryPhiDb(
    `SELECT o.*
     FROM orders o
     WHERE o.id = $1 AND o.radiology_organization_id = $2`,
    [orderId, orgId]
  );
  
  if (orderResult.rows.length === 0) {
    throw new Error(`Order ${orderId} not found or not authorized`);
  }
  
  return orderResult.rows[0];
}