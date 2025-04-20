/**
 * Get a prompt assignment by ID with related details
 */
import { queryMainDb } from '../../../../config/db';
import { PromptAssignmentWithDetails } from '../../../../types/prompt';

/**
 * Retrieve a prompt assignment by its ID, including related user and template details
 * 
 * @param assignmentId The ID of the prompt assignment to retrieve
 * @returns The prompt assignment with related details or null if not found
 */
export async function getPromptAssignmentById(assignmentId: number): Promise<PromptAssignmentWithDetails | null> {
  const query = `
    SELECT 
      pa.id,
      pa.physician_id,
      pa.prompt_id,
      pa.ab_group,
      pa.assigned_on,
      pa.is_active,
      u.first_name || ' ' || u.last_name AS physician_name,
      u.email AS physician_email,
      pt.name AS template_name,
      pt.type AS template_type,
      pt.version AS template_version
    FROM 
      prompt_assignments pa
    JOIN 
      users u ON pa.physician_id = u.id
    JOIN 
      prompt_templates pt ON pa.prompt_id = pt.id
    WHERE 
      pa.id = $1
  `;
  
  const result = await queryMainDb(query, [assignmentId]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0];
}