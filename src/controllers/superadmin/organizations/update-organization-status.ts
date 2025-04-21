import { Request, Response } from 'express';
import logger from '../../../utils/logger';
import { updateOrganizationStatus } from '../../../services/superadmin/organizations';

/**
 * Update an organization's status
 * PUT /api/superadmin/organizations/{orgId}/status
 */
export async function updateOrganizationStatusController(req: Request, res: Response): Promise<void> {
  try {
    const orgId = parseInt(req.params.orgId, 10);
    const { newStatus } = req.body;
    
    // Validate input
    if (!orgId || isNaN(orgId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid organization ID'
      });
      return;
    }
    
    if (!newStatus || !['active', 'purgatory', 'on_hold', 'terminated'].includes(newStatus)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, purgatory, on_hold, terminated'
      });
      return;
    }
    
    // Get admin user ID from authenticated user
    const adminUserId = req.user?.userId;
    
    if (!adminUserId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    
    // Call the service function
    const result = await updateOrganizationStatus(orgId, newStatus, adminUserId);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: `Organization status updated to ${newStatus}`,
      data: result
    });
  } catch (error) {
    logger.error(`Error updating organization status: ${error instanceof Error ? error.message : String(error)}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update organization status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}