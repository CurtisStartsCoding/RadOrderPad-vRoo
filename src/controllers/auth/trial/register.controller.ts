import { Request, Response } from 'express';
import authService from '../../../services/auth';
import { TrialRegisterResult } from '../../../services/auth/trial/register-trial-user.service';
import { validateEmail } from '../../../utils/validation';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Controller for handling trial user registration
 */
export class TrialRegisterController {
  /**
   * Register a new trial user
   */
  async registerTrialUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, specialty } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }
      
      // Validate email format
      if (!validateEmail(email)) {
        res.status(400).json({ success: false, message: 'Invalid email format' });
        return;
      }
      
      // Validate password strength
      if (password.length < 8) {
        res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
        return;
      }
      
      // Call service to register trial user
      const result: TrialRegisterResult = await authService.registerTrialUser(
        email,
        password,
        firstName || '',
        lastName || '',
        specialty || ''
      );
      
      res.status(201).json({
        success: true,
        message: 'Trial account created.',
        token: result.token,
        trialInfo: result.trialInfo
      });
    } catch (error) {
      enhancedLogger.error('Error in trial user registration:', error);
      
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes('Email associated with a full account')) {
          res.status(409).json({ 
            success: false, 
            message: 'This email is already associated with a full account. Please use a different email.' 
          });
          return;
        }
        
        if (error.message.includes('Email already registered for a trial')) {
          res.status(409).json({ 
            success: false, 
            message: 'This email is already registered for a trial. Please login instead.' 
          });
          return;
        }
      }
      
      // Generic error
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred during trial registration. Please try again later.' 
      });
    }
  }
}

export default new TrialRegisterController();