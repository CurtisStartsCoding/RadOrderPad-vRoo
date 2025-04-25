import { Order } from './types';
/**
 * Fetch order data from the database
 * @param orderId Order ID
 * @param orgId Radiology organization ID
 * @returns Order data
 * @throws Error if order not found or not authorized
 */
export declare function fetchOrder(orderId: number, orgId: number): Promise<Order>;
