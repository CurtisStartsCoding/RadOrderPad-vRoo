/**
 * Re-export all authentication controller components
 */
export * from './error-handler';
export * from './register.controller';
export * from './login.controller';
// Import controllers
import registerController from './register.controller';
import loginController from './login.controller';
/**
 * Combined AuthController class
 */
export class AuthController {
    constructor() {
        /**
         * Register a new organization and admin user
         */
        this.register = registerController.register.bind(registerController);
        /**
         * Login a user
         */
        this.login = loginController.login.bind(loginController);
    }
}
// Export a singleton instance
export default new AuthController();
//# sourceMappingURL=index.js.map