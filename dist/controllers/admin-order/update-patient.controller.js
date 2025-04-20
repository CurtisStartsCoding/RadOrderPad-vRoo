import AdminOrderService from '../../services/order/admin';
import { handleControllerError } from './types';
/**
 * Update patient information
 * @route PUT /api/admin/orders/:orderId/patient-info
 */
export async function updatePatientInfo(req, res) {
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
        const result = await AdminOrderService.updatePatientInfo(orderId, patientData, userId);
        res.status(200).json(result);
    }
    catch (error) {
        handleControllerError(error, res, 'updatePatientInfo');
    }
}
export default updatePatientInfo;
//# sourceMappingURL=update-patient.controller.js.map