/**
 * Controller functions for prompt assignment management
 */
import { Request, Response } from 'express';
import { prompts } from '../../../services/superadmin';
import { 
  CreatePromptAssignmentInput, 
  UpdatePromptAssignmentInput 
} from '../../../types/prompt';
import logger from '../../../utils/logger';

/**
 * Create a new prompt assignment
 * 
 * @route POST /api/superadmin/prompts/assignments
 */
export async function createPromptAssignmentController(req: Request, res: Response): Promise<void> {
  try {
    const assignmentData: CreatePromptAssignmentInput = req.body;
    
    // Validate required fields
    if (!assignmentData.physician_id || !assignmentData.prompt_id) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: physician_id and prompt_id are required'
      });
      return;
    }
    
    try {
      const newAssignment = await prompts.assignments.createPromptAssignment(assignmentData);
      
      res.status(201).json({
        success: true,
        data: newAssignment
      });
    } catch (error) {
      // Handle specific validation errors
      if (error instanceof Error && error.message.includes('does not exist or is not active')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Re-throw for general error handling
      throw error;
    }
  } catch (error) {
    logger.error('Error creating prompt assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create prompt assignment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Get a specific prompt assignment by ID
 * 
 * @route GET /api/superadmin/prompts/assignments/:assignmentId
 */
export async function getPromptAssignmentController(req: Request, res: Response): Promise<void> {
  try {
    const assignmentId = parseInt(req.params.assignmentId, 10);
    
    if (isNaN(assignmentId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid assignment ID'
      });
      return;
    }
    
    const assignment = await prompts.assignments.getPromptAssignmentById(assignmentId);
    
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: `Prompt assignment with ID ${assignmentId} not found`
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    logger.error('Error getting prompt assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prompt assignment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * List all prompt assignments with optional filtering
 * 
 * @route GET /api/superadmin/prompts/assignments
 */
export async function listPromptAssignmentsController(req: Request, res: Response): Promise<void> {
  try {
    // Extract filter parameters from query string
    const filters = {
      physician_id: req.query.physician_id !== undefined 
        ? parseInt(req.query.physician_id as string, 10) 
        : undefined,
      prompt_id: req.query.prompt_id !== undefined 
        ? parseInt(req.query.prompt_id as string, 10) 
        : undefined,
      is_active: req.query.is_active !== undefined 
        ? req.query.is_active === 'true' 
        : undefined,
      ab_group: req.query.ab_group as string | undefined
    };
    
    // Validate numeric parameters
    if (
      (filters.physician_id !== undefined && isNaN(filters.physician_id)) ||
      (filters.prompt_id !== undefined && isNaN(filters.prompt_id))
    ) {
      res.status(400).json({
        success: false,
        message: 'Invalid filter parameters: physician_id and prompt_id must be numbers'
      });
      return;
    }
    
    const assignments = await prompts.assignments.listPromptAssignments(filters);
    
    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    logger.error('Error listing prompt assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list prompt assignments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Update an existing prompt assignment
 * 
 * @route PUT /api/superadmin/prompts/assignments/:assignmentId
 */
export async function updatePromptAssignmentController(req: Request, res: Response): Promise<void> {
  try {
    const assignmentId = parseInt(req.params.assignmentId, 10);
    
    if (isNaN(assignmentId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid assignment ID'
      });
      return;
    }
    
    const updateData: UpdatePromptAssignmentInput = req.body;
    
    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: 'No update data provided'
      });
      return;
    }
    
    try {
      const updatedAssignment = await prompts.assignments.updatePromptAssignment(assignmentId, updateData);
      
      if (!updatedAssignment) {
        res.status(404).json({
          success: false,
          message: `Prompt assignment with ID ${assignmentId} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: updatedAssignment
      });
    } catch (error) {
      // Handle specific validation errors
      if (error instanceof Error && error.message.includes('does not exist or is not active')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Re-throw for general error handling
      throw error;
    }
  } catch (error) {
    logger.error('Error updating prompt assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prompt assignment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Delete a prompt assignment
 * 
 * @route DELETE /api/superadmin/prompts/assignments/:assignmentId
 */
export async function deletePromptAssignmentController(req: Request, res: Response): Promise<void> {
  try {
    const assignmentId = parseInt(req.params.assignmentId, 10);
    
    if (isNaN(assignmentId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid assignment ID'
      });
      return;
    }
    
    const deletedAssignment = await prompts.assignments.deletePromptAssignment(assignmentId);
    
    if (!deletedAssignment) {
      res.status(404).json({
        success: false,
        message: `Prompt assignment with ID ${assignmentId} not found`
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Prompt assignment successfully deleted',
      data: deletedAssignment
    });
  } catch (error) {
    logger.error('Error deleting prompt assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete prompt assignment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}