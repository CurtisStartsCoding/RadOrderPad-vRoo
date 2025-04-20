import { handleValidationRequest } from './order/validation';
import { handleFinalizeOrder } from './order/finalize';
import { getOrderById } from './order/get-order';
/**
 * Service for handling order-related operations
 */
export class OrderService {
    /**
     * Handle validation request for an order
     */
    static async handleValidationRequest(dictationText, patientInfo, userId, orgId, orderId, isOverrideValidation = false, radiologyOrganizationId) {
        return handleValidationRequest(dictationText, patientInfo, userId, orgId, orderId, isOverrideValidation, radiologyOrganizationId);
    }
    /**
     * Handle finalization of an order
     */
    static async handleFinalizeOrder(orderId, payload, userId) {
        return handleFinalizeOrder(orderId, payload, userId);
    }
    /**
     * Get order details by ID
     */
    static async getOrderById(orderId, userId) {
        return getOrderById(orderId, userId);
    }
}
export default OrderService;
//# sourceMappingURL=order.service.js.map