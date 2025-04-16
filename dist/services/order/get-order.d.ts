import { Order } from '../../models';
/**
 * Get order details by ID
 */
export declare function getOrderById(orderId: number, userId: number): Promise<Order>;
