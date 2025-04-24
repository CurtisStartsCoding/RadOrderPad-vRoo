import { Request, Response } from 'express';
import { getUserProfile } from '../services/user';
import enhancedLogger from '../utils/enhanced-logger';

/**
 * Controller for user profile operations
 */
const userController = {
  /**
   * Get the profile of the currently authenticated user
   * @param req Express request object
   * @param res Express response object
   */
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from the authenticated user
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'User authentication required' 
        });
        return;
      }
      
      // Call the service to get the user profile
      const userProfile = await getUserProfile(userId);
      
      if (!userProfile) {
        res.status(404).json({ 
          success: false,
          message: 'User profile not found' 
        });
        return;
      }
      
      // Return the user profile
      res.status(200).json({
        success: true,
        data: userProfile
      });
    } catch (error) {
      enhancedLogger.error('Error getting user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile',
        error: (error as Error).message
      });
    }
  }
};

export default userController;