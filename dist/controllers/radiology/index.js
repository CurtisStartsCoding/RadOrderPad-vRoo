"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiologyOrderController = void 0;
const incoming_orders_controller_1 = __importDefault(require("./incoming-orders.controller"));
const order_details_controller_1 = __importDefault(require("./order-details.controller"));
const export_order_controller_1 = __importDefault(require("./export-order.controller"));
const update_status_controller_1 = __importDefault(require("./update-status.controller"));
const request_information_controller_1 = __importDefault(require("./request-information.controller"));
/**
 * Controller for handling radiology order operations
 */
class RadiologyOrderController {
    /**
     * Get incoming orders queue for radiology group
     * @route GET /api/radiology/orders
     */
    async getIncomingOrders(req, res) {
        return (0, incoming_orders_controller_1.default)(req, res);
    }
    /**
     * Get full details of an order
     * @route GET /api/radiology/orders/:orderId
     */
    async getOrderDetails(req, res) {
        return (0, order_details_controller_1.default)(req, res);
    }
    /**
     * Export order data in specified format
     * @route GET /api/radiology/orders/:orderId/export/:format
     */
    async exportOrder(req, res) {
        return (0, export_order_controller_1.default)(req, res);
    }
    /**
     * Update order status
     * @route POST /api/radiology/orders/:orderId/update-status
     */
    async updateOrderStatus(req, res) {
        return (0, update_status_controller_1.default)(req, res);
    }
    /**
     * Request additional information from referring group
     * @route POST /api/radiology/orders/:orderId/request-info
     */
    async requestInformation(req, res) {
        return (0, request_information_controller_1.default)(req, res);
    }
}
exports.RadiologyOrderController = RadiologyOrderController;
exports.default = new RadiologyOrderController();
//# sourceMappingURL=index.js.map