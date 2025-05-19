import * as bcrypt from 'bcrypt';
import { queryMainDb } from '../../../config/db';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Update a trial user's password
 * 
 * @param email User email
 * @param newPassword New password to set
 * @returns Boolean indicating success
 */
export async function updateTrialUserPassword(
  email: string,
  newPassword: string
): Promise<boolean> {
  try {
    // Check if trial user exists
    const userResult = await queryMainDb(
      'SELECT id FROM trial_users WHERE email = $1',
      [email]
    );
    
    if (!userResult.rowCount || userResult.rowCount === 0) {
      throw new Error('Trial user not found');
    }
    
    // Hash the new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update the password hash
    const updateResult = await queryMainDb(
      'UPDATE trial_users SET password_hash = $1, last_validation_at = NOW() WHERE email = $2',
      [passwordHash, email]
    );
    
    if (updateResult.rowCount && updateResult.rowCount > 0) {
      enhancedLogger.info('Trial user password updated successfully', { 
        email,
        userId: userResult.rows[0].id
      });
      return true;
    } else {
      enhancedLogger.warn('Failed to update trial user password', { email });
      return false;
    }
  } catch (error) {
    enhancedLogger.error('Error in updateTrialUserPassword service:', error);
    throw error;
  }
}