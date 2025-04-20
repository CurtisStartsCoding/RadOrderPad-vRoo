/**
 * Controller functions for prompt template management
 */
import { Request, Response } from 'express';
import { prompts } from '../../../services/superadmin';
import { CreatePromptTemplateInput, UpdatePromptTemplateInput } from '../../../types/prompt';
import logger from '../../../utils/logger';

/**
 * Create a new prompt template
 * 
 * @route POST /api/superadmin/prompts/templates
 */
export async function createPromptTemplateController(req: Request, res: Response): Promise<void> {
  try {
    const templateData: CreatePromptTemplateInput = req.body;
    
    // Validate required fields
    if (!templateData.name || !templateData.type || !templateData.version || !templateData.content_template) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: name, type, version, and content_template are required'
      });
      return;
    }
    
    const newTemplate = await prompts.templates.createPromptTemplate(templateData);
    
    res.status(201).json({
      success: true,
      data: newTemplate
    });
  } catch (error) {
    logger.error('Error creating prompt template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create prompt template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Get a specific prompt template by ID
 * 
 * @route GET /api/superadmin/prompts/templates/:templateId
 */
export async function getPromptTemplateController(req: Request, res: Response): Promise<void> {
  try {
    const templateId = parseInt(req.params.templateId, 10);
    
    if (isNaN(templateId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid template ID'
      });
      return;
    }
    
    const template = await prompts.templates.getPromptTemplateById(templateId);
    
    if (!template) {
      res.status(404).json({
        success: false,
        message: `Prompt template with ID ${templateId} not found`
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    logger.error('Error getting prompt template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prompt template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * List all prompt templates with optional filtering
 * 
 * @route GET /api/superadmin/prompts/templates
 */
export async function listPromptTemplatesController(req: Request, res: Response): Promise<void> {
  try {
    // Extract filter parameters from query string
    const filters = {
      type: req.query.type as string | undefined,
      active: req.query.active !== undefined 
        ? req.query.active === 'true' 
        : undefined,
      version: req.query.version as string | undefined
    };
    
    const templates = await prompts.templates.listPromptTemplates(filters);
    
    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    logger.error('Error listing prompt templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list prompt templates',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Update an existing prompt template
 * 
 * @route PUT /api/superadmin/prompts/templates/:templateId
 */
export async function updatePromptTemplateController(req: Request, res: Response): Promise<void> {
  try {
    const templateId = parseInt(req.params.templateId, 10);
    
    if (isNaN(templateId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid template ID'
      });
      return;
    }
    
    const updateData: UpdatePromptTemplateInput = req.body;
    
    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: 'No update data provided'
      });
      return;
    }
    
    const updatedTemplate = await prompts.templates.updatePromptTemplate(templateId, updateData);
    
    if (!updatedTemplate) {
      res.status(404).json({
        success: false,
        message: `Prompt template with ID ${templateId} not found`
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: updatedTemplate
    });
  } catch (error) {
    logger.error('Error updating prompt template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prompt template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Delete (soft delete) a prompt template
 * 
 * @route DELETE /api/superadmin/prompts/templates/:templateId
 */
export async function deletePromptTemplateController(req: Request, res: Response): Promise<void> {
  try {
    const templateId = parseInt(req.params.templateId, 10);
    
    if (isNaN(templateId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid template ID'
      });
      return;
    }
    
    const deletedTemplate = await prompts.templates.deletePromptTemplate(templateId);
    
    if (!deletedTemplate) {
      res.status(404).json({
        success: false,
        message: `Prompt template with ID ${templateId} not found`
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Prompt template successfully deactivated',
      data: deletedTemplate
    });
  } catch (error) {
    logger.error('Error deleting prompt template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete prompt template',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}