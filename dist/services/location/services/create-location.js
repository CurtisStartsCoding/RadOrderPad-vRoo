import { createLocation as createLocationQuery } from '../queries';
/**
 * Create a new location for an organization
 * @param orgId Organization ID
 * @param locationData Location data
 * @returns Promise with created location
 */
export async function createLocation(orgId, locationData) {
    return createLocationQuery(orgId, locationData);
}
//# sourceMappingURL=create-location.js.map