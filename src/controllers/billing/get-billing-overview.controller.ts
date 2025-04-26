import { Request, Response } from 'express';
import enhancedLogger from '../../utils/enhanced-logger';
import BillingService from '../../services/billing';

/**
 * Get billing overview for the authenticated user's organization
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function getBillingOverview(req: Request, res: Response): Promise<void> {
  try {
    // Get organization ID from the authenticated user
    const orgId = req.user?.orgId;
    
    // If no organization ID is found, return 401 Unauthorized
    if (!orgId) {
      enhancedLogger.warn('No organization ID found in request when getting billing overview');
      res.status(401).json({
        success: false,
        message: 'Unauthorized - User not associated with an organization'
      });
      return;
    }
    
    // Get billing overview from the service
    const result = await BillingService.getBillingOverview(orgId);
    
    // If no organization found, return 404 Not Found
    if (!result) {
      enhancedLogger.warn('Organization not found when getting billing overview', { orgId });
      res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
      return;
    }
    
    // Return the billing overview
    res.status(200).json({
      success: true,
      data: result
    });
    
    enhancedLogger.info('Billing overview retrieved successfully', { 
      orgId
    });
  } catch (error) {
    // Log the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    enhancedLogger.error('Error getting billing overview', { 
      error: errorMessage,
      orgId: req.user?.orgId
    });
    
    // Return 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}