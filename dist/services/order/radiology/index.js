"use strict";
/**
 * Radiology Order Service
 *
 * This module provides functions for managing radiology orders.
 * It has been refactored from a class-based approach to a functional approach
 * for better maintainability and testability.
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
// Export all functionality from individual modules
__exportStar(require("./types"), exports);
__exportStar(require("./incoming-orders.service"), exports);
__exportStar(require("./order-details.service"), exports);
__exportStar(require("./order-export"), exports);
__exportStar(require("./order-status.service"), exports);
__exportStar(require("./information-request.service"), exports);
// Import individual functions for the default export
const incoming_orders_service_1 = require("./incoming-orders.service");
const order_details_service_1 = require("./order-details.service");
const order_export_1 = require("./order-export");
const order_status_service_1 = require("./order-status.service");
const information_request_service_1 = require("./information-request.service");
// Create a service object for backward compatibility
const radiologyOrderService = {
    getIncomingOrders: incoming_orders_service_1.getIncomingOrders,
    getOrderDetails: order_details_service_1.getOrderDetails,
    exportOrder: order_export_1.exportOrder,
    updateOrderStatus: order_status_service_1.updateOrderStatus,
    requestInformation: information_request_service_1.requestInformation
};
// Export the service object as default for backward compatibility
exports.default = radiologyOrderService;
//# sourceMappingURL=index.js.map