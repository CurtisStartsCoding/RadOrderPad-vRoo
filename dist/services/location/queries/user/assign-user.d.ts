/**
 * Assign a user to a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export declare function assignUserToLocation(userId: number, locationId: number, orgId: number): Promise<boolean>;
