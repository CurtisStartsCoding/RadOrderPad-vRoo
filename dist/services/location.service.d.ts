/**
 * Interface for location data
 */
interface LocationData {
    name: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone_number?: string;
}
/**
 * Interface for location response
 */
interface LocationResponse {
    id: number;
    organization_id: number;
    name: string;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    phone_number: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
/**
 * Service for handling location operations
 */
declare class LocationService {
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
    /**
     * List locations assigned to a user
     * @param userId User ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with locations list
     */
    listUserLocations(userId: number, orgId: number): Promise<LocationResponse[]>;
    /**
     * Assign a user to a location
     * @param userId User ID
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with success status
     */
    assignUserToLocation(userId: number, locationId: number, orgId: number): Promise<boolean>;
    /**
     * Unassign a user from a location
     * @param userId User ID
     * @param locationId Location ID
     * @param orgId Organization ID (for authorization)
     * @returns Promise with success status
     */
    unassignUserFromLocation(userId: number, locationId: number, orgId: number): Promise<boolean>;
}
declare const _default: LocationService;
export default _default;
