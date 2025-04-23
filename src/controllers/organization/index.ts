import { Request, Response } from 'express';
import { AuthenticatedRequest } from './types.js';
import { getMyOrganizationController } from './get-my-organization.js';

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
}

export default new OrganizationController();

// Also export the individual controllers for direct use
export * from './get-my-organization.js';