import { queryMainDb } from '../../config/db';
import { UserResponse } from '../../models/User';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Get user profile by user ID for a specific organization
 * 
 * This function retrieves a user's profile only if they belong to the specified organization.
 * This ensures that administrators can only view users within their own organization.
 * 
 * @param targetUserId The ID of the user to retrieve
 * @param requestingOrgId The organization ID of the requesting admin
 * @returns Promise with user profile or null if not found or not in the organization
 */
export async function getUserByIdForOrg(
  targetUserId: number, 
  requestingOrgId: number
): Promise<UserResponse | null> {
  try {
    enhancedLogger.debug(
      `Getting user profile for user ID: ${targetUserId} in organization ID: ${requestingOrgId}`
    );
    
    // Query for the user with organization check
    // This ensures the user belongs to the requesting admin's organization
    const userQuery = `
      SELECT 
        u.id, 
        u.email, 
        u.first_name, 
        u.last_name, 
        u.role, 
        u.organization_id,
        u.is_active, 
        u.email_verified,
        u.created_at,
        u.updated_at,
        u.npi, 
        u.specialty
      FROM users u
      WHERE u.id = $1 AND u.organization_id = $2
    `;
    
    const userResult = await queryMainDb(userQuery, [targetUserId, requestingOrgId]);
    
    if (userResult.rowCount === 0) {
      enhancedLogger.debug(
        `User with ID ${targetUserId} not found or not in organization ${requestingOrgId}`
      );
      return null;
    }
    
    const user = userResult.rows[0];
    
    // Map database result to UserResponse interface
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      organization_id: user.organization_id,
      is_active: user.is_active,
      email_verified: user.email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
      npi: user.npi || undefined,
      specialty: user.specialty || undefined
    };
    
    enhancedLogger.debug(`Successfully retrieved user profile for user ID: ${targetUserId}`);
    return userResponse;
  } catch (error) {
    enhancedLogger.error(
      `Error getting user profile for user ID ${targetUserId} in organization ${requestingOrgId}:`, 
      error
    );
    throw error;
  }
}