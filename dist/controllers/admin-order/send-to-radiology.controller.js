import AdminOrderService from '../../services/order/admin';
import { handleControllerError } from './types';
/**
 * Send order to radiology
 * @route POST /api/admin/orders/:orderId/send-to-radiology
 */
export async function sendToRadiology(req, res) {
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
        const result = await AdminOrderService.sendToRadiology(orderId, userId);
        res.status(200).json(result);
    }
    catch (error) {
        handleControllerError(error, res, 'sendToRadiology');
    }
}
export default sendToRadiology;
//# sourceMappingURL=send-to-radiology.controller.js.map