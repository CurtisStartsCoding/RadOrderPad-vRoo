import { Router } from 'express';
import registerController from '../controllers/auth/register.controller';
import authController from '../controllers/auth.controller.js';

const router = Router();

// Add a test endpoint that bypasses CAPTCHA verification
router.post('/register-test', (req, res, next) => {
  // Set the test mode header
  req.headers['x-test-mode'] = 'true';
  // Call the regular register controller
  registerController.register(req, res);
});


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