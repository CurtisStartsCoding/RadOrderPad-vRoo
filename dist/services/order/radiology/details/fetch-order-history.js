import { queryPhiDb } from '../../../../config/db';
/**
 * Fetch order history
 * @param orderId Order ID
 * @returns Array of order history records
 */
export async function fetchOrderHistory(orderId) {
    const orderHistoryResult = await queryPhiDb(`SELECT oh.*
     FROM order_history oh
     WHERE oh.order_id = $1
     ORDER BY oh.created_at DESC`, [orderId]);
    return orderHistoryResult.rows;
}
//# sourceMappingURL=fetch-order-history.js.map