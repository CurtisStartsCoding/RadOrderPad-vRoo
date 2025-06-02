/**
 * Types for validation request handling
 */
import { ValidationResult } from '../../../models';
import { PatientInfo } from '../../common/types';

// Re-export PatientInfo for backward compatibility
export { PatientInfo };

/**
 * Validation context containing information needed for validation
 */
export interface ValidationContext {
  patientInfo?: Record<string, unknown>;
  userId: number;
  orgId: number;
  orderId?: number;
  isOverrideValidation: boolean;
}

/**
 * Response from validation request handling
 */
export interface ValidationRequestResponse {
  success: boolean;
  orderId?: number;
  validationResult: ValidationResult;
}