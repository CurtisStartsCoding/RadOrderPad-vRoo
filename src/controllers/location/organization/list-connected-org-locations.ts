import { Response } from 'express';
import locationService from '../../../services/location';
import { 
  AuthenticatedRequest, 
  ControllerHandler,
  checkAuthentication,
  handleControllerError
} from '../types';

/**
 * List locations for a connected organization
 * @param req Express request object with orgId parameter
 * @param res Express response object
 */
export const listConnectedOrgLocations: ControllerHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!checkAuthentication(req, res)) {
      return;
    }
    
    const { orgId } = req.params;
    const requestingOrgId = req.user!.orgId;

    if (!orgId) {
      res.status(400).json({
        success: false,
        error: 'Organization ID is required'
      });
      return;
    }

    const targetOrgId = parseInt(orgId, 10);
    if (isNaN(targetOrgId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid organization ID'
      });
      return;
    }

    const locations = await locationService.listConnectedOrgLocations(requestingOrgId, targetOrgId);

    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'No active connection exists between organizations') {
      res.status(403).json({
        success: false,
        error: 'No active connection exists between organizations'
      });
      return;
    }
    
    handleControllerError(res, error, 'Error listing connected organization locations');
  }
};

export default listConnectedOrgLocations;