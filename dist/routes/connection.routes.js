import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import connectionController from '../controllers/connection';
const router = express.Router();
// Middleware to authenticate all routes
router.use(authenticateJWT);
// Only admin roles can manage connections
const adminRoles = ['admin_referring', 'admin_radiology'];
// List connections for the user's organization
router.get('/', authorizeRole(adminRoles), connectionController.listConnections);
// Request a connection to another organization
router.post('/', authorizeRole(adminRoles), connectionController.requestConnection);
// List pending incoming connection requests
router.get('/requests', authorizeRole(adminRoles), connectionController.listIncomingRequests);
// Approve a pending incoming request
router.post('/:relationshipId/approve', authorizeRole(adminRoles), connectionController.approveConnection);
// Reject a pending incoming request
router.post('/:relationshipId/reject', authorizeRole(adminRoles), connectionController.rejectConnection);
// Terminate an active connection
router.delete('/:relationshipId', authorizeRole(adminRoles), connectionController.terminateConnection);
export default router;
//# sourceMappingURL=connection.routes.js.map