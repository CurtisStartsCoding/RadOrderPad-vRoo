"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToRadiology = sendToRadiology;
const admin_1 = __importDefault(require("../../services/order/admin"));
const types_1 = require("./types");
/**
 * Send order to radiology
 * @route POST /api/admin/orders/:orderId/send-to-radiology
 */
async function sendToRadiology(req, res) {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }
        // Get user information from the JWT token
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }
        // Call the service to send the order to radiology
        const result = await admin_1.default.sendToRadiology(orderId, userId);
        res.status(200).json(result);
    }
    catch (error) {
        (0, types_1.handleControllerError)(error, res, 'sendToRadiology');
    }
}
exports.default = sendToRadiology;
//# sourceMappingURL=send-to-radiology.controller.js.map