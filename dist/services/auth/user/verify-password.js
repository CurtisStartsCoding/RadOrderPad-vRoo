import bcrypt from 'bcrypt';
/**
 * Verify a password against a hash
 */
export async function verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}
//# sourceMappingURL=verify-password.js.map