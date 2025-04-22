/**
 * Controller for enhanced LLM validation logs listing with advanced filtering
 */
import { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { logs } from '../../../services/superadmin';
import logger from '../../../utils/logger';
import { EnhancedLlmValidationLogFilters, DateRangePreset, SortDirection } from '../../../types/enhanced-logs';

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
 * Parse array parameter from query string
 *
 * @param value Query parameter value
 * @returns Array of strings or undefined
 */
function parseArrayParam(value: any): string[] | undefined {
  if (!value) return undefined;
  
  if (Array.isArray(value)) {
    return value.map(v => String(v)).filter(v => v.trim() !== '');
  }
  
  if (typeof value === 'object') {
    // Handle ParsedQs object
    return Object.values(value).map(v => String(v)).filter(v => v.trim() !== '');
  }
  
  // Handle comma-separated values
  return String(value).split(',').map(v => v.trim()).filter(v => v !== '');
}

/**
 * Enhanced list LLM validation logs with advanced filtering
 * 
 * @route GET /api/superadmin/logs/validation/enhanced
 */
export async function listLlmValidationLogsEnhancedController(req: Request, res: Response): Promise<void> {
  try {
    // Extract filter parameters from query string
    const filters: EnhancedLlmValidationLogFilters = {
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
      model_name: req.query.model_name as string | undefined,
      
      // Enhanced filters
      statuses: parseArrayParam(req.query.statuses),
      llm_providers: parseArrayParam(req.query.llm_providers),
      model_names: parseArrayParam(req.query.model_names),
      search_text: req.query.search_text as string | undefined,
      date_preset: req.query.date_preset as DateRangePreset | undefined,
      sort_by: req.query.sort_by as 'created_at' | 'latency_ms' | 'total_tokens' | 'status' | undefined,
      sort_direction: req.query.sort_direction as SortDirection | undefined
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
    
    // Validate sort parameters
    const validSortByValues = ['created_at', 'latency_ms', 'total_tokens', 'status'];
    if (filters.sort_by && !validSortByValues.includes(filters.sort_by)) {
      res.status(400).json({
        success: false,
        message: `Invalid sort_by parameter. Must be one of: ${validSortByValues.join(', ')}`
      });
      return;
    }
    
    const validSortDirections = ['asc', 'desc'];
    if (filters.sort_direction && !validSortDirections.includes(filters.sort_direction)) {
      res.status(400).json({
        success: false,
        message: `Invalid sort_direction parameter. Must be one of: ${validSortDirections.join(', ')}`
      });
      return;
    }
    
    // Validate date preset
    const validDatePresets = ['today', 'yesterday', 'last_7_days', 'last_30_days', 'this_month', 'last_month', 'custom'];
    if (filters.date_preset && !validDatePresets.includes(filters.date_preset)) {
      res.status(400).json({
        success: false,
        message: `Invalid date_preset parameter. Must be one of: ${validDatePresets.join(', ')}`
      });
      return;
    }
    
    const result = await logs.listLlmValidationLogsEnhanced(filters);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error in enhanced LLM validation logs listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list LLM validation logs with enhanced filtering',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}