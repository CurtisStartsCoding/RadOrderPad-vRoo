import { Router } from 'express';
import orderValidationController from '../controllers/order-validation.controller';
import orderManagementController from '../controllers/order-management';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
const router = Router();
/**
 * @route   POST /api/orders/validate
 * @desc    Validate an order
 * @access  Private (Physician)
 */
router.post('/validate', authenticateJWT, authorizeRole(['physician']), orderValidationController.validateOrder);
/**
 * @route   PUT /api/orders/:orderId
 * @desc    Finalize an order
 * @access  Private (Physician)
 */
router.put('/:orderId', authenticateJWT, authorizeRole(['physician']), orderManagementController.finalizeOrder);
/**
 * @route   GET /api/orders/:orderId
 * @desc    Get order details
 * @access  Private (Any authenticated user with access to the order)
 */
router.get('/:orderId', authenticateJWT, orderManagementController.getOrder);
/**
 * @route   POST /api/orders/:orderId/admin-update
 * @desc    Add administrative updates to an order
 * @access  Private (Admin)
 */
router.post('/:orderId/admin-update', authenticateJWT, authorizeRole(['admin']), orderManagementController.adminUpdate);
export default router;
//# sourceMappingURL=orders.routes.js.map