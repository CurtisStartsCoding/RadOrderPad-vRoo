import { 
  listUserLocations,
  assignUserToLocation,
  unassignUserFromLocation
} from '../services';
import { LocationResponse } from '../types';

/**
 * Manager for user-location operations
 */
class UserLocationManager {
  /**
   * List locations assigned to a user
   * @param userId User ID
   * @param orgId Organization ID (for authorization)
   * @returns Promise with locations list
   */
  async listUserLocations(userId: number, orgId: number): Promise<LocationResponse[]> {
    return listUserLocations(userId, orgId);
  }
  
  /**
   * Assign a user to a location
   * @param userId User ID
   * @param locationId Location ID
   * @param orgId Organization ID (for authorization)
   * @returns Promise with success status
   */
  async assignUserToLocation(userId: number, locationId: number, orgId: number): Promise<boolean> {
    return assignUserToLocation(userId, locationId, orgId);
  }
  
  /**
   * Unassign a user from a location
   * @param userId User ID
   * @param locationId Location ID
   * @param orgId Organization ID (for authorization)
   * @returns Promise with success status
   */
  async unassignUserFromLocation(userId: number, locationId: number, orgId: number): Promise<boolean> {
    return unassignUserFromLocation(userId, locationId, orgId);
  }
}

export default new UserLocationManager();