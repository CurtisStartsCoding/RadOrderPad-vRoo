import { OrderStatusUpdateResult } from './types';
/**
 * Update order status
 * @param orderId Order ID
 * @param newStatus New status
 * @param userId User ID
 * @param orgId Radiology organization ID
 * @returns Promise with result
 */
export declare function updateOrderStatus(orderId: number, newStatus: string, userId: number, orgId: number): Promise<OrderStatusUpdateResult>;
export default updateOrderStatus;
