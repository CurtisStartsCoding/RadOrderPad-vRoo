import { Request, Response } from 'express';
import enhancedLogger from '../../utils/enhanced-logger';
import BillingService from '../../services/billing';

/**
 * Get credit usage history for the authenticated user's organization
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function getCreditUsageHistory(req: Request, res: Response): Promise<void> {
  try {
    // Get organization ID from the authenticated user
    const orgId = req.user?.orgId;
    
    // If no organization ID is found, return 401 Unauthorized
    if (!orgId) {
      enhancedLogger.warn('No organization ID found in request when getting credit usage history');
      res.status(401).json({
        success: false,
        message: 'Unauthorized - User not associated with an organization'
      });
      return;
    }
    
    // Extract pagination parameters from query
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    
    // Extract sorting parameters
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;
    
    // Extract filtering parameters
    const actionType = req.query.actionType as string | undefined;
    const dateStart = req.query.dateStart as string | undefined;
    const dateEnd = req.query.dateEnd as string | undefined;
    
    // Get credit usage history from the service
    const result = await BillingService.getCreditUsageHistory(orgId, {
      page,
      limit,
      sortBy,
      sortOrder,
      actionType,
      dateStart,
      dateEnd
    });
    
    // Return the credit usage history
    res.status(200).json({
      success: true,
      data: result
    });
    
    enhancedLogger.info('Credit usage history retrieved successfully', { 
      orgId, 
      page, 
      limit,
      totalResults: result.pagination.total
    });
  } catch (error) {
    // Log the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    enhancedLogger.error('Error getting credit usage history', { 
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