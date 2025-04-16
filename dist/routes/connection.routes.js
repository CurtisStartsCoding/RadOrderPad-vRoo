"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const connection_1 = __importDefault(require("../controllers/connection"));
const router = express_1.default.Router();
// Middleware to authenticate all routes
router.use(auth_1.authenticateJWT);
// Only admin roles can manage connections
const adminRoles = ['admin_referring', 'admin_radiology'];
// List connections for the user's organization
router.get('/', (0, auth_1.authorizeRole)(adminRoles), connection_1.default.listConnections);
// Request a connection to another organization
router.post('/', (0, auth_1.authorizeRole)(adminRoles), connection_1.default.requestConnection);
// List pending incoming connection requests
router.get('/requests', (0, auth_1.authorizeRole)(adminRoles), connection_1.default.listIncomingRequests);
// Approve a pending incoming request
router.post('/:relationshipId/approve', (0, auth_1.authorizeRole)(adminRoles), connection_1.default.approveConnection);
// Reject a pending incoming request
router.post('/:relationshipId/reject', (0, auth_1.authorizeRole)(adminRoles), connection_1.default.rejectConnection);
// Terminate an active connection
router.delete('/:relationshipId', (0, auth_1.authorizeRole)(adminRoles), connection_1.default.terminateConnection);
exports.default = router;
//# sourceMappingURL=connection.routes.js.map