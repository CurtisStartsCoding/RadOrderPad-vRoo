import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import locationController from '../controllers/location/index.js';
import organizationController from '../controllers/organization/index.js';

const router = express.Router();

// Middleware to authenticate all routes
router.use(authenticateJWT);

// Organization routes
router.get('/mine', organizationController.getMyOrganization);

router.put('/mine', authorizeRole(['admin_referring', 'admin_radiology']), organizationController.updateMyOrganization);

// Search for organizations (for connection requests)
router.get('/', authorizeRole(['admin_referring', 'admin_radiology']), organizationController.searchOrganizations);

// Location routes
// Only admin roles can manage locations
const adminRoles = ['admin_referring', 'admin_radiology'];

// List locations for the user's organization - MUST come before /:orgId/locations
router.get('/mine/locations', authorizeRole(adminRoles), locationController.listLocations);

// Get locations for a connected organization
router.get('/:orgId/locations', authorizeRole(['admin_referring', 'admin_radiology', 'admin_staff']), locationController.listConnectedOrgLocations);

// Create a new location
router.post('/mine/locations', authorizeRole(adminRoles), locationController.createLocation);

// Get details of a specific location
router.get('/mine/locations/:locationId', authorizeRole(adminRoles), locationController.getLocation);

// Update a location
router.put('/mine/locations/:locationId', authorizeRole(adminRoles), locationController.updateLocation);

// Deactivate a location (soft delete)
router.delete('/mine/locations/:locationId', authorizeRole(adminRoles), locationController.deactivateLocation);

export default router;