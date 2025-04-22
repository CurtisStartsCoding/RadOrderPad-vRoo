/**
 * Controller functions for viewing system logs
 */
import { Request, Response } from 'express';
import { logs } from '../../services/superadmin';
import logger from '../../utils/logger';
import { listLlmValidationLogsEnhancedController } from './logs/listLlmValidationLogsEnhanced';

// Export the enhanced controller
export { listLlmValidationLogsEnhancedController };

/**
 * Parse a date string from query parameters
 * 
 * @param dateStr Date string from query parameter
 * @returns Date object or undefined if invalid
 */
function parseDate(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined;
  
  try {
    return new Date(dateStr);
  } catch {
    return undefined;
  }
}

/**
 * Parse pagination parameters from query
 * 
 * @param req Express request
 * @returns Object with limit and offset
 */
function parsePagination(req: Request): { limit?: number; offset?: number } {
  const pagination: { limit?: number; offset?: number } = {};
  
  if (req.query.limit) {
    const limit = parseInt(req.query.limit as string, 10);
    if (!isNaN(limit) && limit > 0) {
      pagination.limit = limit;
    }
  }
  
  if (req.query.offset) {
    const offset = parseInt(req.query.offset as string, 10);
    if (!isNaN(offset) && offset >= 0) {
      pagination.offset = offset;
    }
  }
  
  return pagination;
}

/**
 * List LLM validation logs with filtering
 * 
 * @route GET /api/superadmin/logs/validation
 */
export async function listLlmValidationLogsController(req: Request, res: Response): Promise<void> {
  try {
    // Extract filter parameters from query string
    const filters = {
      ...parsePagination(req),
      organization_id: req.query.organization_id !== undefined 
        ? parseInt(req.query.organization_id as string, 10) 
        : undefined,
      user_id: req.query.user_id !== undefined 
        ? parseInt(req.query.user_id as string, 10) 
        : undefined,
      date_range_start: parseDate(req.query.date_range_start as string),
      date_range_end: parseDate(req.query.date_range_end as string),
      status: req.query.status as string | undefined,
      llm_provider: req.query.llm_provider as string | undefined,
      model_name: req.query.model_name as string | undefined
    };
    
    // Validate numeric parameters
    if (
      (filters.organization_id !== undefined && isNaN(filters.organization_id)) ||
      (filters.user_id !== undefined && isNaN(filters.user_id))
    ) {
      res.status(400).json({
        success: false,
        message: 'Invalid filter parameters: organization_id and user_id must be numbers'
      });
      return;
    }
    
    const result = await logs.listLlmValidationLogs(filters);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error listing LLM validation logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list LLM validation logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * List credit usage logs with filtering
 * 
 * @route GET /api/superadmin/logs/credits
 */
export async function listCreditUsageLogsController(req: Request, res: Response): Promise<void> {
  try {
    // Extract filter parameters from query string
    const filters = {
      ...parsePagination(req),
      organization_id: req.query.organization_id !== undefined 
        ? parseInt(req.query.organization_id as string, 10) 
        : undefined,
      user_id: req.query.user_id !== undefined 
        ? parseInt(req.query.user_id as string, 10) 
        : undefined,
      date_range_start: parseDate(req.query.date_range_start as string),
      date_range_end: parseDate(req.query.date_range_end as string),
      action_type: req.query.action_type as string | undefined
    };
    
    // Validate numeric parameters
    if (
      (filters.organization_id !== undefined && isNaN(filters.organization_id)) ||
      (filters.user_id !== undefined && isNaN(filters.user_id))
    ) {
      res.status(400).json({
        success: false,
        message: 'Invalid filter parameters: organization_id and user_id must be numbers'
      });
      return;
    }
    
    const result = await logs.listCreditUsageLogs(filters);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error listing credit usage logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list credit usage logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * List purgatory events with filtering
 * 
 * @route GET /api/superadmin/logs/purgatory
 */
export async function listPurgatoryEventsController(req: Request, res: Response): Promise<void> {
  try {
    // Extract filter parameters from query string
    const filters = {
      ...parsePagination(req),
      organization_id: req.query.organization_id !== undefined 
        ? parseInt(req.query.organization_id as string, 10) 
        : undefined,
      date_range_start: parseDate(req.query.date_range_start as string),
      date_range_end: parseDate(req.query.date_range_end as string),
      status: req.query.status as string | undefined,
      reason: req.query.reason as string | undefined
    };
    
    // Validate numeric parameters
    if (filters.organization_id !== undefined && isNaN(filters.organization_id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid filter parameters: organization_id must be a number'
      });
      return;
    }
    
    const result = await logs.listPurgatoryEvents(filters);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error listing purgatory events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list purgatory events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}