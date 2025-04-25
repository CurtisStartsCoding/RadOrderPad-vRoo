"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = getOrderById;
const db_1 = require("../../config/db");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Get order details by ID
 */
async function getOrderById(orderId, userId) {
    try {
        // Get user information to determine organization
        const userResult = await (0, db_1.queryMainDb)('SELECT organization_id FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }
        const user = userResult.rows[0];
        // Get order details
        const orderResult = await (0, db_1.queryPhiDb)('SELECT * FROM orders WHERE id = $1', [orderId]);
        if (orderResult.rows.length === 0) {
            throw new Error('Order not found');
        }
        const order = orderResult.rows[0];
        // Check authorization (user belongs to the referring or radiology organization)
        if (user.organization_id !== order.referring_organization_id &&
            user.organization_id !== order.radiology_organization_id) {
            throw new Error('Unauthorized: User does not have access to this order');
        }
        return order;
    }
    catch (error) {
        logger_1.default.error('Error getting order by ID:', {
            error,
            orderId,
            userId
        });
        throw error;
    }
}
//# sourceMappingURL=get-order.js.map