"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../../utils/logger"));
// Import types to ensure Express Request interface is extended
require("./types");
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
        logger_1.default.debug('JWT Secret:', { secretPrefix: process.env.JWT_SECRET?.substring(0, 3) + '...' });
        logger_1.default.debug('Token:', { tokenPrefix: token.substring(0, 10) + '...' });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
        logger_1.default.debug('Decoded token:', { userId: decoded.userId, role: decoded.role });
        if (decoded.isTrial === true && decoded.trialUserId) {
            req.user = {
                userId: decoded.trialUserId, // Map trialUserId to userId for simplicity downstream
                orgId: 0, // No org for trial users
                role: 'trial_physician', // Assign a specific role
                email: decoded.email,
                isTrial: true, // Add the flag
                specialty: decoded.specialty, // Pass specialty along
                trialUserId: decoded.trialUserId // Keep the original trialUserId
            };
        }
        else {
            req.user = {
                userId: decoded.userId,
                orgId: decoded.orgId,
                role: decoded.role,
                email: decoded.email,
                isTrial: false // Explicitly false
            };
        }
        next();
    }
    catch (error) {
        logger_1.default.error('JWT verification error:', { error });
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateJWT = authenticateJWT;
//# sourceMappingURL=authenticate-jwt.js.map