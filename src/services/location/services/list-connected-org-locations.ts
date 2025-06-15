import { hasActiveConnection } from '../queries/connection/has-active-connection';
import { listLocations as listLocationsQuery } from '../queries';
import { LocationResponse } from '../types';

/**
 * List locations for a connected organization
 * @param requestingOrgId The ID of the requesting organization
 * @param targetOrgId The ID of the target organization
 * @returns Promise with locations list
 */
export async function listConnectedOrgLocations(
  requestingOrgId: number,
  targetOrgId: number
): Promise<LocationResponse[]> {
  // Check if organizations have an active connection
  const hasConnection = await hasActiveConnection(requestingOrgId, targetOrgId);
  
  if (!hasConnection) {
    throw new Error('No active connection exists between organizations');
  }
  
  // If connection exists, fetch the target organization's locations
  return listLocationsQuery(targetOrgId);
}