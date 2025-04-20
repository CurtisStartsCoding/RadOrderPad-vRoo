import RadiologyOrderService from '../../services/order/radiology';
/**
 * Get full details of an order
 * @route GET /api/radiology/orders/:orderId
 */
export async function getOrderDetails(req, res) {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }
        // Get user information from the JWT token
        const orgId = req.user?.orgId;
        if (!orgId) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }
        // Call the service to get the order details
        const result = await RadiologyOrderService.getOrderDetails(orderId, orgId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error in getOrderDetails controller:', error);
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
export default getOrderDetails;
//# sourceMappingURL=order-details.controller.js.map