import { User } from '../types';
/**
 * Find a user by email
 */
export declare function findUserByEmail(email: string): Promise<User | null>;
