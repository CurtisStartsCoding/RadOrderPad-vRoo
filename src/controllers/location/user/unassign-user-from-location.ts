import { Response } from 'express';
import locationService from '../../../services/location';
import { 
  AuthenticatedRequest, 
  ControllerHandler,
  checkAuthentication,
  validateUserAndLocationIds,
  handleControllerError
} from '../types';

/**
 * Unassign a user from a location
 * @param req Express request object
 * @param res Express response object
 */
export const unassignUserFromLocation: ControllerHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!checkAuthentication(req, res)) {
      return;
    }
    
    // Validate user and location IDs
    if (!validateUserAndLocationIds(req, res)) {
      return;
    }
    
    const orgId = req.user!.orgId;
    const userId = parseInt(req.params.userId);
    const locationId = parseInt(req.params.locationId);
    
    try {
      const success = await locationService.unassignUserFromLocation(userId, locationId, orgId);
      
      if (success) {
        res.status(200).json({ 
          message: 'User unassigned from location successfully',
          userId,
          locationId
        });
      } else {
        res.status(404).json({ message: 'User-location assignment not found' });
      }
    } catch (error) {
      // Handle not found or not authorized
      if ((error as Error).message.includes('not found or not authorized')) {
        res.status(404).json({ message: (error as Error).message });
      } else {
        throw error;
      }
    }
  } catch (error) {
    handleControllerError(res, error, 'Failed to unassign user from location');
  }
};

export default unassignUserFromLocation;