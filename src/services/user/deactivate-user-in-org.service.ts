import { queryMainDb } from '../../config/db';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Deactivates a user by setting is_active to false, ensuring the user belongs to the specified organization
 * 
 * This function allows organization administrators to deactivate users within their own organization.
 * It enforces organization boundaries by checking that the target user belongs to the admin's organization.
 * This is a "soft delete" that preserves the user record but prevents login and system access.
 * 
 * @param targetUserId The ID of the user to deactivate
 * @param requestingOrgId The organization ID of the requesting admin
 * @returns Promise<boolean> True if user was deactivated, false if user not found or not in the organization
 */
export async function deactivateUserInOrg(
  targetUserId: number,
  requestingOrgId: number
): Promise<boolean> {
  try {
    enhancedLogger.debug(`Deactivating user ID: ${targetUserId} in organization ID: ${requestingOrgId}`);
    
    // Construct the UPDATE query with organization check
    const updateQuery = `
      UPDATE users
      SET 
        is_active = false,
        updated_at = NOW()
      WHERE 
        id = $1 
        AND organization_id = $2
      RETURNING id
    `;
    
    // Execute the update query
    const result = await queryMainDb(updateQuery, [targetUserId, requestingOrgId]);
    
    // Check if any row was updated
    if (result.rowCount === 0) {
      enhancedLogger.debug(`User with ID ${targetUserId} not found or not in organization ${requestingOrgId}`);
      return false;
    }
    
    enhancedLogger.debug(`Successfully deactivated user ID: ${targetUserId} in organization ${requestingOrgId}`);
    return true;
  } catch (error) {
    enhancedLogger.error(`Error deactivating user ID ${targetUserId} in organization ${requestingOrgId}:`, error);
    throw error;
  }
}