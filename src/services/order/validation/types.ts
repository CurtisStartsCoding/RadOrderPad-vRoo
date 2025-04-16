/**
 * Types for validation request handling
 */
import { ValidationResult } from '../../../models';

/**
 * Validation context containing information needed for validation
 */
export interface ValidationContext {
  patientInfo: any;
  userId: number;
  orgId: number;
  orderId: number;
  isOverrideValidation: boolean;
}

/**
 * Response from validation request handling
 */
export interface ValidationRequestResponse {
  success: boolean;
  orderId: number;
  validationResult: ValidationResult;
}

/**
 * Patient information required for order creation
 */
export interface PatientInfo {
  id: number;
  [key: string]: any;
}