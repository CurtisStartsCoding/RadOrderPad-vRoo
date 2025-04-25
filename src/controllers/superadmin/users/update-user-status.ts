import { Request, Response } from 'express';
import { updateUserStatus } from '../../../services/superadmin/users';
import logger from '../../../utils/logger';

/**
 * Update a user's active status
 * PUT /api/superadmin/users/{userId}/status
 */
export async function updateUserStatusController(req: Request, res: Response): Promise<void> {
  try {
    // Extract user ID from request parameters
    const userId = parseInt(req.params.userId, 10);
    const { isActive } = req.body;
    
    // Validate input
    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
      return;
    }
    
    if (typeof isActive !== 'boolean') {
      res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
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
    const updatedUser = await updateUserStatus(userId, isActive, adminUserId);
    
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      });
      return;
    }
    
    // Return the updated user
    res.status(200).json({
      success: true,
      message: `User status updated to ${isActive ? 'active' : 'inactive'}`,
      data: updatedUser
    });
  } catch (error) {
    logger.error('Error in updateUserStatusController:', {
      error,
      userId: req.params.userId,
      isActive: req.body.isActive
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: (error as Error).message
    });
  }
}