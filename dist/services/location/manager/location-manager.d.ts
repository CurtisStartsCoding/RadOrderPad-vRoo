import { LocationData, LocationResponse } from '../types';
/**
 * Manager for location operations
 */
declare class LocationManager {
    /**
     * List locations for an organization
     * @param orgId Organization ID
     * @returns Promise with locations list
     */
    listLocations(orgId: number): Promise<LocationResponse[]>;
    /**
     * Create a new location for an organization
     * @param orgId Organization ID
     * @param locationData Location data
     * @returns Promise with created location
     */
    createLocation(orgId: number, locationData: LocationData): Promise<LocationResponse>;
    /**
     * Get a location by ID
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with location details
     */
    getLocation(locationId: number, orgId: number): Promise<LocationResponse>;
    /**
     * Update a location
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @param locationData Location data to update
     * @returns Promise with updated location
     */
    updateLocation(locationId: number, orgId: number, locationData: LocationData): Promise<LocationResponse>;
    /**
     * Deactivate a location (soft delete)
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with success status
     */
    deactivateLocation(locationId: number, orgId: number): Promise<boolean>;
}
declare const _default: LocationManager;
export default _default;
