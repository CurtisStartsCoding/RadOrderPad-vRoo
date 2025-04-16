/**
 * Radiology Order Service
 *
 * This module provides functions for managing radiology orders.
 * It has been refactored from a class-based approach to a functional approach
 * for better maintainability and testability.
 */
export * from './types';
export * from './incoming-orders.service';
export * from './order-details.service';
export * from './order-export';
export * from './order-status.service';
export * from './information-request.service';
import { getIncomingOrders } from './incoming-orders.service';
import { getOrderDetails } from './order-details.service';
import { exportOrder } from './order-export';
import { updateOrderStatus } from './order-status.service';
import { requestInformation } from './information-request.service';
declare const radiologyOrderService: {
    getIncomingOrders: typeof getIncomingOrders;
    getOrderDetails: typeof getOrderDetails;
    exportOrder: typeof exportOrder;
    updateOrderStatus: typeof updateOrderStatus;
    requestInformation: typeof requestInformation;
};
export default radiologyOrderService;
