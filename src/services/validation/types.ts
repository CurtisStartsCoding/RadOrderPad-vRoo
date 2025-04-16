/**
 * Types for validation service
 */
import { ValidationResult } from '../../models';
import { LLMResponse } from '../../utils/llm';

/**
 * Context for validation
 */
export interface ValidationContext {
  patientInfo?: any;
  userId?: number;
  orgId?: number;
  orderId?: number;
  isOverrideValidation?: boolean;
}

/**
 * Options for validation
 */
export interface ValidationOptions {
  testMode?: boolean;
}