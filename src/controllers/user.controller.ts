import { Request, Response } from 'express';
import {
  getUserProfile,
  listUsersByOrganization,
  updateUserProfile,
  getUserByIdForOrg,
  updateUserInOrg,
  deactivateUserInOrg
} from '../services/user';
import { UpdateUserInOrgParams } from '../services/user/update-user-in-org.service';
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
  },

  /**
   * Get a specific user's profile by ID (admin only, limited to users in their organization)
   * @param req Express request object
   * @param res Express response object
   */
  async getOrgUserById(req: Request, res: Response): Promise<void> {
    try {
      // Get organization ID from the authenticated admin
      const requestingOrgId = req.user?.orgId;
      
      if (!requestingOrgId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }
      
      // Extract and validate the target user ID from the request parameters
      const targetUserIdParam = req.params.userId;
      const targetUserId = parseInt(targetUserIdParam, 10);
      
      if (isNaN(targetUserId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }
      
      // Call the service to get the user profile, ensuring they belong to the admin's organization
      const userProfile = await getUserByIdForOrg(targetUserId, requestingOrgId);
      
      if (!userProfile) {
        res.status(404).json({
          success: false,
          message: 'User not found or not in your organization'
        });
        return;
      }
      
      // Return the user profile
      res.status(200).json({
        success: true,
        data: userProfile
      });
    } catch (error) {
      enhancedLogger.error(`Error getting user profile by ID: ${req.params.userId}`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile',
        error: (error as Error).message
      });
    }
  },

  /**
   * Update a specific user's profile by ID (admin only, limited to users in their organization)
   * @param req Express request object
   * @param res Express response object
   */
  async updateOrgUserById(req: Request, res: Response): Promise<void> {
    try {
      // Get organization ID from the authenticated admin
      const requestingOrgId = req.user?.orgId;
      
      if (!requestingOrgId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }
      
      // Extract and validate the target user ID from the request parameters
      const targetUserIdParam = req.params.userId;
      const targetUserId = parseInt(targetUserIdParam, 10);
      
      if (isNaN(targetUserId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }
      
      // Extract allowed updatable fields from request body
      const {
        firstName,
        lastName,
        phoneNumber,
        specialty,
        npi,
        role,
        isActive
      } = req.body;
      
      // Create an object with only the fields that are provided
      const updateData: UpdateUserInOrgParams = {};
      
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (specialty !== undefined) updateData.specialty = specialty;
      if (npi !== undefined) updateData.npi = npi;
      if (role !== undefined) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
      
      // Validate that we have at least one field to update
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'No valid fields provided for update'
        });
        return;
      }
      
      // Basic validation for field types
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
      
      // Validate role if provided
      if (role !== undefined) {
        if (typeof role !== 'string') {
          res.status(400).json({
            success: false,
            message: 'Role must be a string'
          });
          return;
        }
        
        // Get the requesting user's role
        const requestingUserRole = req.user?.role;
        
        // Define allowed roles based on the requesting user's role
        let allowedRoles: string[] = [];
        
        if (requestingUserRole === 'admin_referring') {
          // admin_referring can assign physician and admin_staff roles
          allowedRoles = ['physician', 'admin_staff'];
        } else if (requestingUserRole === 'admin_radiology') {
          // admin_radiology can assign scheduler and radiologist roles
          allowedRoles = ['scheduler', 'radiologist'];
        }
        
        // Check if the requested role is allowed
        if (!allowedRoles.includes(role)) {
          res.status(400).json({
            success: false,
            message: `You are not authorized to assign the '${role}' role. Allowed roles: ${allowedRoles.join(', ')}`
          });
          return;
        }
      }
      
      // Validate isActive if provided
      if (isActive !== undefined && typeof isActive !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isActive must be a boolean'
        });
        return;
      }
      
      // Call the service to update the user profile
      const updatedProfile = await updateUserInOrg(targetUserId, requestingOrgId, updateData);
      
      if (!updatedProfile) {
        res.status(404).json({
          success: false,
          message: 'User not found or not in your organization'
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
      enhancedLogger.error(`Error updating user profile by ID: ${req.params.userId}`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user profile',
        error: (error as Error).message
      });
    }
  },

  /**
   * Deactivate a specific user by ID (admin only, limited to users in their organization)
   * This is a "soft delete" that sets is_active to false rather than removing the record
   * @param req Express request object
   * @param res Express response object
   */
  async deactivateOrgUserById(req: Request, res: Response): Promise<void> {
    try {
      // Get organization ID and user ID from the authenticated admin
      const requestingOrgId = req.user?.orgId;
      const requestingUserId = req.user?.userId;
      
      if (!requestingOrgId || !requestingUserId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }
      
      // Extract and validate the target user ID from the request parameters
      const targetUserIdParam = req.params.userId;
      const targetUserId = parseInt(targetUserIdParam, 10);
      
      if (isNaN(targetUserId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }
      
      // Prevent self-deactivation
      if (targetUserId === requestingUserId) {
        res.status(400).json({
          success: false,
          message: 'Administrators cannot deactivate their own account'
        });
        return;
      }
      
      // Call the service to deactivate the user, ensuring they belong to the admin's organization
      const success = await deactivateUserInOrg(targetUserId, requestingOrgId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'User not found or not in your organization'
        });
        return;
      }
      
      // Return success response
      res.status(200).json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      enhancedLogger.error(`Error deactivating user ID: ${req.params.userId}`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to deactivate user',
        error: (error as Error).message
      });
    }
  }
};

export default userController;