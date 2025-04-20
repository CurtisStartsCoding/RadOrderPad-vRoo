/**
 * List prompt assignments with optional filtering
 */
import { queryMainDb } from '../../../../config/db';
import { PromptAssignmentWithDetails, PromptAssignmentFilters } from '../../../../types/prompt';

/**
 * List prompt assignments with optional filtering
 * 
 * @param filters Optional filters to apply (physician_id, prompt_id, is_active, ab_group)
 * @returns Array of prompt assignments matching the filters, with related details
 */
export async function listPromptAssignments(filters?: PromptAssignmentFilters): Promise<PromptAssignmentWithDetails[]> {
  // Start with base query
  let query = `
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
  `;
  
  const values: (number | boolean | string)[] = [];
  const conditions: string[] = [];
  
  // Apply filters if provided
  if (filters) {
    let paramIndex = 1;
    
    if (filters.physician_id !== undefined) {
      conditions.push(`pa.physician_id = $${paramIndex}`);
      values.push(filters.physician_id);
      paramIndex++;
    }
    
    if (filters.prompt_id !== undefined) {
      conditions.push(`pa.prompt_id = $${paramIndex}`);
      values.push(filters.prompt_id);
      paramIndex++;
    }
    
    if (filters.is_active !== undefined) {
      conditions.push(`pa.is_active = $${paramIndex}`);
      values.push(filters.is_active);
      paramIndex++;
    }
    
    if (filters.ab_group !== undefined) {
      conditions.push(`pa.ab_group = $${paramIndex}`);
      values.push(filters.ab_group);
      paramIndex++;
    }
  }
  
  // Add WHERE clause if we have conditions
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  // Add ordering to ensure consistent results
  query += ` ORDER BY pa.assigned_on DESC, pa.id DESC`;
  
  const result = await queryMainDb(query, values);
  return result.rows;
}