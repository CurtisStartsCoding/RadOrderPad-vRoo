import { LocationResponse } from '../types';
/**
 * Get a location by ID
 * @param locationId Location ID
 * @param orgId Organization ID (for authorization)
 * @returns Promise with location details
 */
export declare function getLocation(locationId: number, orgId: number): Promise<LocationResponse>;
