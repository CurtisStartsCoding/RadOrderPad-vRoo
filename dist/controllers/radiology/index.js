import getIncomingOrders from './incoming-orders.controller';
import getOrderDetails from './order-details.controller';
import exportOrder from './export-order.controller';
import updateOrderStatus from './update-status.controller';
import requestInformation from './request-information.controller';
/**
 * Controller for handling radiology order operations
 */
export class RadiologyOrderController {
    /**
     * Get incoming orders queue for radiology group
     * @route GET /api/radiology/orders
     */
    async getIncomingOrders(req, res) {
        return getIncomingOrders(req, res);
    }
    /**
     * Get full details of an order
     * @route GET /api/radiology/orders/:orderId
     */
    async getOrderDetails(req, res) {
        return getOrderDetails(req, res);
    }
    /**
     * Export order data in specified format
     * @route GET /api/radiology/orders/:orderId/export/:format
     */
    async exportOrder(req, res) {
        return exportOrder(req, res);
    }
    /**
     * Update order status
     * @route POST /api/radiology/orders/:orderId/update-status
     */
    async updateOrderStatus(req, res) {
        return updateOrderStatus(req, res);
    }
    /**
     * Request additional information from referring group
     * @route POST /api/radiology/orders/:orderId/request-info
     */
    async requestInformation(req, res) {
        return requestInformation(req, res);
    }
}
export default new RadiologyOrderController();
//# sourceMappingURL=index.js.map