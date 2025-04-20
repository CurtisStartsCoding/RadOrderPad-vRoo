import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
const router = Router();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new organization and admin user
 * @access  Public
 */
router.post('/register', authController.register);
/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', authController.login);
export default router;
//# sourceMappingURL=auth.routes.js.map