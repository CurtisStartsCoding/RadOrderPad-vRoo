/**
 * Create a new prompt assignment
 */
import { queryMainDb, getMainDbClient } from '../../../../config/db';
import { PromptAssignment, CreatePromptAssignmentInput } from '../../../../types/prompt';

/**
 * Validate that the physician exists and has the 'physician' role
 * 
 * @param physicianId The ID of the physician to validate
 * @returns True if the physician exists and has the correct role, false otherwise
 */
async function validatePhysician(physicianId: number): Promise<boolean> {
  const query = `
    SELECT id FROM users 
    WHERE id = $1 AND role = 'physician' AND is_active = true
  `;
  
  const result = await queryMainDb(query, [physicianId]);
  return result.rows.length > 0;
}

/**
 * Validate that the prompt template exists and is active
 * 
 * @param promptId The ID of the prompt template to validate
 * @returns True if the prompt template exists and is active, false otherwise
 */
async function validatePromptTemplate(promptId: number): Promise<boolean> {
  const query = `
    SELECT id FROM prompt_templates 
    WHERE id = $1 AND active = true
  `;
  
  const result = await queryMainDb(query, [promptId]);
  return result.rows.length > 0;
}

/**
 * Create a new prompt assignment
 * If the physician already has active assignments, they will be deactivated
 * 
 * @param data The prompt assignment data to create
 * @returns The created prompt assignment with its ID
 * @throws Error if the physician or prompt template doesn't exist or is inactive
 */
export async function createPromptAssignment(data: CreatePromptAssignmentInput): Promise<PromptAssignment> {
  const { physician_id, prompt_id, ab_group, is_active } = data;
  
  // Validate the physician exists and has the correct role
  const isValidPhysician = await validatePhysician(physician_id);
  if (!isValidPhysician) {
    throw new Error(`Physician with ID ${physician_id} does not exist or is not active`);
  }
  
  // Validate the prompt template exists and is active
  const isValidPrompt = await validatePromptTemplate(prompt_id);
  if (!isValidPrompt) {
    throw new Error(`Prompt template with ID ${prompt_id} does not exist or is not active`);
  }
  
  // Start a transaction to ensure data consistency
  const client = await getMainDbClient();
  
  try {
    await client.query('BEGIN');
    
    // If this assignment should be active, deactivate any existing active assignments for this physician
    if (is_active !== false) {
      const deactivateQuery = `
        UPDATE prompt_assignments
        SET is_active = false
        WHERE physician_id = $1 AND is_active = true
      `;
      
      await client.query(deactivateQuery, [physician_id]);
    }
    
    // Insert the new assignment
    const insertQuery = `
      INSERT INTO prompt_assignments (
        physician_id, 
        prompt_id, 
        ab_group, 
        is_active
      ) 
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      physician_id,
      prompt_id,
      ab_group || null,
      is_active !== undefined ? is_active : true
    ];
    
    const result = await client.query(insertQuery, values);
    
    // Commit the transaction
    await client.query('COMMIT');
    
    return result.rows[0];
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Release the client back to the pool
    client.release();
  }
}