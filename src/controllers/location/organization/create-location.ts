import { Response } from 'express';
import locationService from '../../../services/location';
import { 
  AuthenticatedRequest, 
  ControllerHandler,
  checkAuthentication,
  handleControllerError
} from '../types';

/**
 * Create a new location for the authenticated user's organization
 * @param req Express request object
 * @param res Express response object
 */
export const createLocation: ControllerHandler = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!checkAuthentication(req, res)) {
      return;
    }
    
    const orgId = req.user!.orgId;
    const locationData = req.body;
    
    // Validate required fields
    if (!locationData.name) {
      res.status(400).json({ message: 'Location name is required' });
      return;
    }
    
    const location = await locationService.createLocation(orgId, locationData);
    
    res.status(201).json({ 
      message: 'Location created successfully', 
      location 
    });
  } catch (error) {
    handleControllerError(res, error, 'Failed to create location');
  }
};

export default createLocation;