import { User } from '../types';
import { generateToken as generateJwtToken } from '../../../utils/token.utils';

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
  return generateJwtToken(user);
}