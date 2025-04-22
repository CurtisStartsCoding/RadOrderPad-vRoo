import { queryMainDb } from '../../config/db';
import { PromptTemplate } from './types';
import logger from '../../utils/logger';

/**
 * Get the active default prompt template from the database
 */
export async function getActivePromptTemplate(): Promise<PromptTemplate> {
  logger.info("Looking for active default prompt template");
  
  const result = await queryMainDb(
    `SELECT * FROM prompt_templates
     WHERE type = 'default' AND active = true
     ORDER BY created_at DESC
     LIMIT 1`
  );
  
  logger.info("Prompt template query result:", result.rows);
  
  if (result.rows.length === 0) {
    throw new Error('No active default prompt template found');
  }
  
  return result.rows[0] as PromptTemplate;
}