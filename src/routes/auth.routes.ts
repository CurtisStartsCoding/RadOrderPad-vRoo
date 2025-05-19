import { Router } from 'express';
import registerController from '../controllers/auth/register.controller';
import authController from '../controllers/auth.controller.js';
import trialRegisterController from '../controllers/auth/trial/register.controller';
import trialLoginController from '../controllers/auth/trial/login.controller';
import trialMeController from '../controllers/auth/trial/me.controller';
import trialPasswordController from '../controllers/auth/trial/password.controller';
import { authenticateJWT } from '../middleware/auth/authenticate-jwt';

const router = Router();

// Add a test endpoint that bypasses CAPTCHA verification
router.post('/register-test', (req, res) => {
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

/**
 * @route   POST /api/auth/trial/register
 * @desc    Register a new trial user
 * @access  Public
 */
router.post('/trial/register', trialRegisterController.registerTrialUser);

/**
 * @route   POST /api/auth/trial/login
 * @desc    Login a trial user
 * @access  Public
 */
router.post('/trial/login', trialLoginController.loginTrialUser);

/**
 * @route   GET /api/auth/trial/me
 * @desc    Get the profile and trial status of the currently authenticated trial user
 * @access  Authenticated (Trial User JWT)
 */
router.get('/trial/me', authenticateJWT, trialMeController.getTrialMe);

/**
 * @route   POST /api/auth/trial/update-password
 * @desc    Update a trial user's password (simplified flow without email token verification)
 * @access  Public
 */
router.post('/trial/update-password', trialPasswordController.updateTrialPassword);

export default router;