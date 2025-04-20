/**
 * Service for handling order history operations
 */
class OrderHistoryService {
    /**
     * Log order history
     * @param client Database client
     * @param orderId Order ID
     * @param userId User ID
     * @param previousStatus Previous order status
     * @param newStatus New order status
     * @param eventType Event type
     */
    async logOrderHistory(client, orderId, userId, previousStatus, newStatus, eventType = 'status_change') {
        await client.query(`INSERT INTO order_history 
      (order_id, user_id, event_type, previous_status, new_status, created_at) 
      VALUES ($1, $2, $3, $4, $5, NOW())`, [
            orderId,
            userId,
            eventType,
            previousStatus,
            newStatus
        ]);
    }
}
export default new OrderHistoryService();
//# sourceMappingURL=order-history.service.js.map