"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_js_1 = __importDefault(require("./auth.routes.js"));
const orders_routes_js_1 = __importDefault(require("./orders.routes.js"));
const admin_orders_routes_js_1 = __importDefault(require("./admin-orders.routes.js"));
const radiology_orders_routes_js_1 = __importDefault(require("./radiology-orders.routes.js"));
const uploads_routes_js_1 = __importDefault(require("./uploads.routes.js"));
const connection_routes_js_1 = __importDefault(require("./connection.routes.js"));
const webhooks_routes_js_1 = __importDefault(require("./webhooks.routes.js"));
const organization_routes_js_1 = __importDefault(require("./organization.routes.js"));
const user_location_routes_js_1 = __importDefault(require("./user-location.routes.js"));
const user_invite_routes_js_1 = __importDefault(require("./user-invite.routes.js"));
const superadmin_routes_js_1 = __importDefault(require("./superadmin.routes.js"));
const billing_routes_js_1 = __importDefault(require("./billing.routes.js"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/auth', auth_routes_js_1.default);
router.use('/orders', orders_routes_js_1.default);
router.use('/admin/orders', admin_orders_routes_js_1.default);
router.use('/radiology/orders', radiology_orders_routes_js_1.default);
router.use('/uploads', uploads_routes_js_1.default);
router.use('/webhooks', webhooks_routes_js_1.default);
router.use('/connections', connection_routes_js_1.default);
router.use('/organizations', organization_routes_js_1.default);
router.use('/users', user_location_routes_js_1.default);
// Mount user invite routes separately to avoid middleware conflicts
router.use('/user-invites', user_invite_routes_js_1.default);
router.use('/superadmin', superadmin_routes_js_1.default);
router.use('/billing', billing_routes_js_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map