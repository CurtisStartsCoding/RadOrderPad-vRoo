import { LocationResponse } from '../types';
/**
 * List locations assigned to a user
 * @param userId User ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with locations list
 */
export declare function listUserLocations(userId: number, orgId: number): Promise<LocationResponse[]>;
/**
 * Assign a user to a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export declare function assignUserToLocation(userId: number, locationId: number, orgId: number): Promise<boolean>;
/**
 * Unassign a user from a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export declare function unassignUserFromLocation(userId: number, locationId: number, orgId: number): Promise<boolean>;
