/**
 * Get the optimal word count for a specialty from the specialty_configurations table
 */
import { queryMainDb } from '../../config/db';
import logger from '../../utils/logger';

/**
 * Get the optimal word count for a specialty
 * @param specialty The specialty to get the word count for
 * @returns The optimal word count for the specialty, or 33 if not found
 */
export async function getSpecialtyWordCount(specialty: string | null | undefined): Promise<number> {
  if (!specialty) {
    // Default to 33 words if no specialty is provided
    logger.info('No specialty provided, defaulting to 33 words');
    return 33;
  }
  
  try {
    const result = await queryMainDb(
      `SELECT optimal_word_count
       FROM specialty_configurations
       WHERE specialty_name = $1
       LIMIT 1`,
      [specialty]
    );
    
    if (result.rows.length === 0) {
      // Specialty not found, default to 33 words
      logger.info(`Specialty "${specialty}" not found, defaulting to 33 words`);
      return 33;
    }
    
    return result.rows[0].optimal_word_count;
  } catch (error) {
    logger.error(`Error getting word count for specialty ${specialty}:`, error);
    // Default to 33 words if there's an error
    logger.info('Error occurred, defaulting to 33 words');
    return 33;
  }
}
