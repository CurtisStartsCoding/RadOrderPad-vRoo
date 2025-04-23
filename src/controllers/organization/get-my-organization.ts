import { Response } from 'express';
import { getMyOrganization } from '../../services/organization/get-my-organization.js';
import {
  AuthenticatedRequest,
  ControllerHandler,
  checkAuthentication,
  handleControllerError
} from './types.js';

/**
 * Get details of the authenticated user's organization
 * @param req Express request object
 * @param res Express response object
 */
export const getMyOrganizationController: ControllerHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!checkAuthentication(req, res)) {
      return;
    }
    
    const orgId = req.user!.orgId;
    const result = await getMyOrganization(orgId);
    
    if (!result) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    handleControllerError(res, error, 'Failed to get organization details');
  }
};

export default getMyOrganizationController;