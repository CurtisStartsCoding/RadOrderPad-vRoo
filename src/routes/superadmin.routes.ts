import { Router } from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import {
  listAllOrganizationsController,
  getOrganizationByIdController,
  listAllUsersController,
  getUserByIdController
} from '../controllers/superadmin';

const router = Router();

// Apply authentication and role-based access control middleware to all routes
router.use(authenticateJWT);
router.use(authorizeRole(['super_admin']));

// Organization routes
router.get('/organizations', listAllOrganizationsController);
router.get('/organizations/:orgId', getOrganizationByIdController);

// User routes
router.get('/users', listAllUsersController);
router.get('/users/:userId', getUserByIdController);

export default router;