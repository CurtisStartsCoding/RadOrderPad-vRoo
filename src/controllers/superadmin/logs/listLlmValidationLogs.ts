/**
 * Controller for LLM validation logs listing
 */
import { Request, Response } from 'express';
import { logs } from '../../../services/superadmin';
import logger from '../../../utils/logger';
import { LlmValidationLogFilters } from '../../../types/logs';

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
 * List LLM validation logs with basic filtering
 * 
 * @route GET /api/superadmin/logs/validation
 */
export async function listLlmValidationLogsController(req: Request, res: Response): Promise<void> {
  try {
    // Extract filter parameters from query string
    const filters: LlmValidationLogFilters = {
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
    logger.error('Error in LLM validation logs listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list LLM validation logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}