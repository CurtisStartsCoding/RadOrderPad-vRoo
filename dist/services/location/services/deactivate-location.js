import { deactivateLocation as deactivateLocationQuery } from '../queries';
/**
 * Deactivate a location (soft delete)
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export async function deactivateLocation(locationId, orgId) {
    return deactivateLocationQuery(locationId, orgId);
}
//# sourceMappingURL=deactivate-location.js.map