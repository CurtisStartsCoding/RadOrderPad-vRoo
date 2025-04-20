/**
 * Delete a prompt assignment
 */
import { queryMainDb } from '../../../../config/db';
import { PromptAssignment } from '../../../../types/prompt';

/**
 * Delete a prompt assignment by ID
 * This performs a hard delete, removing the record from the database
 * 
 * @param assignmentId The ID of the prompt assignment to delete
 * @returns The deleted prompt assignment or null if not found
 */
export async function deletePromptAssignment(assignmentId: number): Promise<PromptAssignment | null> {
  // First check if the assignment exists
  const checkQuery = `SELECT * FROM prompt_assignments WHERE id = $1`;
  const checkResult = await queryMainDb(checkQuery, [assignmentId]);
  
  if (checkResult.rows.length === 0) {
    return null;
  }
  
  // Delete the assignment
  const deleteQuery = `
    DELETE FROM prompt_assignments
    WHERE id = $1
    RETURNING *
  `;
  
  const result = await queryMainDb(deleteQuery, [assignmentId]);
  return result.rows[0];
}