"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeOrganization = void 0;
// Import types to ensure Express Request interface is extended
require("./types");
/**
 * Middleware to check if user belongs to the specified organization
 */
const authorizeOrganization = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const orgId = parseInt(req.params.orgId);
    if (isNaN(orgId)) {
        return res.status(400).json({ message: 'Invalid organization ID' });
    }
    if (req.user.orgId !== orgId && req.user.role !== 'super_admin') {
        return res.status(403).json({
            message: 'Access denied: You do not have permission to access this organization'
        });
    }
    next();
};
exports.authorizeOrganization = authorizeOrganization;
//# sourceMappingURL=authorize-organization.js.map