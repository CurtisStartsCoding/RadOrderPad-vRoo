/**
 * Update an existing prompt assignment
 */
import { queryMainDb, getMainDbClient } from '../../../../config/db';
import { PromptAssignment, UpdatePromptAssignmentInput } from '../../../../types/prompt';

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
 * Update an existing prompt assignment
 * If is_active is set to true, other assignments for the same physician will be deactivated
 * 
 * @param assignmentId The ID of the prompt assignment to update
 * @param updateData The data to update
 * @returns The updated prompt assignment or null if not found
 * @throws Error if the physician or prompt template doesn't exist or is inactive
 */
export async function updatePromptAssignment(
  assignmentId: number, 
  updateData: UpdatePromptAssignmentInput
): Promise<PromptAssignment | null> {
  // First check if the assignment exists
  const checkQuery = `SELECT * FROM prompt_assignments WHERE id = $1`;
  const checkResult = await queryMainDb(checkQuery, [assignmentId]);
  
  if (checkResult.rows.length === 0) {
    return null;
  }
  
  const existingAssignment = checkResult.rows[0];
  
  // Validate the physician if it's being updated
  if (updateData.physician_id !== undefined && updateData.physician_id !== existingAssignment.physician_id) {
    const isValidPhysician = await validatePhysician(updateData.physician_id);
    if (!isValidPhysician) {
      throw new Error(`Physician with ID ${updateData.physician_id} does not exist or is not active`);
    }
  }
  
  // Validate the prompt template if it's being updated
  if (updateData.prompt_id !== undefined && updateData.prompt_id !== existingAssignment.prompt_id) {
    const isValidPrompt = await validatePromptTemplate(updateData.prompt_id);
    if (!isValidPrompt) {
      throw new Error(`Prompt template with ID ${updateData.prompt_id} does not exist or is not active`);
    }
  }
  
  // Start a transaction if we need to deactivate other assignments
  const needsTransaction = updateData.is_active === true && !existingAssignment.is_active;
  
  if (needsTransaction) {
    const client = await getMainDbClient();
    
    try {
      await client.query('BEGIN');
      
      // Deactivate other assignments for this physician
      const deactivateQuery = `
        UPDATE prompt_assignments
        SET is_active = false
        WHERE physician_id = $1 
          AND id != $2 
          AND is_active = true
      `;
      
      const physicianId = updateData.physician_id || existingAssignment.physician_id;
      await client.query(deactivateQuery, [physicianId, assignmentId]);
      
      // Build the update query dynamically based on provided fields
      const updateFields: string[] = [];
      const values: (number | boolean | string | null)[] = [];
      let paramIndex = 1;
      
      if (updateData.physician_id !== undefined) {
        updateFields.push(`physician_id = $${paramIndex}`);
        values.push(updateData.physician_id);
        paramIndex++;
      }
      
      if (updateData.prompt_id !== undefined) {
        updateFields.push(`prompt_id = $${paramIndex}`);
        values.push(updateData.prompt_id);
        paramIndex++;
      }
      
      if (updateData.ab_group !== undefined) {
        updateFields.push(`ab_group = $${paramIndex}`);
        values.push(updateData.ab_group);
        paramIndex++;
      }
      
      if (updateData.is_active !== undefined) {
        updateFields.push(`is_active = $${paramIndex}`);
        values.push(updateData.is_active);
        paramIndex++;
      }
      
      // Add the assignment ID as the last parameter
      values.push(assignmentId);
      
      const updateQuery = `
        UPDATE prompt_assignments
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      const result = await client.query(updateQuery, values);
      
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
  } else {
    // No transaction needed, just update the assignment
    // Build the update query dynamically based on provided fields
    const updateFields: string[] = [];
    const values: (number | boolean | string | null)[] = [];
    let paramIndex = 1;
    
    if (updateData.physician_id !== undefined) {
      updateFields.push(`physician_id = $${paramIndex}`);
      values.push(updateData.physician_id);
      paramIndex++;
    }
    
    if (updateData.prompt_id !== undefined) {
      updateFields.push(`prompt_id = $${paramIndex}`);
      values.push(updateData.prompt_id);
      paramIndex++;
    }
    
    if (updateData.ab_group !== undefined) {
      updateFields.push(`ab_group = $${paramIndex}`);
      values.push(updateData.ab_group);
      paramIndex++;
    }
    
    if (updateData.is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex}`);
      values.push(updateData.is_active);
      paramIndex++;
    }
    
    // If there's nothing to update, return the existing assignment
    if (updateFields.length === 0) {
      return existingAssignment;
    }
    
    // Add the assignment ID as the last parameter
    values.push(assignmentId);
    
    const updateQuery = `
      UPDATE prompt_assignments
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await queryMainDb(updateQuery, values);
    return result.rows[0];
  }
}