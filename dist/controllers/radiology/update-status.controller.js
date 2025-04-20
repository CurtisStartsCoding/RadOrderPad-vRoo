"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = updateOrderStatus;
const radiology_1 = __importDefault(require("../../services/order/radiology"));
/**
 * Update order status
 * @route POST /api/radiology/orders/:orderId/update-status
 */
async function updateOrderStatus(req, res) {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }
        const { newStatus } = req.body;
        if (!newStatus) {
            res.status(400).json({ message: 'New status is required' });
            return;
        }
        // Validate status
        const validStatuses = ['scheduled', 'completed', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            res.status(400).json({ message: `Invalid status. Supported statuses: ${validStatuses.join(', ')}` });
            return;
        }
        // Get user information from the JWT token
        const userId = req.user?.userId;
        const orgId = req.user?.orgId;
        if (!userId || !orgId) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }
        // Call the service to update the order status
        const result = await radiology_1.default.updateOrderStatus(orderId, newStatus, userId, orgId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error in updateOrderStatus controller:', error);
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            }
            else if (error.message.includes('Unauthorized')) {
                res.status(403).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: error.message });
            }
        }
        else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
}
exports.default = updateOrderStatus;
//# sourceMappingURL=update-status.controller.js.map