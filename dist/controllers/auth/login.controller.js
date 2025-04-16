"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const auth_1 = __importDefault(require("../../services/auth"));
const error_handler_1 = require("./error-handler");
/**
 * Controller for handling user login
 */
class LoginController {
    /**
     * Login a user
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Validate request body
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }
            const loginData = {
                email,
                password
            };
            const result = await auth_1.default.login(loginData);
            res.status(200).json(result);
        }
        catch (error) {
            (0, error_handler_1.handleAuthError)(error, res, 'Login', error_handler_1.loginErrorMap, 'An error occurred during login');
        }
    }
}
exports.LoginController = LoginController;
exports.default = new LoginController();
//# sourceMappingURL=login.controller.js.map