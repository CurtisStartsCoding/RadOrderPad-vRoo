import { LocationResponse } from '../../types';
/**
 * List locations for an organization
 * @param orgId Organization ID
 * @returns Promise with locations list
 */
export declare function listLocations(orgId: number): Promise<LocationResponse[]>;
