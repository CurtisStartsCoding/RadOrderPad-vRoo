import { listLocations as listLocationsQuery } from '../queries';
/**
 * List locations for an organization
 * @param orgId Organization ID
 * @returns Promise with locations list
 */
export async function listLocations(orgId) {
    return listLocationsQuery(orgId);
}
//# sourceMappingURL=list-locations.js.map