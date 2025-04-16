import { getLocation as getLocationQuery } from '../queries';
import { LocationResponse } from '../types';

/**
 * Get a location by ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with location details
 */
export async function getLocation(locationId: number, orgId: number): Promise<LocationResponse> {
  return getLocationQuery(locationId, orgId);
}