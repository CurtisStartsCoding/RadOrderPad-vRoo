"use strict";
/**
 * Order Management Controller
 *
 * This module provides functionality for managing orders, including
 * finalizing orders and retrieving order details.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderManagementController = void 0;
const handlers_1 = require("./handlers");
// Export types
__exportStar(require("./types"), exports);
// Export validation functions
__exportStar(require("./validation"), exports);
// Export error handling functions
__exportStar(require("./error-handling"), exports);
// Export handler functions
__exportStar(require("./handlers"), exports);
/**
 * Controller for handling order management operations
 *
 * This class is provided for backward compatibility with the original
 * controller structure. New code should use the individual handler
 * functions directly.
 */
class OrderManagementController {
    /**
     * Finalize an order
     * @route PUT /api/orders/:orderId
     */
    async finalizeOrder(req, res) {
        return (0, handlers_1.finalizeOrder)(req, res);
    }
    /**
     * Get order details
     * @route GET /api/orders/:orderId
     */
    async getOrder(req, res) {
        return (0, handlers_1.getOrder)(req, res);
    }
    /**
     * Add administrative updates to an order
     * @route POST /api/orders/:orderId/admin-update
     */
    async adminUpdate(req, res) {
        return (0, handlers_1.adminUpdate)(req, res);
    }
}
exports.OrderManagementController = OrderManagementController;
// Export controller instance for backward compatibility
exports.default = new OrderManagementController();
//# sourceMappingURL=index.js.map