"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientInfo = updatePatientInfo;
const admin_1 = __importDefault(require("../../services/order/admin"));
const types_1 = require("./types");
/**
 * Update patient information
 * @route PUT /api/admin/orders/:orderId/patient-info
 */
async function updatePatientInfo(req, res) {
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
        (0, types_1.handleControllerError)(error, res, 'updatePatientInfo');
    }
}
exports.default = updatePatientInfo;
//# sourceMappingURL=update-patient.controller.js.map