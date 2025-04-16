import { LocationData, LocationResponse } from '../../types';
/**
 * Create a new location for an organization
 * @param orgId Organization ID
 * @param locationData Location data
 * @returns Promise with created location
 */
export declare function createLocation(orgId: number, locationData: LocationData): Promise<LocationResponse>;
