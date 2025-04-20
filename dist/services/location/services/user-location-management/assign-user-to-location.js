import { assignUserToLocation as assignUserToLocationQuery } from '../../queries';
/**
 * Assign a user to a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export async function assignUserToLocation(userId, locationId, orgId) {
    return assignUserToLocationQuery(userId, locationId, orgId);
}
//# sourceMappingURL=assign-user-to-location.js.map