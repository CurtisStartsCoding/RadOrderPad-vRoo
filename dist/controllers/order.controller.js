"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = __importDefault(require("../services/order.service"));
const models_1 = require("../models");
/**
 * Controller for handling order-related routes
 */
class OrderController {
    /**
     * Validate an order
     * @route POST /api/orders/validate
     */
    async validateOrder(req, res) {
        try {
            const { dictationText, patientInfo, orderId, isOverrideValidation } = req.body;
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
            const result = await order_service_1.default.handleValidationRequest(dictationText, patientInfo, userId, orgId, orderId, isOverrideValidation);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in validateOrder controller:', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'An unexpected error occurred' });
            }
        }
    }
    /**
     * Finalize an order
     * @route PUT /api/orders/:orderId
     */
    async finalizeOrder(req, res) {
        try {
            const orderId = parseInt(req.params.orderId);
            if (isNaN(orderId)) {
                res.status(400).json({ message: 'Invalid order ID' });
                return;
            }
            const { finalValidationStatus, finalComplianceScore, finalICD10Codes, finalICD10CodeDescriptions, finalCPTCode, finalCPTCodeDescription, clinicalIndication, isTemporaryPatient, patientInfo, overridden, overrideJustification, isUrgentOverride, signatureData } = req.body;
            // Validate required fields
            if (!finalValidationStatus || !finalCPTCode || !clinicalIndication) {
                res.status(400).json({
                    message: 'Required fields missing: finalValidationStatus, finalCPTCode, clinicalIndication'
                });
                return;
            }
            // Validate that finalValidationStatus is a valid enum value
            if (!Object.values(models_1.ValidationStatus).includes(finalValidationStatus)) {
                res.status(400).json({
                    message: 'Invalid finalValidationStatus value'
                });
                return;
            }
            // If this is an override, ensure justification is provided
            if (overridden && !overrideJustification) {
                res.status(400).json({
                    message: 'Override justification is required when overridden is true'
                });
                return;
            }
            // If this is a temporary patient, ensure patient info is provided
            if (isTemporaryPatient && (!patientInfo || !patientInfo.firstName || !patientInfo.lastName || !patientInfo.dateOfBirth || !patientInfo.gender)) {
                res.status(400).json({
                    message: 'Patient information is required for temporary patients'
                });
                return;
            }
            // Get user information from the JWT token
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'User authentication required' });
                return;
            }
            // Call the service to handle the finalization
            const result = await order_service_1.default.handleFinalizeOrder(orderId, {
                finalValidationStatus,
                finalComplianceScore,
                finalICD10Codes,
                finalICD10CodeDescriptions,
                finalCPTCode,
                finalCPTCodeDescription,
                clinicalIndication,
                isTemporaryPatient,
                patientInfo,
                overridden,
                overrideJustification,
                isUrgentOverride,
                signatureData
            }, userId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in finalizeOrder controller:', error);
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({ message: error.message });
                }
                else if (error.message.includes('Unauthorized')) {
                    res.status(403).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: error.message });
                }
            }
            else {
                res.status(500).json({ message: 'An unexpected error occurred' });
            }
        }
    }
    /**
     * Get order details
     * @route GET /api/orders/:orderId
     */
    async getOrder(req, res) {
        try {
            const orderId = parseInt(req.params.orderId);
            if (isNaN(orderId)) {
                res.status(400).json({ message: 'Invalid order ID' });
                return;
            }
            // Get user information from the JWT token
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'User authentication required' });
                return;
            }
            // Call the service to get the order
            const order = await order_service_1.default.getOrderById(orderId, userId);
            res.status(200).json(order);
        }
        catch (error) {
            console.error('Error in getOrder controller:', error);
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({ message: error.message });
                }
                else if (error.message.includes('Unauthorized')) {
                    res.status(403).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: error.message });
                }
            }
            else {
                res.status(500).json({ message: 'An unexpected error occurred' });
            }
        }
    }
}
exports.OrderController = OrderController;
exports.default = new OrderController();
//# sourceMappingURL=order.controller.js.map