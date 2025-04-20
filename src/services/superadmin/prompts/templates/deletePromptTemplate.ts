/**
 * Delete (or soft delete) a prompt template
 */
import { queryMainDb } from '../../../../config/db';
import { PromptTemplate } from '../../../../types/prompt';

/**
 * Delete a prompt template by ID
 * This is implemented as a soft delete by setting active = false
 * 
 * @param templateId The ID of the prompt template to delete
 * @returns The deleted prompt template (with active = false) or null if not found
 */
export async function deletePromptTemplate(templateId: number): Promise<PromptTemplate | null> {
  // First check if the template exists
  const checkQuery = `SELECT * FROM prompt_templates WHERE id = $1`;
  const checkResult = await queryMainDb(checkQuery, [templateId]);
  
  if (checkResult.rows.length === 0) {
    return null;
  }
  
  // Check if there are any active assignments using this template
  const assignmentQuery = `
    SELECT COUNT(*) as count 
    FROM prompt_assignments 
    WHERE prompt_id = $1 AND is_active = true
  `;
  // Check for active assignments - this could be used to warn users
  // or handle differently in a real implementation
  const assignmentResult = await queryMainDb(assignmentQuery, [templateId]);
  const activeAssignmentsCount = parseInt(assignmentResult.rows[0].count, 10);
  
  // Log if there are active assignments
  if (activeAssignmentsCount > 0) {
    // In a real implementation, you might want to log this or handle differently
    // For example: logger.warn(`Deactivating template ${templateId} with ${activeAssignmentsCount} active assignments`);
  }
  
  // Perform soft delete by setting active = false
  const updateQuery = `
    UPDATE prompt_templates
    SET active = false, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  
  const result = await queryMainDb(updateQuery, [templateId]);
  
  // TODO: If this is the default template, we should invalidate 
  // the cache for 'prompt:default:active'
  // This will be implemented when Redis caching is added
  
  return result.rows[0];
}