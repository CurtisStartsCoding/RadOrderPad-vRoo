"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const validation_1 = require("./order/validation");
const finalize_1 = require("./order/finalize");
const get_order_1 = require("./order/get-order");
/**
 * Service for handling order-related operations
 */
class OrderService {
    /**
     * Handle validation request for an order
     */
    static async handleValidationRequest(dictationText, patientInfo, userId, orgId, orderId, isOverrideValidation = false, radiologyOrganizationId) {
        return (0, validation_1.handleValidationRequest)(dictationText, patientInfo, userId, orgId, orderId, isOverrideValidation, radiologyOrganizationId);
    }
    /**
     * Handle finalization of an order
     */
    static async handleFinalizeOrder(orderId, payload, userId) {
        return (0, finalize_1.handleFinalizeOrder)(orderId, payload, userId);
    }
    /**
     * Get order details by ID
     */
    static async getOrderById(orderId, userId) {
        return (0, get_order_1.getOrderById)(orderId, userId);
    }
}
exports.OrderService = OrderService;
exports.default = OrderService;
//# sourceMappingURL=order.service.js.map