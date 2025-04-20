/**
 * Update an existing prompt template
 */
import { queryMainDb } from '../../../../config/db';
import { PromptTemplate, UpdatePromptTemplateInput } from '../../../../types/prompt';

/**
 * Update an existing prompt template
 * 
 * @param templateId The ID of the prompt template to update
 * @param updateData The data to update
 * @returns The updated prompt template or null if not found
 */
export async function updatePromptTemplate(
  templateId: number, 
  updateData: UpdatePromptTemplateInput
): Promise<PromptTemplate | null> {
  // First check if the template exists
  const checkQuery = `SELECT * FROM prompt_templates WHERE id = $1`;
  const checkResult = await queryMainDb(checkQuery, [templateId]);
  
  if (checkResult.rows.length === 0) {
    return null;
  }
  
  // Build the update query dynamically based on provided fields
  const updateFields: string[] = [];
  const values: (string | number | boolean | null)[] = [];
  let paramIndex = 1;
  
  // Add each field that needs to be updated
  if (updateData.name !== undefined) {
    updateFields.push(`name = $${paramIndex}`);
    values.push(updateData.name);
    paramIndex++;
  }
  
  if (updateData.type !== undefined) {
    updateFields.push(`type = $${paramIndex}`);
    values.push(updateData.type);
    paramIndex++;
  }
  
  if (updateData.version !== undefined) {
    updateFields.push(`version = $${paramIndex}`);
    values.push(updateData.version);
    paramIndex++;
  }
  
  if (updateData.content_template !== undefined) {
    updateFields.push(`content_template = $${paramIndex}`);
    values.push(updateData.content_template);
    paramIndex++;
  }
  
  if (updateData.word_limit !== undefined) {
    updateFields.push(`word_limit = $${paramIndex}`);
    values.push(updateData.word_limit);
    paramIndex++;
  }
  
  if (updateData.active !== undefined) {
    updateFields.push(`active = $${paramIndex}`);
    values.push(updateData.active);
    paramIndex++;
    
    // TODO: If this is the default template and active is being set to false,
    // we should invalidate the cache for 'prompt:default:active'
    // This will be implemented when Redis caching is added
  }
  
  // Always update the updated_at timestamp
  updateFields.push(`updated_at = NOW()`);
  
  // If there's nothing to update, return the existing template
  if (updateFields.length === 0) {
    return checkResult.rows[0];
  }
  
  // Add the template ID as the last parameter
  values.push(templateId);
  
  const updateQuery = `
    UPDATE prompt_templates
    SET ${updateFields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  
  const result = await queryMainDb(updateQuery, values);
  return result.rows[0];
}