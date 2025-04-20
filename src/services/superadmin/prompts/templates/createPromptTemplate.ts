/**
 * Create a new prompt template
 */
import { queryMainDb } from '../../../../config/db';
import { PromptTemplate, CreatePromptTemplateInput } from '../../../../types/prompt';

/**
 * Create a new prompt template in the database
 *
 * @param data The prompt template data to create
 * @returns The created prompt template with its ID
 */
export async function createPromptTemplate(data: CreatePromptTemplateInput): Promise<PromptTemplate> {
  const { name, type, version, content_template, word_limit, active } = data;
  
  const query = `
    INSERT INTO prompt_templates (
      name, 
      type, 
      version, 
      content_template, 
      word_limit, 
      active
    ) 
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  
  const values = [
    name,
    type,
    version,
    content_template,
    word_limit || null,
    active !== undefined ? active : true
  ];
  
  const result = await queryMainDb(query, values);
  return result.rows[0];
}