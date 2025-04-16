import { LocationData, LocationResponse } from './types';
/**
 * List locations for an organization
 * @param orgId Organization ID
 * @returns Promise with locations list
 */
export declare function listLocations(orgId: number): Promise<LocationResponse[]>;
/**
 * Create a new location for an organization
 * @param orgId Organization ID
 * @param locationData Location data
 * @returns Promise with created location
 */
export declare function createLocation(orgId: number, locationData: LocationData): Promise<LocationResponse>;
/**
 * Get a location by ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with location details
 */
export declare function getLocation(locationId: number, orgId: number): Promise<LocationResponse>;
/**
 * Update a location
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @param locationData Location data to update
 * @returns Promise with updated location
 */
export declare function updateLocation(locationId: number, orgId: number, locationData: LocationData): Promise<LocationResponse>;
/**
 * Deactivate a location (soft delete)
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with success status
 */
export declare function deactivateLocation(locationId: number, orgId: number): Promise<boolean>;
