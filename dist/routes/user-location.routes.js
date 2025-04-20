"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const location_1 = __importDefault(require("../controllers/location"));
const router = express_1.default.Router();
// Middleware to authenticate all routes
router.use(auth_1.authenticateJWT);
// Only admin roles can manage user-location assignments
const adminRoles = ['admin_referring', 'admin_radiology'];
// List locations assigned to a user
router.get('/:userId/locations', (0, auth_1.authorizeRole)(adminRoles), location_1.default.listUserLocations);
// Assign a user to a location
router.post('/:userId/locations/:locationId', (0, auth_1.authorizeRole)(adminRoles), location_1.default.assignUserToLocation);
// Unassign a user from a location
router.delete('/:userId/locations/:locationId', (0, auth_1.authorizeRole)(adminRoles), location_1.default.unassignUserFromLocation);
exports.default = router;
//# sourceMappingURL=user-location.routes.js.map