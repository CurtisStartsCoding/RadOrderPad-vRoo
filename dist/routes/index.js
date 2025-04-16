"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const orders_routes_1 = __importDefault(require("./orders.routes"));
const admin_orders_routes_1 = __importDefault(require("./admin-orders.routes"));
const radiology_orders_routes_1 = __importDefault(require("./radiology-orders.routes"));
const uploads_routes_1 = __importDefault(require("./uploads.routes"));
const connection_routes_1 = __importDefault(require("./connection.routes"));
const webhooks_routes_1 = __importDefault(require("./webhooks.routes"));
const organization_routes_1 = __importDefault(require("./organization.routes"));
const user_location_routes_1 = __importDefault(require("./user-location.routes"));
const superadmin_routes_1 = __importDefault(require("./superadmin.routes"));
const billing_routes_1 = __importDefault(require("./billing.routes"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/auth', auth_routes_1.default);
router.use('/orders', orders_routes_1.default);
router.use('/admin/orders', admin_orders_routes_1.default);
router.use('/radiology/orders', radiology_orders_routes_1.default);
router.use('/uploads', uploads_routes_1.default);
router.use('/webhooks', webhooks_routes_1.default);
router.use('/connections', connection_routes_1.default);
router.use('/organizations', organization_routes_1.default);
router.use('/users', user_location_routes_1.default);
router.use('/superadmin', superadmin_routes_1.default);
router.use('/billing', billing_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map