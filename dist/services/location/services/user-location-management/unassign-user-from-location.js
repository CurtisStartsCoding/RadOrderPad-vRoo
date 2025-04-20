import { unassignUserFromLocation as unassignUserFromLocationQuery } from '../../queries';
/**
 * Unassign a user from a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export async function unassignUserFromLocation(userId, locationId, orgId) {
    return unassignUserFromLocationQuery(userId, locationId, orgId);
}
//# sourceMappingURL=unassign-user-from-location.js.map