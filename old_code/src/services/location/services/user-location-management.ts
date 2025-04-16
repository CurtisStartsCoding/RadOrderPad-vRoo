import { 
  listUserLocations as listUserLocationsQuery,
  assignUserToLocation as assignUserToLocationQuery,
  unassignUserFromLocation as unassignUserFromLocationQuery
} from '../queries';
import { LocationResponse } from '../types';

/**
 * List locations assigned to a user
 * @param userId User ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with locations list
 */
export async function listUserLocations(userId: number, orgId: number): Promise<LocationResponse[]> {
  return listUserLocationsQuery(userId, orgId);
}

/**
 * Assign a user to a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export async function assignUserToLocation(userId: number, locationId: number, orgId: number): Promise<boolean> {
  return assignUserToLocationQuery(userId, locationId, orgId);
}

/**
 * Unassign a user from a location
 * @param userId User ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export async function unassignUserFromLocation(userId: number, locationId: number, orgId: number): Promise<boolean> {
  return unassignUserFromLocationQuery(userId, locationId, orgId);
}