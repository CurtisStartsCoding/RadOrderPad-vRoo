import authService from '../../services/auth';
import { handleAuthError, loginErrorMap } from './error-handler';
/**
 * Controller for handling user login
 */
export class LoginController {
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
            const result = await authService.login(loginData);
            res.status(200).json(result);
        }
        catch (error) {
            handleAuthError(error, res, 'Login', loginErrorMap, 'An error occurred during login');
        }
    }
}
export default new LoginController();
//# sourceMappingURL=login.controller.js.map