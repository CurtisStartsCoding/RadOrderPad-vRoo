import { generateToken as generateJwtToken } from '../../../utils/token.utils';
/**
 * Generate a JWT token for a user
 */
export function generateToken(user) {
    return generateJwtToken(user);
}
//# sourceMappingURL=generate-token.js.map