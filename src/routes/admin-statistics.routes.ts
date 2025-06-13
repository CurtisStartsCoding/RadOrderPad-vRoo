import { Router } from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import { 
  getOrderStatisticsHandler, 
  exportOrdersHandler 
} from '../controllers/admin/order-statistics.controller';

const router = Router();

/**
 * @route   GET /api/admin/statistics/orders
 * @desc    Get order statistics for admin users
 * @access  Private (admin_referring, admin_radiology)
 */
router.get(
  '/statistics/orders',
  authenticateJWT,
  authorizeRole(['admin_referring', 'admin_radiology']),
  getOrderStatisticsHandler
);

/**
 * @route   POST /api/admin/export/orders
 * @desc    Export orders to CSV
 * @access  Private (admin_referring, admin_radiology)
 * @body    { status?, dateFrom?, dateTo?, limit? }
 */
router.post(
  '/export/orders',
  authenticateJWT,
  authorizeRole(['admin_referring', 'admin_radiology']),
  exportOrdersHandler
);

export default router;