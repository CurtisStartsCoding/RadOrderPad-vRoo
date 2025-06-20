import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import locationController from '../controllers/location';

const router = express.Router();

// Middleware to authenticate all routes
router.use(authenticateJWT);

// Organization routes (to be implemented)
router.get('/mine', authenticateJWT, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/mine', authenticateJWT, authorizeRole(['admin_referring', 'admin_radiology']), (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Location routes
// Only admin roles can manage locations
const adminRoles = ['admin_referring', 'admin_radiology'];

// List locations for the user's organization
router.get('/mine/locations', authorizeRole(adminRoles), locationController.listLocations);

// Create a new location
router.post('/mine/locations', authorizeRole(adminRoles), locationController.createLocation);

// Get details of a specific location
router.get('/mine/locations/:locationId', authorizeRole(adminRoles), locationController.getLocation);

// Update a location
router.put('/mine/locations/:locationId', authorizeRole(adminRoles), locationController.updateLocation);

// Deactivate a location (soft delete)
router.delete('/mine/locations/:locationId', authorizeRole(adminRoles), locationController.deactivateLocation);

export default router;