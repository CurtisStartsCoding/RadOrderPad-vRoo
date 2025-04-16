import { listUserLocations as listUserLocationsQuery } from '../../queries';
import { LocationResponse } from '../../types';

/**
 * List locations assigned to a user
 * @param userId User ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with locations list
 */
export async function listUserLocations(userId: number, orgId: number): Promise<LocationResponse[]> {
  return listUserLocationsQuery(userId, orgId);
}