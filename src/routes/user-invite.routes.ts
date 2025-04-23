import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth';
import userInviteController from '../controllers/user-invite.controller';

const router = express.Router();

// Middleware to authenticate all routes
router.use(authenticateJWT);

// Only admin roles can invite users
const adminRoles = ['admin_referring', 'admin_radiology'];

// POST /invite - Invite a new user to the organization
router.post('/invite', authorizeRole(adminRoles), userInviteController.inviteUser);

export default router;