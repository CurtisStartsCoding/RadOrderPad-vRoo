"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const radiology_1 = __importDefault(require("../controllers/radiology"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/radiology/orders
 * @desc    Get incoming orders queue for radiology group
 * @access  Private (Scheduler, Admin Radiology)
 */
router.get('/', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['scheduler', 'admin_radiology']), radiology_1.default.getIncomingOrders);
/**
 * @route   GET /api/radiology/orders/:orderId
 * @desc    Get full details of an order
 * @access  Private (Scheduler, Admin Radiology)
 */
router.get('/:orderId', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['scheduler', 'admin_radiology']), radiology_1.default.getOrderDetails);
/**
 * @route   GET /api/radiology/orders/:orderId/export/:format
 * @desc    Export order data in specified format
 * @access  Private (Scheduler, Admin Radiology)
 */
router.get('/:orderId/export/:format', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['scheduler', 'admin_radiology']), radiology_1.default.exportOrder);
/**
 * @route   POST /api/radiology/orders/:orderId/update-status
 * @desc    Update order status
 * @access  Private (Scheduler, Admin Radiology)
 */
router.post('/:orderId/update-status', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['scheduler', 'admin_radiology']), radiology_1.default.updateOrderStatus);
/**
 * @route   POST /api/radiology/orders/:orderId/request-info
 * @desc    Request additional information from referring group
 * @access  Private (Scheduler, Admin Radiology)
 */
router.post('/:orderId/request-info', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['scheduler', 'admin_radiology']), radiology_1.default.requestInformation);
exports.default = router;
//# sourceMappingURL=radiology-orders.routes.js.map