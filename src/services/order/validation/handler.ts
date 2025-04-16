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
import { createDraftOrder } from './draft-order';
import { getNextAttemptNumber, logValidationAttempt } from './attempt-tracking';

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
  patientInfo: PatientInfo,
  userId: number,
  orgId: number,
  orderId?: number,
  isOverrideValidation: boolean = false,
  radiologyOrganizationId?: number
): Promise<ValidationRequestResponse> {
  try {
    let orderIdToUse: number;
    let attemptNumber = 1;
    
    // If no orderId provided, create a draft order
    if (!orderId) {
      orderIdToUse = await createDraftOrder(dictationText, userId, patientInfo, radiologyOrganizationId);
    } else {
      orderIdToUse = orderId;
      
      // Get the current attempt number for this order
      attemptNumber = await getNextAttemptNumber(orderIdToUse);
    }
    
    // Call the validation engine
    const validationContext: ValidationContext = {
      patientInfo,
      userId,
      orgId,
      orderId: orderIdToUse,
      isOverrideValidation
    };
    
    const validationResult: ValidationResult = await ValidationService.runValidation(dictationText, validationContext);
    
    // Log the validation attempt in the PHI database
    await logValidationAttempt(
      orderIdToUse,
      attemptNumber,
      dictationText,
      validationResult,
      userId
    );
    
    // Return the validation result without credit consumption
    return {
      success: true,
      orderId: orderIdToUse,
      validationResult
    };
  } catch (error) {
    console.error('Error handling validation request:', error);
    
    // If it's our custom error object with status, pass it through
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    
    // Otherwise wrap in a generic error
    throw error;
  }
}