/**
 * Types for validation service
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationResult } from '../../models';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LLMResponse } from '../../utils/llm';

/**
 * Context for validation
 */
export interface ValidationContext {
  patientInfo?: Record<string, unknown>;
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