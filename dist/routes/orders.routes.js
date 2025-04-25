"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_validation_controller_1 = __importDefault(require("../controllers/order-validation.controller"));
const order_management_1 = __importDefault(require("../controllers/order-management"));
const trial_validate_controller_1 = __importDefault(require("../controllers/order-validation/trial-validate.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/orders
 * @desc    List orders
 * @access  Private (Authenticated users)
 */
router.get('/', auth_1.authenticateJWT, order_management_1.default.listOrders);
/**
 * @route   POST /api/orders/validate
 * @desc    Validate an order
 * @access  Private (Physician)
 */
router.post('/validate', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['physician']), order_validation_controller_1.default.validateOrder);
/**
 * @route   PUT /api/orders/:orderId
 * @desc    Finalize an order
 * @access  Private (Physician)
 */
router.put('/:orderId', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['physician']), order_management_1.default.finalizeOrder);
/**
 * @route   GET /api/orders/:orderId
 * @desc    Get order details
 * @access  Private (Any authenticated user with access to the order)
 */
router.get('/:orderId', auth_1.authenticateJWT, order_management_1.default.getOrder);
/**
 * @route   POST /api/orders/:orderId/admin-update
 * @desc    Add administrative updates to an order
 * @access  Private (Admin)
 */
router.post('/:orderId/admin-update', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin']), order_management_1.default.adminUpdate);
/**
 * @route   POST /api/orders/validate/trial
 * @desc    Validate an order in trial mode
 * @access  Private (Trial users only)
 */
router.post('/validate/trial', auth_1.authenticateJWT, trial_validate_controller_1.default.validateTrialOrder);
exports.default = router;
//# sourceMappingURL=orders.routes.js.map