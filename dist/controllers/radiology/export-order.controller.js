"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportOrder = exportOrder;
const radiology_1 = __importDefault(require("../../services/order/radiology"));
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Export order data in specified format
 * @route GET /api/radiology/orders/:orderId/export/:format
 */
async function exportOrder(req, res) {
    try {
        const orderId = parseInt(req.params.orderId);
        const format = req.params.format.toLowerCase();
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }
        // Validate format
        const validFormats = ['pdf', 'csv', 'json'];
        if (!validFormats.includes(format)) {
            res.status(400).json({
                message: `Invalid format. Supported formats: ${validFormats.join(', ')}`
            });
            return;
        }
        // Get user information from the JWT token
        const orgId = req.user?.orgId;
        if (!orgId) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }
        logger_1.default.info(`Exporting order ${orderId} in ${format} format for organization ${orgId}`);
        // Call the service to export the order
        const result = await radiology_1.default.exportOrder(orderId, format, orgId);
        // Set appropriate headers based on format
        if (format === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="order-${orderId}.pdf"`);
        }
        else if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="order-${orderId}.csv"`);
        }
        else if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            // For JSON, we can either suggest downloading or just display in browser
            res.setHeader('Content-Disposition', `attachment; filename="order-${orderId}.json"`);
        }
        // Send the result
        res.status(200).send(result);
        logger_1.default.info(`Successfully exported order ${orderId} in ${format} format`);
    }
    catch (error) {
        logger_1.default.error('Error in exportOrder controller:', error);
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
exports.default = exportOrder;
//# sourceMappingURL=export-order.controller.js.map