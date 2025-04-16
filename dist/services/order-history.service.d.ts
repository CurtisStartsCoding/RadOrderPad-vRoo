import { PoolClient } from 'pg';
/**
 * Service for handling order history operations
 */
declare class OrderHistoryService {
    /**
     * Log order history
     * @param client Database client
     * @param orderId Order ID
     * @param userId User ID
     * @param previousStatus Previous order status
     * @param newStatus New order status
     * @param eventType Event type
     */
    logOrderHistory(client: PoolClient, orderId: number, userId: number, previousStatus: string, newStatus: string, eventType?: string): Promise<void>;
}
declare const _default: OrderHistoryService;
export default _default;
