import { Request, Response } from 'express';
import authService from '../../../services/auth';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Controller for handling trial user password updates
 */
export class TrialPasswordController {
  /**
   * Update a trial user's password
   */
  async updateTrialPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, newPassword } = req.body;
      
      // Validate required fields
      if (!email || !newPassword) {
        res.status(400).json({ 
          success: false, 
          message: 'Email and new password are required.' 
        });
        return;
      }
      
      // Validate password strength
      if (newPassword.length < 8) {
        res.status(400).json({ 
          success: false, 
          message: 'Password must be at least 8 characters long.' 
        });
        return;
      }
      
      // Call service to update trial user password
      const _result = await authService.updateTrialUserPassword(email, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Trial user password updated successfully.'
      });
    } catch (error) {
      enhancedLogger.error('Error in trial user password update:', error);
      
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes('Trial user not found')) {
          res.status(404).json({ 
            success: false, 
            message: 'Trial account with this email not found.' 
          });
          return;
        }
      }
      
      // Generic error
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while updating the password.' 
      });
    }
  }
}

export default new TrialPasswordController();