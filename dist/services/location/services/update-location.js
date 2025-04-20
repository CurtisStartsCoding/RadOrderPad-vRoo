import { updateLocation as updateLocationQuery } from '../queries';
/**
 * Update a location
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @param locationData Location data to update
 * @returns Promise with updated location
 */
export async function updateLocation(locationId, orgId, locationData) {
    return updateLocationQuery(locationId, orgId, locationData);
}
//# sourceMappingURL=update-location.js.map