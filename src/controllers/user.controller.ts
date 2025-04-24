import { Request, Response } from 'express';
import { getUserProfile, listUsersByOrganization, updateUserProfile } from '../services/user';
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
  },

  /**
   * List users belonging to the authenticated user's organization
   * @param req Express request object
   * @param res Express response object
   */
  async listOrgUsers(req: Request, res: Response): Promise<void> {
    try {
      // Get organization ID from the authenticated user
      const orgId = req.user?.orgId;
      
      if (!orgId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }
      
      // Extract query parameters with defaults
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const sortBy = req.query.sortBy as string || 'last_name';
      const sortOrder = req.query.sortOrder as string || 'asc';
      const role = req.query.role as string;
      const status = req.query.status !== undefined
        ? req.query.status === 'true'
        : undefined;
      const name = req.query.name as string;
      
      // Call the service to list users
      const result = await listUsersByOrganization(orgId, {
        page,
        limit,
        sortBy,
        sortOrder,
        role,
        status,
        name
      });
      
      // Return the users list with pagination info
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      enhancedLogger.error('Error listing organization users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list organization users',
        error: (error as Error).message
      });
    }
  },

  /**
   * Update the authenticated user's own profile
   * @param req Express request object
   * @param res Express response object
   */
  async updateMe(req: Request, res: Response): Promise<void> {
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
      
      // Extract allowed updatable fields from request body
      const { firstName, lastName, phoneNumber, specialty, npi } = req.body;
      
      // Create an object with only the fields that are provided
      const updateData: Record<string, string> = {};
      
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (specialty !== undefined) updateData.specialty = specialty;
      if (npi !== undefined) updateData.npi = npi;
      
      // Validate that we have at least one field to update
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'No valid fields provided for update'
        });
        return;
      }
      
      // Basic validation
      if (firstName !== undefined && typeof firstName !== 'string') {
        res.status(400).json({
          success: false,
          message: 'First name must be a string'
        });
        return;
      }
      
      if (lastName !== undefined && typeof lastName !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Last name must be a string'
        });
        return;
      }
      
      if (phoneNumber !== undefined && typeof phoneNumber !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Phone number must be a string'
        });
        return;
      }
      
      if (specialty !== undefined && typeof specialty !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Specialty must be a string'
        });
        return;
      }
      
      if (npi !== undefined && typeof npi !== 'string') {
        res.status(400).json({
          success: false,
          message: 'NPI must be a string'
        });
        return;
      }
      
      // Call the service to update the user profile
      const updatedProfile = await updateUserProfile(userId, updateData);
      
      if (!updatedProfile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
        return;
      }
      
      // Return the updated user profile
      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: updatedProfile
      });
    } catch (error) {
      enhancedLogger.error('Error updating user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user profile',
        error: (error as Error).message
      });
    }
  }
};

export default userController;