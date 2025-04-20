"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusToRadiology = updateOrderStatusToRadiology;
const db_1 = require("../../../../config/db");
const models_1 = require("../../../../models");
/**
 * Update order status to pending_radiology
 * @param orderId Order ID
 * @param userId User ID
 * @returns Promise with result
 */
async function updateOrderStatusToRadiology(orderId, userId) {
    const client = await (0, db_1.getPhiDbClient)();
    try {
        // Start transaction
        await client.query('BEGIN');
        // Update order status to 'pending_radiology'
        await client.query(`UPDATE orders
       SET status = $1, updated_at = NOW(), updated_by_user_id = $2
       WHERE id = $3`, [models_1.OrderStatus.PENDING_RADIOLOGY, userId, orderId]);
        // Log the event in order_history
        await client.query(`INSERT INTO order_history
       (order_id, user_id, event_type, previous_status, new_status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`, [orderId, userId, 'sent_to_radiology', models_1.OrderStatus.PENDING_ADMIN, models_1.OrderStatus.PENDING_RADIOLOGY]);
        // Commit transaction
        await client.query('COMMIT');
    }
    catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        // Release client back to pool
        client.release();
    }
}
//# sourceMappingURL=update-order-status.js.map