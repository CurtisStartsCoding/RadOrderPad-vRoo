import { LocationResponse } from '../types';
/**
 * Manager for user-location operations
 */
declare class UserLocationManager {
    /**
     * List locations assigned to a user
     * @param userId User ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with locations list
     */
    listUserLocations(userId: number, orgId: number): Promise<LocationResponse[]>;
    /**
     * Assign a user to a location
     * @param userId User ID
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with success status
     */
    assignUserToLocation(userId: number, locationId: number, orgId: number): Promise<boolean>;
    /**
     * Unassign a user from a location
     * @param userId User ID
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with success status
     */
    unassignUserFromLocation(userId: number, locationId: number, orgId: number): Promise<boolean>;
}
declare const _default: UserLocationManager;
export default _default;
