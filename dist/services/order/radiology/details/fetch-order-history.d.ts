import { OrderHistoryEntry } from './types';
/**
 * Fetch order history
 * @param orderId Order ID
 * @returns Array of order history records
 */
export declare function fetchOrderHistory(orderId: number): Promise<OrderHistoryEntry[]>;
