import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import locationController from '../controllers/location';

const router = express.Router();

// Middleware to authenticate all routes
router.use(authenticateJWT);

// Only admin roles can manage user-location assignments
const adminRoles = ['admin_referring', 'admin_radiology'];

// List locations assigned to a user
router.get('/:userId/locations', authorizeRole(adminRoles), locationController.listUserLocations);

// Assign a user to a location
router.post('/:userId/locations/:locationId', authorizeRole(adminRoles), locationController.assignUserToLocation);

// Unassign a user from a location
router.delete('/:userId/locations/:locationId', authorizeRole(adminRoles), locationController.unassignUserFromLocation);

export default router;