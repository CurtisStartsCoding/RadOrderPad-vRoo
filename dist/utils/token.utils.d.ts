import { User } from '../models';
/**
 * Generate a JWT token for a user
 * @param user User object
 * @returns JWT token string
 */
export declare function generateToken(user: User): string;
