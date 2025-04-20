/**
 * Get a prompt template by ID
 */
import { queryMainDb } from '../../../../config/db';
import { PromptTemplate } from '../../../../types/prompt';

/**
 * Retrieve a prompt template by its ID
 * 
 * @param templateId The ID of the prompt template to retrieve
 * @returns The prompt template or null if not found
 */
export async function getPromptTemplateById(templateId: number): Promise<PromptTemplate | null> {
  const query = `
    SELECT * FROM prompt_templates
    WHERE id = $1
  `;
  
  const result = await queryMainDb(query, [templateId]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0];
}