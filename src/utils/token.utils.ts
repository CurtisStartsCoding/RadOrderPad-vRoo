import * as jwt from 'jsonwebtoken';
import { User, AuthTokenPayload } from '../models';

/**
 * Generate a JWT token for a user
 * @param user User object
 * @returns JWT token string
 */
export function generateToken(user: User): string {
  const payload: AuthTokenPayload = {
    userId: user.id,
    orgId: user.organization_id,
    role: user.role,
    email: user.email
  };
  
  const secret = process.env.JWT_SECRET || 'default_jwt_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  // Use any type to bypass TypeScript errors
  return (jwt as any).sign(payload, secret, { expiresIn });
}