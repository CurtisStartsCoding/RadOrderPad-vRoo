"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_controller_1 = __importDefault(require("../controllers/auth/register.controller"));
const auth_controller_js_1 = __importDefault(require("../controllers/auth.controller.js"));
const register_controller_2 = __importDefault(require("../controllers/auth/trial/register.controller"));
const login_controller_1 = __importDefault(require("../controllers/auth/trial/login.controller"));
const router = (0, express_1.Router)();
// Add a test endpoint that bypasses CAPTCHA verification
router.post('/register-test', (req, res) => {
    // Set the test mode header
    req.headers['x-test-mode'] = 'true';
    // Call the regular register controller
    register_controller_1.default.register(req, res);
});
/**
 * @route   POST /api/auth/register
 * @desc    Register a new organization and admin user
 * @access  Public
 */
router.post('/register', auth_controller_js_1.default.register);
/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', auth_controller_js_1.default.login);
/**
 * @route   POST /api/auth/trial/register
 * @desc    Register a new trial user
 * @access  Public
 */
router.post('/trial/register', register_controller_2.default.registerTrialUser);
/**
 * @route   POST /api/auth/trial/login
 * @desc    Login a trial user
 * @access  Public
 */
router.post('/trial/login', login_controller_1.default.loginTrialUser);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map