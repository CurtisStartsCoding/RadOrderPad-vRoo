import { updateLocation as updateLocationQuery } from '../queries';
import { LocationData, LocationResponse } from '../types';

/**
 * Update a location
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @param locationData Location data to update
 * @returns Promise with updated location
 */
export async function updateLocation(
  locationId: number, 
  orgId: number, 
  locationData: LocationData
): Promise<LocationResponse> {
  return updateLocationQuery(locationId, orgId, locationData);
}