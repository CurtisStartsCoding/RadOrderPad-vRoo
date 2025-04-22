/**
 * Enhanced types for advanced log filtering
 */
import { LlmValidationLogFilters, CreditUsageLogFilters, PurgatoryEventFilters } from './logs';

/**
 * Date range preset options
 */
export type DateRangePreset = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'last_month' | 'custom';

/**
 * Sort direction options
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Enhanced filters for LLM Validation Logs
 */
export interface EnhancedLlmValidationLogFilters extends LlmValidationLogFilters {
  // Multiple status values
  statuses?: string[];
  
  // Text search
  search_text?: string;
  
  // Date range presets
  date_preset?: DateRangePreset;
  
  // Sort options
  sort_by?: 'created_at' | 'latency_ms' | 'total_tokens' | 'status';
  sort_direction?: SortDirection;
  
  // Multiple providers or models
  llm_providers?: string[];
  model_names?: string[];
}

/**
 * Enhanced filters for Credit Usage Logs
 */
export interface EnhancedCreditUsageLogFilters extends CreditUsageLogFilters {
  // Multiple action types
  action_types?: string[];
  
  // Text search
  search_text?: string;
  
  // Date range presets
  date_preset?: DateRangePreset;
  
  // Sort options
  sort_by?: 'created_at' | 'tokens_burned';
  sort_direction?: SortDirection;
}

/**
 * Enhanced filters for Purgatory Events
 */
export interface EnhancedPurgatoryEventFilters extends PurgatoryEventFilters {
  // Multiple statuses
  statuses?: string[];
  
  // Multiple reasons
  reasons?: string[];
  
  // Text search
  search_text?: string;
  
  // Date range presets
  date_preset?: DateRangePreset;
  
  // Sort options
  sort_by?: 'created_at' | 'resolved_at';
  sort_direction?: SortDirection;
}