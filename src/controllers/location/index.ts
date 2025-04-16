import { Request, Response } from 'express';
import { AuthenticatedRequest } from './types';
import * as organizationControllers from './organization';
import * as userControllers from './user';

/**
 * Controller for handling location-related requests
 */
class LocationController {
  /**
   * List locations for the authenticated user's organization
   * @param req Express request object
   * @param res Express response object
   */
  async listLocations(req: Request, res: Response): Promise<void> {
    return organizationControllers.listLocations(req as AuthenticatedRequest, res);
  }
  
  /**
   * Create a new location for the authenticated user's organization
   * @param req Express request object
   * @param res Express response object
   */
  async createLocation(req: Request, res: Response): Promise<void> {
    return organizationControllers.createLocation(req as AuthenticatedRequest, res);
  }
  
  /**
   * Get details of a specific location
   * @param req Express request object
   * @param res Express response object
   */
  async getLocation(req: Request, res: Response): Promise<void> {
    return organizationControllers.getLocation(req as AuthenticatedRequest, res);
  }
  
  /**
   * Update a location
   * @param req Express request object
   * @param res Express response object
   */
  async updateLocation(req: Request, res: Response): Promise<void> {
    return organizationControllers.updateLocation(req as AuthenticatedRequest, res);
  }
  
  /**
   * Deactivate a location (soft delete)
   * @param req Express request object
   * @param res Express response object
   */
  async deactivateLocation(req: Request, res: Response): Promise<void> {
    return organizationControllers.deactivateLocation(req as AuthenticatedRequest, res);
  }
  
  /**
   * List locations assigned to a user
   * @param req Express request object
   * @param res Express response object
   */
  async listUserLocations(req: Request, res: Response): Promise<void> {
    return userControllers.listUserLocations(req as AuthenticatedRequest, res);
  }
  
  /**
   * Assign a user to a location
   * @param req Express request object
   * @param res Express response object
   */
  async assignUserToLocation(req: Request, res: Response): Promise<void> {
    return userControllers.assignUserToLocation(req as AuthenticatedRequest, res);
  }
  
  /**
   * Unassign a user from a location
   * @param req Express request object
   * @param res Express response object
   */
  async unassignUserFromLocation(req: Request, res: Response): Promise<void> {
    return userControllers.unassignUserFromLocation(req as AuthenticatedRequest, res);
  }
}

export default new LocationController();

// Also export the individual controllers for direct use
export {
  organizationControllers,
  userControllers
};