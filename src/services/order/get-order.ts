import { queryMainDb, queryPhiDb } from '../../config/db';
import { Order } from '../../models';
import logger from '../../utils/logger';

/**
 * Get order details by ID
 */
export async function getOrderById(orderId: number, userId: number): Promise<Order> {
  try {
    // Get user information to determine organization
    const userResult = await queryMainDb(
      'SELECT organization_id FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = userResult.rows[0];
    
    // Get order details
    const orderResult = await queryPhiDb(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }
    
    const order = orderResult.rows[0] as Order;
    
    // Check authorization (user belongs to the referring or radiology organization)
    if (user.organization_id !== order.referring_organization_id && 
        user.organization_id !== order.radiology_organization_id) {
      throw new Error('Unauthorized: User does not have access to this order');
    }
    
    return order;
  } catch (error) {
    logger.error('Error getting order by ID:', {
      error,
      orderId,
      userId
    });
    throw error;
  }
}