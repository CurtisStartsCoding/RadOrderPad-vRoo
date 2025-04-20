/**
 * Authentication and authorization middleware
 */
// Import types to ensure Express Request interface is extended
import './types';
// Export individual middleware functions
export { authenticateJWT } from './authenticate-jwt';
export { authorizeRole } from './authorize-role';
export { authorizeOrganization } from './authorize-organization';
// Default export for backward compatibility
import { authenticateJWT } from './authenticate-jwt';
import { authorizeRole } from './authorize-role';
import { authorizeOrganization } from './authorize-organization';
export default {
    authenticateJWT,
    authorizeRole,
    authorizeOrganization
};
//# sourceMappingURL=index.js.map