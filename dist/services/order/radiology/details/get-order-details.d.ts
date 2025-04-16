import { OrderDetails } from '../types';
/**
 * Get full details of an order
 * @param orderId Order ID
 * @param orgId Radiology organization ID
 * @returns Promise with order details
 */
export declare function getOrderDetails(orderId: number, orgId: number): Promise<OrderDetails>;
export default getOrderDetails;
