import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import userInviteController from '../controllers/user-invite.controller';

const router = express.Router();

// Only admin roles can invite users
const adminRoles = ['admin_referring', 'admin_radiology'];

// POST /invite - Invite a new user to the organization
// This route requires authentication and admin role
router.post('/invite', authenticateJWT, authorizeRole(adminRoles), userInviteController.inviteUser);

// POST /accept-invitation - Accept an invitation and create a user account
// This route is public and doesn't require authentication
router.post('/accept-invitation', userInviteController.acceptInvitation);

export default router;