/**
 * Types related to system logs
 */

/**
 * LLM Validation Log entry
 */
export interface LlmValidationLog {
  id: number;
  order_id: number;
  validation_attempt_id: number;
  user_id: number;
  organization_id: number;
  llm_provider: string;
  model_name: string;
  prompt_template_id?: number | null;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
  latency_ms?: number | null;
  status: string;
  error_message?: string | null;
  raw_response_digest?: string | null;
  created_at: Date;
  
  // Joined fields
  user_name?: string;
  organization_name?: string;
}

/**
 * Credit Usage Log entry
 */
export interface CreditUsageLog {
  id: number;
  organization_id: number;
  user_id: number;
  order_id: number;
  validation_attempt_id?: number | null;
  tokens_burned: number;
  action_type: string;
  created_at: Date;
  
  // Joined fields
  user_name?: string;
  organization_name?: string;
}

/**
 * Purgatory Event entry
 */
export interface PurgatoryEvent {
  id: number;
  organization_id: number;
  reason: string;
  triggered_by?: string | null;
  triggered_by_id?: number | null;
  status: string;
  created_at: Date;
  resolved_at?: Date | null;
  
  // Joined fields
  organization_name?: string;
  triggered_by_name?: string;
}

/**
 * Filters for LLM Validation Logs
 */
export interface LlmValidationLogFilters {
  organization_id?: number;
  user_id?: number;
  date_range_start?: Date;
  date_range_end?: Date;
  status?: string;
  llm_provider?: string;
  model_name?: string;
  limit?: number;
  offset?: number;
}

/**
 * Filters for Credit Usage Logs
 */
export interface CreditUsageLogFilters {
  organization_id?: number;
  user_id?: number;
  date_range_start?: Date;
  date_range_end?: Date;
  action_type?: string;
  limit?: number;
  offset?: number;
}

/**
 * Filters for Purgatory Events
 */
export interface PurgatoryEventFilters {
  organization_id?: number;
  date_range_start?: Date;
  date_range_end?: Date;
  status?: string;
  reason?: string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated response for logs
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}