import { Request, Response } from 'express';
import { inviteUser } from '../services/user-invite';
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
  }
};

export default userInviteController;