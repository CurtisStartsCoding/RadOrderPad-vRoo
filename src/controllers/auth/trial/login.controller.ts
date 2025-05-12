import { Request, Response } from 'express';
import authService from '../../../services/auth';
import { TrialLoginResult } from '../../../services/auth/trial/login-trial-user.service';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Controller for handling trial user login
 */
export class TrialLoginController {
  /**
   * Login a trial user
   */
  async loginTrialUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }
      
      // Call service to login trial user
      const result: TrialLoginResult = await authService.loginTrialUser(email, password);
      
      res.status(200).json({
        success: true,
        token: result.token,
        trialInfo: result.trialInfo
      });
    } catch (error) {
      enhancedLogger.error('Error in trial user login:', error);
      
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes('Invalid trial email or password')) {
          res.status(401).json({ 
            success: false, 
            message: 'Invalid email or password for trial account.' 
          });
          return;
        }
      }
      
      // Generic error
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred during trial login. Please try again later.' 
      });
    }
  }
}

export default new TrialLoginController();