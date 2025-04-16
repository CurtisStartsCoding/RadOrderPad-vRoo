"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePasteSupplemental = handlePasteSupplemental;
const admin_1 = __importDefault(require("../../services/order/admin"));
const types_1 = require("./types");
/**
 * Handle pasted supplemental documents
 * @route POST /api/admin/orders/:orderId/paste-supplemental
 */
async function handlePasteSupplemental(req, res) {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }
        const { pastedText } = req.body;
        if (!pastedText) {
            res.status(400).json({ message: 'Pasted text is required' });
            return;
        }
        // Get user information from the JWT token
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }
        // Call the service to handle the pasted supplemental documents
        const result = await admin_1.default.handlePasteSupplemental(orderId, pastedText, userId);
        res.status(200).json(result);
    }
    catch (error) {
        (0, types_1.handleControllerError)(error, res, 'handlePasteSupplemental');
    }
}
exports.default = handlePasteSupplemental;
//# sourceMappingURL=paste-supplemental.controller.js.map