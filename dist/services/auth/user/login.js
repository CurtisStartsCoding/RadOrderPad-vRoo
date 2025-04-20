import { findUserByEmail } from './find-user-by-email';
import { verifyPassword } from './verify-password';
import { updateLastLogin } from './update-last-login';
import { formatUserResponse } from './format-user-response';
import { generateToken } from '../token/generate-token';
/**
 * Login a user
 */
export async function login(loginData) {
    // Find the user by email
    const user = await findUserByEmail(loginData.email);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    // Check if the user is active
    if (!user.is_active) {
        throw new Error('User account is inactive');
    }
    // Verify the password
    const isPasswordValid = await verifyPassword(loginData.password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    // Update last login timestamp
    await updateLastLogin(user.id);
    // Generate JWT token
    const token = generateToken(user);
    // Format user response
    const userResponse = formatUserResponse(user);
    return {
        token,
        user: userResponse
    };
}
//# sourceMappingURL=login.js.map