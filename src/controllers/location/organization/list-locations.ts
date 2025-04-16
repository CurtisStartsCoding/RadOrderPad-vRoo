import { Response } from 'express';
import locationService from '../../../services/location';
import { 
  AuthenticatedRequest, 
  ControllerHandler,
  checkAuthentication,
  handleControllerError
} from '../types';

/**
 * List locations for the authenticated user's organization
 * @param req Express request object
 * @param res Express response object
 */
export const listLocations: ControllerHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!checkAuthentication(req, res)) {
      return;
    }
    
    const orgId = req.user!.orgId;
    const locations = await locationService.listLocations(orgId);
    
    res.status(200).json({ locations });
  } catch (error) {
    handleControllerError(res, error, 'Failed to list locations');
  }
};

export default listLocations;