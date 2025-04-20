"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const find_user_by_email_1 = require("./find-user-by-email");
const verify_password_1 = require("./verify-password");
const update_last_login_1 = require("./update-last-login");
const format_user_response_1 = require("./format-user-response");
const generate_token_1 = require("../token/generate-token");
/**
 * Login a user
 */
async function login(loginData) {
    // Find the user by email
    const user = await (0, find_user_by_email_1.findUserByEmail)(loginData.email);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    // Check if the user is active
    if (!user.is_active) {
        throw new Error('User account is inactive');
    }
    // Verify the password
    const isPasswordValid = await (0, verify_password_1.verifyPassword)(loginData.password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    // Update last login timestamp
    await (0, update_last_login_1.updateLastLogin)(user.id);
    // Generate JWT token
    const token = (0, generate_token_1.generateToken)(user);
    // Format user response
    const userResponse = (0, format_user_response_1.formatUserResponse)(user);
    return {
        token,
        user: userResponse
    };
}
//# sourceMappingURL=login.js.map