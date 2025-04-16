import { listLocations as listLocationsQuery } from '../queries';
import { LocationResponse } from '../types';

/**
 * List locations for an organization
 * @param orgId Organization ID
 * @returns Promise with locations list
 */
export async function listLocations(orgId: number): Promise<LocationResponse[]> {
  return listLocationsQuery(orgId);
}