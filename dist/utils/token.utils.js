"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generate a JWT token for a user
 * @param user User object
 * @returns JWT token string
 */
function generateToken(user) {
    const payload = {
        userId: user.id,
        orgId: user.organization_id,
        role: user.role,
        email: user.email
    };
    const secret = process.env.JWT_SECRET || 'default_jwt_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    // Use any type to bypass TypeScript errors
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
//# sourceMappingURL=token.utils.js.map