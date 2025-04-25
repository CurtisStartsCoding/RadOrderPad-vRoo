import { queryMainDb } from '../../../config/db';
import logger from '../../../utils/logger';
import { User } from '../types';

/**
 * Update a user's active status
 * 
 * @param userId User ID
 * @param isActive New active status
 * @param adminUserId ID of the admin user making the change
 * @returns Promise with the updated user or null if not found
 */
export async function updateUserStatus(
  userId: number,
  isActive: boolean,
  adminUserId: number
): Promise<User | null> {
  try {
    // Check if user exists
    const checkUserQuery = `
      SELECT id FROM users WHERE id = $1
    `;
    
    const checkResult = await queryMainDb(checkUserQuery, [userId]);
    
    if (checkResult.rowCount === 0) {
      return null;
    }
    
    // Update user status
    const updateQuery = `
      UPDATE users 
      SET is_active = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING id, email, first_name, last_name, role, is_active, 
                organization_id, created_at, updated_at, last_login, 
                email_verified, npi, specialty, phone_number
    `;
    
    const updateResult = await queryMainDb(updateQuery, [isActive, userId]);
    
    if (updateResult.rowCount === 0) {
      return null;
    }
    
    const updatedUser = updateResult.rows[0];
    
    // Get organization details
    const orgQuery = `
      SELECT name as organization_name, type as organization_type
      FROM organizations
      WHERE id = $1
    `;
    
    const orgResult = await queryMainDb(orgQuery, [updatedUser.organization_id]);
    
    if (orgResult && orgResult.rows && orgResult.rows.length > 0) {
      updatedUser.organization_name = orgResult.rows[0].organization_name;
      updatedUser.organization_type = orgResult.rows[0].organization_type;
    }
    
    // Log the action
    logger.info(`User ${userId} status updated to ${isActive ? 'active' : 'inactive'} by admin ${adminUserId}`);
    
    return updatedUser;
  } catch (error) {
    logger.error('Error updating user status:', {
      error,
      userId,
      isActive,
      adminUserId
    });
    throw error;
  }
}