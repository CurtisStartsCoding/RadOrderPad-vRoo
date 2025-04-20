/**
 * Radiology Order Service
 *
 * This module provides functions for managing radiology orders.
 * It has been refactored from a class-based approach to a functional approach
 * for better maintainability and testability.
 */
// Export all functionality from individual modules
export * from './types';
export * from './incoming-orders.service';
export * from './order-details.service';
export * from './order-export';
export * from './order-status.service';
export * from './information-request.service';
// Import individual functions for the default export
import { getIncomingOrders } from './incoming-orders.service';
import { getOrderDetails } from './order-details.service';
import { exportOrder } from './order-export';
import { updateOrderStatus } from './order-status.service';
import { requestInformation } from './information-request.service';
// Create a service object for backward compatibility
const radiologyOrderService = {
    getIncomingOrders,
    getOrderDetails,
    exportOrder,
    updateOrderStatus,
    requestInformation
};
// Export the service object as default for backward compatibility
export default radiologyOrderService;
//# sourceMappingURL=index.js.map