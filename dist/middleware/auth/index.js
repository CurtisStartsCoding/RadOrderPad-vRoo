"use strict";
/**
 * Authentication and authorization middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeOrganization = exports.authorizeRole = exports.authenticateJWT = void 0;
// Import types to ensure Express Request interface is extended
require("./types");
// Export individual middleware functions
var authenticate_jwt_1 = require("./authenticate-jwt");
Object.defineProperty(exports, "authenticateJWT", { enumerable: true, get: function () { return authenticate_jwt_1.authenticateJWT; } });
var authorize_role_1 = require("./authorize-role");
Object.defineProperty(exports, "authorizeRole", { enumerable: true, get: function () { return authorize_role_1.authorizeRole; } });
var authorize_organization_1 = require("./authorize-organization");
Object.defineProperty(exports, "authorizeOrganization", { enumerable: true, get: function () { return authorize_organization_1.authorizeOrganization; } });
// Default export for backward compatibility
const authenticate_jwt_2 = require("./authenticate-jwt");
const authorize_role_2 = require("./authorize-role");
const authorize_organization_2 = require("./authorize-organization");
exports.default = {
    authenticateJWT: authenticate_jwt_2.authenticateJWT,
    authorizeRole: authorize_role_2.authorizeRole,
    authorizeOrganization: authorize_organization_2.authorizeOrganization
};
//# sourceMappingURL=index.js.map