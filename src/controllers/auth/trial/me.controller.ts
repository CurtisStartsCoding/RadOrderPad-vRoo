import { Request, Response } from 'express';
import authService from '../../../services/auth';
import { TrialUserProfileResult } from '../../../services/auth/trial/get-trial-user-profile.service';
import enhancedLogger from '../../../utils/enhanced-logger';

// Import types to ensure Express Request interface is extended
import '../../../middleware/auth/types';

/**
 * Controller for handling trial user profile retrieval
 */
export class TrialMeController {
  /**
   * Get the authenticated trial user's profile
   */
  async getTrialMe(req: Request, res: Response): Promise<void> {
    try {
      // Check if user exists in request (set by authenticateJWT middleware)
      if (!req.user) {
        res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
        return;
      }
      
      // Check if the user is a trial user
      if (!req.user.isTrial || !req.user.trialUserId) {
        res.status(403).json({ 
          success: false, 
          message: 'Access denied. This endpoint is only for trial users.' 
        });
        return;
      }
      
      // Get the trial user ID from the request
      const trialUserId = req.user.trialUserId;
      
      // Call service to get trial user profile
      const result: TrialUserProfileResult | null = await authService.getTrialUserProfile(trialUserId);
      
      // If user not found, return 404
      if (!result) {
        res.status(404).json({ 
          success: false, 
          message: 'Trial user not found' 
        });
        return;
      }
      
      // Return the user profile and trial info
      res.status(200).json({
        success: true,
        user: result.user,
        trialInfo: result.trialInfo
      });
    } catch (error) {
      enhancedLogger.error('Error in trial user profile retrieval:', error);
      
      // Generic error
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while retrieving trial user profile. Please try again later.' 
      });
    }
  }
}

export default new TrialMeController();