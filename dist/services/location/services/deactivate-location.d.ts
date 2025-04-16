/**
 * Deactivate a location (soft delete)
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export declare function deactivateLocation(locationId: number, orgId: number): Promise<boolean>;
