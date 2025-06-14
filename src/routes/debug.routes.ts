import { Router } from 'express';
import path from 'path';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import debugController from '../controllers/debug/debug-dashboard.controller';

const router = Router();

// All debug routes require super_admin role
const requireSuperAdmin = [authenticateJWT, authorizeRole(['super_admin'])];

/**
 * Debug routes for troubleshooting
 * All routes require super_admin role
 */

// Get all organizations
router.get('/organizations', requireSuperAdmin, debugController.getOrganizations);

// Get all users with their organizations
router.get('/users', requireSuperAdmin, debugController.getUsers);

// Get recent orders
router.get('/orders', requireSuperAdmin, debugController.getOrders);

// Get clinical records for an order
router.get('/orders/:orderId/clinical-records', requireSuperAdmin, debugController.getOrderClinicalRecords);

// Get insurance records for a patient
router.get('/patients/:patientId/insurance', requireSuperAdmin, debugController.getPatientInsurance);

// Get organization connections
router.get('/connections', requireSuperAdmin, debugController.getConnections);

// Execute custom SELECT query
router.post('/query', requireSuperAdmin, debugController.executeQuery);

// Serve the debug dashboard HTML (no auth required for the page itself)
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'debug-dashboard.html'));
});

export default router;