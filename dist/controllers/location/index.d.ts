import { Request, Response } from 'express';
import * as organizationControllers from './organization';
import * as userControllers from './user';
/**
 * Controller for handling location-related requests
 */
declare class LocationController {
    /**
     * List locations for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    listLocations(req: Request, res: Response): Promise<void>;
    /**
     * Create a new location for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    createLocation(req: Request, res: Response): Promise<void>;
    /**
     * Get details of a specific location
     * @param req Express request object
     * @param res Express response object
     */
    getLocation(req: Request, res: Response): Promise<void>;
    /**
     * Update a location
     * @param req Express request object
     * @param res Express response object
     */
    updateLocation(req: Request, res: Response): Promise<void>;
    /**
     * Deactivate a location (soft delete)
     * @param req Express request object
     * @param res Express response object
     */
    deactivateLocation(req: Request, res: Response): Promise<void>;
    /**
     * List locations assigned to a user
     * @param req Express request object
     * @param res Express response object
     */
    listUserLocations(req: Request, res: Response): Promise<void>;
    /**
     * Assign a user to a location
     * @param req Express request object
     * @param res Express response object
     */
    assignUserToLocation(req: Request, res: Response): Promise<void>;
    /**
     * Unassign a user from a location
     * @param req Express request object
     * @param res Express response object
     */
    unassignUserFromLocation(req: Request, res: Response): Promise<void>;
}
declare const _default: LocationController;
export default _default;
export { organizationControllers, userControllers };
