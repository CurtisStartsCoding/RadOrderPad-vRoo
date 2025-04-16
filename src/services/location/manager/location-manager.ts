import { 
  listLocations,
  createLocation,
  getLocation,
  updateLocation,
  deactivateLocation
} from '../services';
import { LocationData, LocationResponse } from '../types';

/**
 * Manager for location operations
 */
class LocationManager {
  /**
   * List locations for an organization
   * @param orgId Organization ID
   * @returns Promise with locations list
   */
  async listLocations(orgId: number): Promise<LocationResponse[]> {
    return listLocations(orgId);
  }
  
  /**
   * Create a new location for an organization
   * @param orgId Organization ID
   * @param locationData Location data
   * @returns Promise with created location
   */
  async createLocation(orgId: number, locationData: LocationData): Promise<LocationResponse> {
    return createLocation(orgId, locationData);
  }
  
  /**
   * Get a location by ID
   * @param locationId Location ID
   * @param orgId Organization ID (for authorization)
   * @returns Promise with location details
   */
  async getLocation(locationId: number, orgId: number): Promise<LocationResponse> {
    return getLocation(locationId, orgId);
  }
  
  /**
   * Update a location
   * @param locationId Location ID
   * @param orgId Organization ID (for authorization)
   * @param locationData Location data to update
   * @returns Promise with updated location
   */
  async updateLocation(locationId: number, orgId: number, locationData: LocationData): Promise<LocationResponse> {
    return updateLocation(locationId, orgId, locationData);
  }
  
  /**
   * Deactivate a location (soft delete)
   * @param locationId Location ID
   * @param orgId Organization ID (for authorization)
   * @returns Promise with success status
   */
  async deactivateLocation(locationId: number, orgId: number): Promise<boolean> {
    return deactivateLocation(locationId, orgId);
  }
}

export default new LocationManager();