"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidationController = void 0;
const order_service_1 = __importDefault(require("../services/order.service"));
/**
 * Controller for handling order validation
 */
class OrderValidationController {
    /**
     * Validate an order
     * @route POST /api/orders/validate
     */
    async validateOrder(req, res) {
        try {
            const { dictationText, patientInfo, orderId, isOverrideValidation, radiologyOrganizationId } = req.body;
            // Validate request body
            if (!dictationText) {
                res.status(400).json({ message: 'Dictation text is required' });
                return;
            }
            // Get user information from the JWT token
            const userId = req.user?.userId;
            const orgId = req.user?.orgId;
            if (!userId || !orgId) {
                res.status(401).json({ message: 'User authentication required' });
                return;
            }
            // Call the service to handle the validation
            const result = await order_service_1.default.handleValidationRequest(dictationText, patientInfo, userId, orgId, orderId, isOverrideValidation, radiologyOrganizationId);
            res.status(200).json(result);
        }
        catch (error) {
            // Log error without including potentially sensitive details
            // eslint-disable-next-line no-console
            console.error('Error in validateOrder controller - check server logs for details');
            // Handle custom error object with status
            if (error && typeof error === 'object' && 'status' in error) {
                const customError = error;
                res.status(customError.status).json({
                    message: customError.message,
                    code: customError.code,
                    orderId: customError.orderId
                });
            }
            else if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'An unexpected error occurred' });
            }
        }
    }
}
exports.OrderValidationController = OrderValidationController;
exports.default = new OrderValidationController();
//# sourceMappingURL=order-validation.controller.js.map