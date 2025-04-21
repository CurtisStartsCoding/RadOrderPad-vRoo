import { Router } from 'express';
import adminOrderController from '../controllers/admin-order';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/admin/orders/:orderId/paste-summary
 * @desc    Submit pasted EMR summary for parsing
 * @access  Private (Admin Staff)
 */
router.post(
  '/:orderId/paste-summary',
  authenticateJWT,
  authorizeRole(['admin_staff']),
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
  authorizeRole(['admin_staff']),
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
  authorizeRole(['admin_staff']),
  adminOrderController.sendToRadiology
);

/**
 * @route   POST /api/admin/orders/:orderId/send-to-radiology-fixed
 * @desc    Finalize and send the order to the radiology group using the fixed implementation
 * @access  Private (Admin Staff)
 */
router.post(
  '/:orderId/send-to-radiology-fixed',
  authenticateJWT,
  authorizeRole(['admin_staff']),
  (req, res) => {
    // Import the controller dynamically to avoid circular dependencies
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleSendToRadiologyFixed } = require('../controllers/admin-order/send-to-radiology-fixed.controller');
    return handleSendToRadiologyFixed(req, res);
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
  authorizeRole(['admin_staff']),
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
  authorizeRole(['admin_staff']),
  adminOrderController.updateInsuranceInfo
);

export default router;