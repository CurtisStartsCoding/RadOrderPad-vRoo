import { Response } from 'express';
import { searchOrganizations, OrganizationSearchFilters } from '../../services/organization/search-organizations.service.js';
import {
  AuthenticatedRequest,
  ControllerHandler
} from './types.js';
import enhancedLogger from '../../utils/enhanced-logger.js';

/**
 * Controller for searching organizations
 * 
 * @param req Express request object
 * @param res Express response object
 */
export const searchOrganizationsController: ControllerHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Get the requesting organization ID from the authenticated user
    const requestingOrgId = req.user?.orgId;
    
    if (!requestingOrgId) {
      enhancedLogger.error('Unauthorized: Organization ID not found in user object');
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Organization ID not found'
      });
      return;
    }
    
    // Extract search parameters from query string
    const { name, npi, type, city, state } = req.query as {
      name?: string;
      npi?: string;
      type?: string;
      city?: string;
      state?: string;
    };
    
    // Build filters object
    const filters: OrganizationSearchFilters = {};
    
    if (typeof name === 'string' && name.trim() !== '') {
      filters.name = name.trim();
    }
    
    if (typeof npi === 'string' && npi.trim() !== '') {
      filters.npi = npi.trim();
    }
    
    if (typeof type === 'string' && type.trim() !== '') {
      filters.type = type.trim();
    }
    
    if (typeof city === 'string' && city.trim() !== '') {
      filters.city = city.trim();
    }
    
    if (typeof state === 'string' && state.trim() !== '') {
      filters.state = state.trim();
    }
    
    enhancedLogger.debug(`Searching organizations with filters: ${JSON.stringify(filters)}`);
    
    // Call the service to search for organizations
    const organizations = await searchOrganizations(requestingOrgId, filters);
    
    // Return the results
    res.status(200).json({
      success: true,
      data: organizations
    });
  } catch (error) {
    enhancedLogger.error(`Error searching organizations: ${error instanceof Error ? error.message : String(error)}`);
    res.status(500).json({
      success: false,
      message: 'An error occurred while searching for organizations'
    });
  }
};

export default searchOrganizationsController;