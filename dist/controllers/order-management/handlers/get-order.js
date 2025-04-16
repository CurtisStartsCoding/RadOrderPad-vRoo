"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = getOrder;
const order_service_1 = __importDefault(require("../../../services/order.service"));
const validation_1 = require("../validation");
const error_handling_1 = require("../error-handling");
/**
 * Handles the get order request
 * @param req Express request object
 * @param res Express response object
 */
async function getOrder(req, res) {
    try {
        // Validate order ID
        if (!(0, validation_1.validateOrderId)(req, res)) {
            return;
        }
        // Validate user authentication
        const userId = (0, validation_1.validateUserAuth)(req, res);
        if (!userId) {
            return;
        }
        const orderId = parseInt(req.params.orderId);
        // Call the service to get the order
        const order = await order_service_1.default.getOrderById(orderId, userId);
        res.status(200).json(order);
    }
    catch (error) {
        (0, error_handling_1.handleControllerError)(error, res, 'getOrder');
    }
}
//# sourceMappingURL=get-order.js.map