/**
 * Get the specialty of a user from the database
 */
import { queryMainDb } from '../../config/db';
import logger from '../../utils/logger';

/**
 * Get the specialty of a user
 * @param userId The ID of the user
 * @returns The specialty of the user, or null if not found
 */
export async function getUserSpecialty(userId: number | undefined): Promise<string | null> {
  if (!userId) {
    return null;
  }
  
  try {
    const result = await queryMainDb(
      `SELECT specialty
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      logger.info(`No user found with ID ${userId}`);
      return null;
    }
    
    return result.rows[0].specialty;
  } catch (error) {
    logger.error(`Error getting specialty for user ${userId}:`, error);
    return null;
  }
}