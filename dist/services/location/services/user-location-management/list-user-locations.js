import { listUserLocations as listUserLocationsQuery } from '../../queries';
/**
 * List locations assigned to a user
 * @param userId User ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with locations list
 */
export async function listUserLocations(userId, orgId) {
    return listUserLocationsQuery(userId, orgId);
}
//# sourceMappingURL=list-user-locations.js.map