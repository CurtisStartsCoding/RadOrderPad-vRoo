"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const superadmin_1 = require("../controllers/superadmin");
const router = (0, express_1.Router)();
// Apply authentication and role-based access control middleware to all routes
router.use(auth_1.authenticateJWT);
router.use((0, auth_1.authorizeRole)(['super_admin']));
// Organization routes
router.get('/organizations', superadmin_1.listAllOrganizationsController);
router.get('/organizations/:orgId', superadmin_1.getOrganizationByIdController);
// User routes
router.get('/users', superadmin_1.listAllUsersController);
router.get('/users/:userId', superadmin_1.getUserByIdController);
exports.default = router;
//# sourceMappingURL=superadmin.routes.js.map