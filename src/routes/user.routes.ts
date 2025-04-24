import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import userController from '../controllers/user.controller';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

/**
 * @route   GET /me
 * @desc    Get the profile of the currently authenticated user
 * @access  Private (Any authenticated user)
 */
router.get('/me', userController.getMe);

/**
 * @route   PUT /me
 * @desc    Update the profile of the currently authenticated user
 * @access  Private (Any authenticated user)
 * @body    firstName - User's first name (optional)
 * @body    lastName - User's last name (optional)
 * @body    phoneNumber - User's phone number (optional)
 * @body    specialty - User's medical specialty (optional)
 * @body    npi - User's National Provider Identifier (optional)
 */
router.put('/me', userController.updateMe);

/**
 * @route   GET /
 * @desc    List all users belonging to the authenticated admin's organization
 * @access  Private (admin_referring, admin_radiology)
 * @query   page - Page number (default: 1)
 * @query   limit - Number of items per page (default: 20)
 * @query   sortBy - Field to sort by (default: last_name)
 * @query   sortOrder - Sort direction (asc or desc, default: asc)
 * @query   role - Filter by role (optional)
 * @query   status - Filter by active status (true or false, optional)
 * @query   name - Search by name (optional)
 */
router.get('/', authorizeRole(['admin_referring', 'admin_radiology']), userController.listOrgUsers);

export default router;