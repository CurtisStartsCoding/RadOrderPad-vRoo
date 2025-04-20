import { login } from './user';
import { registerOrganization } from './organization';
import { generateToken } from './token';
/**
 * Service for handling authentication-related operations
 */
export class AuthService {
    /**
     * Register a new organization and admin user
     */
    async registerOrganization(orgData, userData) {
        return registerOrganization(orgData, userData);
    }
    /**
     * Login a user
     */
    async login(loginData) {
        return login(loginData);
    }
    /**
     * Generate a JWT token for a user
     */
    generateToken(user) {
        return generateToken(user);
    }
}
// Export types
export * from './types';
// Export user functionality
export * from './user';
// Export organization functionality
export * from './organization';
// Export token functionality
export * from './token';
// Export default instance
export default new AuthService();
//# sourceMappingURL=index.js.map