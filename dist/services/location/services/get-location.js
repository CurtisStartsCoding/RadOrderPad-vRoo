import { getLocation as getLocationQuery } from '../queries';
/**
 * Get a location by ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with location details
 */
export async function getLocation(locationId, orgId) {
    return getLocationQuery(locationId, orgId);
}
//# sourceMappingURL=get-location.js.map