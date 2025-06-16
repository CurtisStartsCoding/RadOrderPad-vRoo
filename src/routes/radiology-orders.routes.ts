import { Router } from 'express';
import radiologyOrderController from '../controllers/radiology';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/radiology/orders
 * @desc    Get incoming orders queue for radiology group
 * @access  Private (Scheduler, Admin Radiology)
 */
router.get(
  '/',
  authenticateJWT,
  authorizeRole(['scheduler', 'radiologist', 'admin_radiology']),
  radiologyOrderController.getIncomingOrders
);

/**
 * @route   GET /api/radiology/orders/:orderId
 * @desc    Get full details of an order
 * @access  Private (Scheduler, Admin Radiology)
 */
router.get(
  '/:orderId',
  authenticateJWT,
  authorizeRole(['scheduler', 'radiologist', 'admin_radiology']),
  radiologyOrderController.getOrderDetails
);

/**
 * @route   GET /api/radiology/orders/:orderId/export/:format
 * @desc    Export order data in specified format
 * @access  Private (Scheduler, Admin Radiology)
 */
router.get(
  '/:orderId/export/:format',
  authenticateJWT,
  authorizeRole(['scheduler', 'radiologist', 'admin_radiology']),
  radiologyOrderController.exportOrder
);

/**
 * @route   POST /api/radiology/orders/:orderId/update-status
 * @desc    Update order status
 * @access  Private (Scheduler, Admin Radiology)
 */
router.post(
  '/:orderId/update-status',
  authenticateJWT,
  authorizeRole(['scheduler', 'radiologist', 'admin_radiology']),
  radiologyOrderController.updateOrderStatus
);

/**
 * @route   POST /api/radiology/orders/:orderId/request-info
 * @desc    Request additional information from referring group
 * @access  Private (Scheduler, Admin Radiology)
 */
router.post(
  '/:orderId/request-info',
  authenticateJWT,
  authorizeRole(['scheduler', 'radiologist', 'admin_radiology']),
  radiologyOrderController.requestInformation
);

export default router;