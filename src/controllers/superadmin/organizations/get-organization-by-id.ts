import { Request, Response } from 'express';
import { getOrganizationById } from '../../../services/superadmin';
import logger from '../../../utils/logger';

/**
 * Get an organization by ID
 * GET /api/superadmin/organizations/:orgId
 */
export async function getOrganizationByIdController(req: Request, res: Response): Promise<void> {
  try {
    // Extract organization ID from request parameters
    const orgId = parseInt(req.params.orgId, 10);
    
    if (isNaN(orgId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid organization ID'
      });
      return;
    }
    
    // Call the service function
    const organization = await getOrganizationById(orgId);
    
    if (!organization) {
      res.status(404).json({
        success: false,
        message: `Organization with ID ${orgId} not found`
      });
      return;
    }
    
    // Return the organization
    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (error) {
    logger.error('Error in getOrganizationByIdController:', {
      error,
      orgId: req.params.orgId
    });
    res.status(500).json({
      success: false,
      message: 'Failed to get organization',
      error: (error as Error).message
    });
  }
}