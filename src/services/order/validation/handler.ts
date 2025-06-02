/**
 * Main handler for validation requests
 */
import ValidationService from '../../../services/validation';
import { ValidationResult } from '../../../models';
import {
  ValidationContext,
  ValidationRequestResponse,
  PatientInfo
} from './types';
// Imports commented out as they're no longer used in stateless validation
// import { createDraftOrder } from './draft-order';
// import { getNextAttemptNumber, logValidationAttempt } from './attempt-tracking';
import logger from '../../../utils/logger';

/**
 * Handle validation request for an order
 * 
 * @param dictationText - The dictation text to validate
 * @param patientInfo - Information about the patient
 * @param userId - The ID of the user requesting validation
 * @param orgId - The ID of the organization
 * @param orderId - Optional ID of an existing order
 * @param isOverrideValidation - Whether this is an override validation
 * @param radiologyOrganizationId - Optional ID of the radiology organization
 * @returns Object containing success status, order ID, and validation result
 */
export async function handleValidationRequest(
  dictationText: string,
  patientInfo: PatientInfo | undefined,
  userId: number,
  orgId: number,
  orderId?: number,
  isOverrideValidation: boolean = false,
  _radiologyOrganizationId?: number // Prefixed with underscore to indicate it's unused
): Promise<ValidationRequestResponse> {
  try {
    // Call the validation engine with a stateless context
    const validationContext: ValidationContext = {
      patientInfo: patientInfo || {},
      userId,
      orgId,
      orderId: orderId,
      isOverrideValidation
    };
    
    const validationResult: ValidationResult = await ValidationService.runValidation(dictationText, validationContext);
    
    // For stateless validation, we don't log to validation_attempts table
    // The LLM usage will still be logged by ValidationService.runValidation
    
    // Return the validation result without orderId for stateless calls
    return {
      success: true,
      ...(orderId && { orderId }), // Only include orderId if it was provided
      validationResult
    };
  } catch (error) {
    logger.error('Error handling validation request:', { error });
    
    // If it's our custom error object with status, pass it through
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    
    // Otherwise wrap in a generic error
    throw error;
  }
}