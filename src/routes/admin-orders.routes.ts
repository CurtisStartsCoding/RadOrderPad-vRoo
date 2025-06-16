import { Router } from 'express';
import adminOrderController from '../controllers/admin-order';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/admin/orders/queue
 * @desc    List orders awaiting admin finalization
 * @access  Private (Admin Staff)
 */
router.get(
  '/queue',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.listPendingAdminOrders
);

/**
 * @route   POST /api/admin/orders/:orderId/paste-summary
 * @desc    Submit pasted EMR summary for parsing
 * @access  Private (Admin Staff)
 */
router.post(
  '/:orderId/paste-summary',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.handlePasteSummary
);

/**
 * @route   POST /api/admin/orders/:orderId/paste-supplemental
 * @desc    Submit pasted supplemental documents
 * @access  Private (Admin Staff)
 */
router.post(
  '/:orderId/paste-supplemental',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.handlePasteSupplemental
);

/**
 * @route   POST /api/admin/orders/:orderId/send-to-radiology
 * @desc    Finalize and send the order to the radiology group
 * @access  Private (Admin Staff)
 */
router.post(
  '/:orderId/send-to-radiology',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  (req, res) => {
    // Import the controller dynamically to avoid circular dependencies
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleSendToRadiology } = require('../controllers/admin-order/send-to-radiology.controller');
    return handleSendToRadiology(req, res);
  }
);

/**
 * @route   PUT /api/admin/orders/:orderId/patient-info
 * @desc    Manually update parsed patient info
 * @access  Private (Admin Staff)
 */
router.put(
  '/:orderId/patient-info',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.updatePatientInfo
);

/**
 * @route   PUT /api/admin/orders/:orderId/insurance-info
 * @desc    Manually update parsed insurance info
 * @access  Private (Admin Staff)
 */
router.put(
  '/:orderId/insurance-info',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.updateInsuranceInfo
);

/**
 * @route   PUT /api/admin/orders/:orderId/order-details
 * @desc    Update order details (priority, facility, instructions)
 * @access  Private (Admin Staff)
 */
router.put(
  '/:orderId/order-details',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  // Import directly to avoid modifying the controller interface for now
  (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { updateOrderDetails } = require('../controllers/admin-order/update-order-details.controller');
    return updateOrderDetails(req, res);
  }
);

/**
 * @route   PUT /api/admin/orders/:orderId
 * @desc    Unified endpoint to update any order fields (patient, insurance, details, supplemental)
 * @access  Private (Admin Staff)
 */
router.put(
  '/:orderId',
  authenticateJWT,
  authorizeRole(['admin_staff', 'admin_referring']),
  adminOrderController.updateOrder
);

export default router;