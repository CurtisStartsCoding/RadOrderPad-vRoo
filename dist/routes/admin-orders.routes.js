"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_order_1 = __importDefault(require("../controllers/admin-order"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/admin/orders/:orderId/paste-summary
 * @desc    Submit pasted EMR summary for parsing
 * @access  Private (Admin Staff)
 */
router.post('/:orderId/paste-summary', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_staff']), admin_order_1.default.handlePasteSummary);
/**
 * @route   POST /api/admin/orders/:orderId/paste-supplemental
 * @desc    Submit pasted supplemental documents
 * @access  Private (Admin Staff)
 */
router.post('/:orderId/paste-supplemental', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_staff']), admin_order_1.default.handlePasteSupplemental);
/**
 * @route   POST /api/admin/orders/:orderId/send-to-radiology
 * @desc    Finalize and send the order to the radiology group
 * @access  Private (Admin Staff)
 */
router.post('/:orderId/send-to-radiology', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_staff']), admin_order_1.default.sendToRadiology);
/**
 * @route   PUT /api/admin/orders/:orderId/patient-info
 * @desc    Manually update parsed patient info
 * @access  Private (Admin Staff)
 */
router.put('/:orderId/patient-info', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_staff']), admin_order_1.default.updatePatientInfo);
/**
 * @route   PUT /api/admin/orders/:orderId/insurance-info
 * @desc    Manually update parsed insurance info
 * @access  Private (Admin Staff)
 */
router.put('/:orderId/insurance-info', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_staff']), admin_order_1.default.updateInsuranceInfo);
exports.default = router;
//# sourceMappingURL=admin-orders.routes.js.map