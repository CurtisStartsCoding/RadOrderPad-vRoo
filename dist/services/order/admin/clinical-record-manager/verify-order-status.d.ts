import { OrderData } from '../types';
/**
 * Verify order exists and has status 'pending_admin'
 * @param orderId Order ID
 * @returns Promise with order data
 * @throws Error if order not found or not in pending_admin status
 */
export declare function verifyOrderStatus(orderId: number): Promise<OrderData>;
