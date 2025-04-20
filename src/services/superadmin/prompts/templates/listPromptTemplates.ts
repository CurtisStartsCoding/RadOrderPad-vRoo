/**
 * List prompt templates with optional filtering
 */
import { queryMainDb } from '../../../../config/db';
import { PromptTemplate, PromptTemplateFilters } from '../../../../types/prompt';

/**
 * List prompt templates with optional filtering
 * 
 * @param filters Optional filters to apply (type, active, version)
 * @returns Array of prompt templates matching the filters
 */
export async function listPromptTemplates(filters?: PromptTemplateFilters): Promise<PromptTemplate[]> {
  // Start with base query
  let query = `SELECT * FROM prompt_templates`;
  const values: (string | boolean)[] = [];
  const conditions: string[] = [];
  
  // Apply filters if provided
  if (filters) {
    let paramIndex = 1;
    
    if (filters.type !== undefined) {
      conditions.push(`type = $${paramIndex}`);
      values.push(filters.type);
      paramIndex++;
    }
    
    if (filters.active !== undefined) {
      conditions.push(`active = $${paramIndex}`);
      values.push(filters.active);
      paramIndex++;
    }
    
    if (filters.version !== undefined) {
      conditions.push(`version = $${paramIndex}`);
      values.push(filters.version);
      paramIndex++;
    }
  }
  
  // Add WHERE clause if we have conditions
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  // Add ordering to ensure consistent results
  query += ` ORDER BY type, version, name`;
  
  const result = await queryMainDb(query, values);
  return result.rows;
}