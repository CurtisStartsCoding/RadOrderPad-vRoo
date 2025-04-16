"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrderId = validateOrderId;
/**
 * Validates that the order ID is a valid number
 * @param req Express request object
 * @param res Express response object
 * @returns true if valid, false if invalid (response is sent in case of invalid)
 */
function validateOrderId(req, res) {
    const orderId = parseInt(req.params.orderId);
    if (isNaN(orderId)) {
        res.status(400).json({ message: 'Invalid order ID' });
        return false;
    }
    return true;
}
//# sourceMappingURL=validate-order-id.js.map