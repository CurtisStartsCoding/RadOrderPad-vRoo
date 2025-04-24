import express from 'express';
import { authenticateJWT } from '../middleware/auth';
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

export default router;