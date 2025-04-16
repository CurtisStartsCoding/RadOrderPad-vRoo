"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOrderHistory = fetchOrderHistory;
const db_1 = require("../../../../config/db");
/**
 * Fetch order history
 * @param orderId Order ID
 * @returns Array of order history records
 */
async function fetchOrderHistory(orderId) {
    const orderHistoryResult = await (0, db_1.queryPhiDb)(`SELECT oh.*
     FROM order_history oh
     WHERE oh.order_id = $1
     ORDER BY oh.created_at DESC`, [orderId]);
    return orderHistoryResult.rows;
}
//# sourceMappingURL=fetch-order-history.js.map