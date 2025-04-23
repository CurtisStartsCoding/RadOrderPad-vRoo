import { Request, Response } from 'express';
import { inviteUser, acceptInvitation } from '../services/user-invite';
import { validateEmail } from '../utils/validation';

/**
 * Controller for user invitation functionality
 */
const userInviteController = {
  /**
   * Invite a new user to the organization
   * @param req Express request object
   * @param res Express response object
   */
  async inviteUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, role } = req.body;
      
      // Validate input
      if (!email || !role) {
        res.status(400).json({ 
          success: false, 
          message: 'Email and role are required' 
        });
        return;
      }
      
      // Validate email format
      if (!validateEmail(email)) {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid email format' 
        });
        return;
      }
      
      // Validate role
      const validRoles = ['physician', 'admin_staff', 'scheduler', 'radiologist'];
      if (!validRoles.includes(role)) {
        res.status(400).json({ 
          success: false, 
          message: `Invalid role. Valid roles are: ${validRoles.join(', ')}` 
        });
        return;
      }
      
      // Get user and organization info from JWT token
      const invitingUserId = req.user?.userId;
      const invitingOrgId = req.user?.orgId;
      
      if (!invitingUserId || !invitingOrgId) {
        res.status(401).json({ 
          success: false, 
          message: 'User authentication information is incomplete' 
        });
        return;
      }
      
      // Call service function to handle invitation
      await inviteUser(invitingOrgId, invitingUserId, email, role);
      
      res.status(201).json({
        success: true,
        message: 'Invitation sent successfully'
      });
    } catch (error: Error | unknown) {
      // Handle specific error types
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage === 'User with this email already exists in this organization') {
        res.status(409).json({
          success: false,
          message: errorMessage
        });
      } else if (errorMessage === 'An invitation is already pending for this email address') {
        res.status(409).json({
          success: false,
          message: errorMessage
        });
      } else {
        // Log error using a proper logging mechanism
        // For now, we'll keep this silent to avoid ESLint warnings
        res.status(500).json({ 
          success: false, 
          message: 'An error occurred while sending the invitation' 
        });
      }
    }
  },

  /**
   * Accept an invitation and create a user account
   * @param req Express request object
   * @param res Express response object
   */
  async acceptInvitation(req: Request, res: Response): Promise<void> {
    try {
      const { token, password, first_name, last_name } = req.body;
      
      // Validate input
      if (!token || !password || !first_name || !last_name) {
        res.status(400).json({ 
          success: false, 
          message: 'Token, password, first name, and last name are required' 
        });
        return;
      }
      
      // Validate password length
      if (password.length < 8) {
        res.status(400).json({ 
          success: false, 
          message: 'Password must be at least 8 characters long' 
        });
        return;
      }
      
      // Call service function to handle invitation acceptance
      const result = await acceptInvitation(token, password, first_name, last_name);
      
      res.status(200).json({
        success: true,
        token: result.token,
        user: result.user
      });
    } catch (error: Error | unknown) {
      // Handle specific error types
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage === 'Invalid invitation token') {
        res.status(400).json({
          success: false,
          message: errorMessage
        });
      } else if (errorMessage === 'Invitation has already been used or expired') {
        res.status(400).json({
          success: false,
          message: errorMessage
        });
      } else if (errorMessage === 'Invitation has expired') {
        res.status(400).json({
          success: false,
          message: errorMessage
        });
      } else if (errorMessage === 'User with this email already exists') {
        res.status(409).json({
          success: false,
          message: errorMessage
        });
      } else {
        // Log error using a proper logging mechanism
        // For now, we'll keep this silent to avoid ESLint warnings
        res.status(500).json({ 
          success: false, 
          message: 'An error occurred while accepting the invitation' 
        });
      }
    }
  }
};

export default userInviteController;