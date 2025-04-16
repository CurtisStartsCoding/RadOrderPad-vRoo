"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrderController = void 0;
const admin_1 = __importDefault(require("../services/order/admin"));
/**
 * Controller for handling admin order operations
 */
class AdminOrderController {
    /**
     * Handle pasted EMR summary
     * @route POST /api/admin/orders/:orderId/paste-summary
     */
    async handlePasteSummary(req, res) {
        try {
            const orderId = parseInt(req.params.orderId);
            if (isNaN(orderId)) {
                res.status(400).json({ message: 'Invalid order ID' });
                return;
            }
            const { pastedText } = req.body;
            if (!pastedText) {
                res.status(400).json({ message: 'Pasted text is required' });
                return;
            }
            // Get user information from the JWT token
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'User authentication required' });
                return;
            }
            // Call the service to handle the pasted EMR summary
            const result = await admin_1.default.handlePasteSummary(orderId, pastedText, userId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in handlePasteSummary controller:', error);
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
     * Handle pasted supplemental documents
     * @route POST /api/admin/orders/:orderId/paste-supplemental
     */
    async handlePasteSupplemental(req, res) {
        try {
            const orderId = parseInt(req.params.orderId);
            if (isNaN(orderId)) {
                res.status(400).json({ message: 'Invalid order ID' });
                return;
            }
            const { pastedText } = req.body;
            if (!pastedText) {
                res.status(400).json({ message: 'Pasted text is required' });
                return;
            }
            // Get user information from the JWT token
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'User authentication required' });
                return;
            }
            // Call the service to handle the pasted supplemental documents
            const result = await admin_1.default.handlePasteSupplemental(orderId, pastedText, userId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in handlePasteSupplemental controller:', error);
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
     * Send order to radiology
     * @route POST /api/admin/orders/:orderId/send-to-radiology
     */
    async sendToRadiology(req, res) {
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
            // Call the service to send the order to radiology
            const result = await admin_1.default.sendToRadiology(orderId, userId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in sendToRadiology controller:', error);
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({ message: error.message });
                }
                else if (error.message.includes('Unauthorized')) {
                    res.status(403).json({ message: error.message });
                }
                else if (error.message.includes('missing')) {
                    res.status(400).json({ message: error.message });
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
     * Update patient information
     * @route PUT /api/admin/orders/:orderId/patient-info
     */
    async updatePatientInfo(req, res) {
        try {
            const orderId = parseInt(req.params.orderId);
            if (isNaN(orderId)) {
                res.status(400).json({ message: 'Invalid order ID' });
                return;
            }
            const patientData = req.body;
            if (!patientData) {
                res.status(400).json({ message: 'Patient data is required' });
                return;
            }
            // Get user information from the JWT token
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'User authentication required' });
                return;
            }
            // Call the service to update the patient information
            const result = await admin_1.default.updatePatientInfo(orderId, patientData, userId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in updatePatientInfo controller:', error);
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
     * Update insurance information
     * @route PUT /api/admin/orders/:orderId/insurance-info
     */
    async updateInsuranceInfo(req, res) {
        try {
            const orderId = parseInt(req.params.orderId);
            if (isNaN(orderId)) {
                res.status(400).json({ message: 'Invalid order ID' });
                return;
            }
            const insuranceData = req.body;
            if (!insuranceData) {
                res.status(400).json({ message: 'Insurance data is required' });
                return;
            }
            // Get user information from the JWT token
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'User authentication required' });
                return;
            }
            // Call the service to update the insurance information
            const result = await admin_1.default.updateInsuranceInfo(orderId, insuranceData, userId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in updateInsuranceInfo controller:', error);
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
exports.AdminOrderController = AdminOrderController;
exports.default = new AdminOrderController();
//# sourceMappingURL=admin-order.controller.js.map