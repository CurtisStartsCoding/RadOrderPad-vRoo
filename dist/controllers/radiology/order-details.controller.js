"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetails = getOrderDetails;
const radiology_1 = __importDefault(require("../../services/order/radiology"));
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Get full details of an order
 * @route GET /api/radiology/orders/:orderId
 */
async function getOrderDetails(req, res) {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }
        // Get user information from the JWT token
        const orgId = req.user?.orgId;
        if (!orgId) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }
        // Call the service to get the order details
        const result = await radiology_1.default.getOrderDetails(orderId, orgId);
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.default.error('Error in getOrderDetails controller:', {
            error,
            orderId: req.params.orderId,
            orgId: req.user?.orgId
        });
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
exports.default = getOrderDetails;
//# sourceMappingURL=order-details.controller.js.map