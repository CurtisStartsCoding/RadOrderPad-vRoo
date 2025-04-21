import { Request, Response } from 'express';
import logger from '../../../utils/logger';
import { adjustOrganizationCredits } from '../../../services/superadmin/organizations';

/**
 * Adjust an organization's credit balance
 * POST /api/superadmin/organizations/{orgId}/credits/adjust
 */
export async function adjustOrganizationCreditsController(req: Request, res: Response): Promise<void> {
  try {
    const orgId = parseInt(req.params.orgId, 10);
    const { amount, reason } = req.body;
    
    // Validate input
    if (!orgId || isNaN(orgId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid organization ID'
      });
      return;
    }
    
    if (isNaN(Number(amount))) {
      res.status(400).json({
        success: false,
        message: 'Amount must be a number'
      });
      return;
    }
    
    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'A reason for the adjustment is required'
      });
      return;
    }
    
    // Get admin user ID from authenticated user
    // Assuming the auth middleware adds a user object to the request
    const adminUserId = req.user?.userId;
    
    if (!adminUserId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    
    // Call the service function
    const result = await adjustOrganizationCredits(orgId, Number(amount), reason, adminUserId);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: `Organization credit balance adjusted by ${amount}`,
      data: result
    });
  } catch (error) {
    logger.error(`Error adjusting organization credits: ${error instanceof Error ? error.message : String(error)}`);
    res.status(500).json({
      success: false,
      message: 'Failed to adjust organization credits',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}