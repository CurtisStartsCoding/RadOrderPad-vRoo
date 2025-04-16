"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeOrganization = exports.authorizeRole = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware to authenticate JWT tokens
 */
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
    try {
        console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 3) + '...');
        console.log('Token:', token.substring(0, 10) + '...');
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('JWT verification error:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateJWT = authenticateJWT;
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
//# sourceMappingURL=auth.middleware.js.map