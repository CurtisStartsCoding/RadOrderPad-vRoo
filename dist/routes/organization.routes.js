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
// Organization routes (to be implemented)
router.get('/mine', auth_1.authenticateJWT, (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
router.put('/mine', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['admin_referring', 'admin_radiology']), (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Location routes
// Only admin roles can manage locations
const adminRoles = ['admin_referring', 'admin_radiology'];
// List locations for the user's organization
router.get('/mine/locations', (0, auth_1.authorizeRole)(adminRoles), location_1.default.listLocations);
// Create a new location
router.post('/mine/locations', (0, auth_1.authorizeRole)(adminRoles), location_1.default.createLocation);
// Get details of a specific location
router.get('/mine/locations/:locationId', (0, auth_1.authorizeRole)(adminRoles), location_1.default.getLocation);
// Update a location
router.put('/mine/locations/:locationId', (0, auth_1.authorizeRole)(adminRoles), location_1.default.updateLocation);
// Deactivate a location (soft delete)
router.delete('/mine/locations/:locationId', (0, auth_1.authorizeRole)(adminRoles), location_1.default.deactivateLocation);
exports.default = router;
//# sourceMappingURL=organization.routes.js.map