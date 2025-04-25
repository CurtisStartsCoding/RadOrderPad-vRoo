import { UserWithLocations } from '../types';
/**
 * Get a user by ID
 *
 * @param userId User ID
 * @returns Promise with user details or null if not found
 */
export declare function getUserById(userId: number): Promise<UserWithLocations | null>;
