"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
// Import types to ensure Express Request interface is extended
require("./types");
/**
 * Middleware to check if user has required role
 */
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        console.log('User role:', req.user.role);
        console.log('Required roles:', roles);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied: Insufficient permissions',
                requiredRoles: roles,
                userRole: req.user.role
            });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=authorize-role.js.map