import { Request, Response } from 'express';
import { AuthenticatedRequest } from './types.js';
import { getMyOrganizationController } from './get-my-organization.js';
import { updateMyOrganizationController } from './update-my-organization.controller.js';
import { searchOrganizationsController } from './search-organizations.controller.js';

/**
 * Controller for handling organization-related requests
 */
class OrganizationController {
  /**
   * Get details of the authenticated user's organization
   * @param req Express request object
   * @param res Express response object
   */
  async getMyOrganization(req: Request, res: Response): Promise<void> {
    return getMyOrganizationController(req as AuthenticatedRequest, res);
  }

  /**
   * Update the authenticated user's organization profile
   * @param req Express request object
   * @param res Express response object
   */
  async updateMyOrganization(req: Request, res: Response): Promise<void> {
    return updateMyOrganizationController(req as AuthenticatedRequest, res);
  }

  /**
   * Search for organizations based on provided filters
   * @param req Express request object
   * @param res Express response object
   */
  async searchOrganizations(req: Request, res: Response): Promise<void> {
    return searchOrganizationsController(req as AuthenticatedRequest, res);
  }
}

export default new OrganizationController();

// Also export the individual controllers for direct use
export * from './get-my-organization.js';
export * from './update-my-organization.controller.js';
export * from './search-organizations.controller.js';