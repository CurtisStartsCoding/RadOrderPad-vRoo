import { Response } from 'express';
import locationService from '../../../services/location';
import { 
  AuthenticatedRequest, 
  ControllerHandler,
  checkAuthentication,
  validateLocationId,
  handleControllerError
} from '../types';

/**
 * Deactivate a location (soft delete)
 * @param req Express request object
 * @param res Express response object
 */
export const deactivateLocation: ControllerHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!checkAuthentication(req, res)) {
      return;
    }
    
    // Validate location ID
    if (!validateLocationId(req, res)) {
      return;
    }
    
    const orgId = req.user!.orgId;
    const locationId = parseInt(req.params.locationId);
    
    try {
      const success = await locationService.deactivateLocation(locationId, orgId);
      
      if (success) {
        res.status(200).json({ 
          message: 'Location deactivated successfully',
          locationId
        });
      } else {
        res.status(404).json({ message: 'Location not found or already deactivated' });
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
    handleControllerError(res, error, 'Failed to deactivate location');
  }
};

export default deactivateLocation;