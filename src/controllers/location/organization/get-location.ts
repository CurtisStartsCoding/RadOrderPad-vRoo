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
 * Get details of a specific location
 * @param req Express request object
 * @param res Express response object
 */
export const getLocation: ControllerHandler = async (
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
      const location = await locationService.getLocation(locationId, orgId);
      res.status(200).json({ location });
    } catch (error) {
      // Handle not found or not authorized
      if ((error as Error).message.includes('not found or not authorized')) {
        res.status(404).json({ message: (error as Error).message });
      } else {
        throw error;
      }
    }
  } catch (error) {
    handleControllerError(res, error, 'Failed to get location');
  }
};

export default getLocation;