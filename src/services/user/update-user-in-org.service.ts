import { queryMainDb } from '../../config/db';
import { UserResponse } from '../../models/User';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Interface for update user in organization parameters
 */
export interface UpdateUserInOrgParams {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  specialty?: string;
  npi?: string;
  role?: string;
  isActive?: boolean;
}

/**
 * Updates a user's profile information, ensuring the user belongs to the specified organization
 * 
 * This function allows organization administrators to update users within their own organization.
 * It enforces organization boundaries by checking that the target user belongs to the admin's organization.
 * 
 * @param targetUserId The ID of the user to update
 * @param requestingOrgId The organization ID of the requesting admin
 * @param updateData The data to update in the user's profile
 * @returns Promise with updated user profile or null if not found or not in the organization
 */
export async function updateUserInOrg(
  targetUserId: number,
  requestingOrgId: number,
  updateData: UpdateUserInOrgParams
): Promise<UserResponse | null> {
  try {
    enhancedLogger.debug(`Updating user profile for user ID: ${targetUserId} in organization ID: ${requestingOrgId}`, { updateData });
    
    // Check if there's anything to update
    if (!updateData || Object.keys(updateData).length === 0) {
      enhancedLogger.debug('No update data provided, fetching current profile');
      // If no update data provided, just return the current profile
      const currentProfile = await getUserProfileInOrg(targetUserId, requestingOrgId);
      return currentProfile;
    }
    
    // Build the SET clause and parameters for the UPDATE query
    const setClauses: string[] = [];
    const queryParams: unknown[] = [];
    let paramIndex = 1;
    
    // Map frontend camelCase to database snake_case and add to SET clauses
    if (updateData.firstName !== undefined) {
      setClauses.push(`first_name = $${paramIndex++}`);
      queryParams.push(updateData.firstName);
    }
    
    if (updateData.lastName !== undefined) {
      setClauses.push(`last_name = $${paramIndex++}`);
      queryParams.push(updateData.lastName);
    }
    
    if (updateData.phoneNumber !== undefined) {
      setClauses.push(`phone_number = $${paramIndex++}`);
      queryParams.push(updateData.phoneNumber);
    }
    
    if (updateData.specialty !== undefined) {
      setClauses.push(`specialty = $${paramIndex++}`);
      queryParams.push(updateData.specialty);
    }
    
    if (updateData.npi !== undefined) {
      setClauses.push(`npi = $${paramIndex++}`);
      queryParams.push(updateData.npi);
    }
    
    if (updateData.role !== undefined) {
      setClauses.push(`role = $${paramIndex++}`);
      queryParams.push(updateData.role);
    }
    
    if (updateData.isActive !== undefined) {
      setClauses.push(`is_active = $${paramIndex++}`);
      queryParams.push(updateData.isActive);
    }
    
    // Always update the updated_at timestamp
    setClauses.push(`updated_at = NOW()`);
    
    // Add the targetUserId and requestingOrgId as the last parameters
    queryParams.push(targetUserId);
    queryParams.push(requestingOrgId);
    
    // Construct the full UPDATE query with organization check
    const updateQuery = `
      UPDATE users
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex++} AND organization_id = $${paramIndex}
      RETURNING 
        id, 
        email, 
        first_name, 
        last_name, 
        role, 
        organization_id,
        is_active, 
        email_verified,
        created_at,
        updated_at,
        npi, 
        specialty
    `;
    
    enhancedLogger.debug('Executing update query', { 
      query: updateQuery, 
      params: queryParams 
    });
    
    // Execute the update query
    const result = await queryMainDb(updateQuery, queryParams);
    
    if (result.rowCount === 0) {
      enhancedLogger.debug(`User with ID ${targetUserId} not found or not in organization ${requestingOrgId}`);
      return null;
    }
    
    const updatedUser = result.rows[0];
    
    // Map database result to UserResponse interface
    const userResponse: UserResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      role: updatedUser.role,
      organization_id: updatedUser.organization_id,
      is_active: updatedUser.is_active,
      email_verified: updatedUser.email_verified,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
      npi: updatedUser.npi || undefined,
      specialty: updatedUser.specialty || undefined
    };
    
    enhancedLogger.debug(`Successfully updated user profile for user ID: ${targetUserId} in organization ${requestingOrgId}`);
    return userResponse;
  } catch (error) {
    enhancedLogger.error(`Error updating user profile for user ID ${targetUserId} in organization ${requestingOrgId}:`, error);
    throw error;
  }
}

/**
 * Helper function to get user profile by ID within an organization
 * This is used when no update data is provided
 */
async function getUserProfileInOrg(
  targetUserId: number,
  requestingOrgId: number
): Promise<UserResponse | null> {
  try {
    enhancedLogger.debug(`Getting user profile for user ID: ${targetUserId} in organization ID: ${requestingOrgId}`);
    
    // Query for the user with organization check
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
      enhancedLogger.debug(`User with ID ${targetUserId} not found or not in organization ${requestingOrgId}`);
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
    
    enhancedLogger.debug(`Successfully retrieved user profile for user ID: ${targetUserId} in organization ${requestingOrgId}`);
    return userResponse;
  } catch (error) {
    enhancedLogger.error(`Error getting user profile for user ID ${targetUserId} in organization ${requestingOrgId}:`, error);
    throw error;
  }
}