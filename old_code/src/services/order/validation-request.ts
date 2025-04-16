import { queryMainDb, queryPhiDb } from '../../config/db';
import {
  OrderStatus,
  OrderPriority,
  ValidationResult
} from '../../models';
import ValidationService from '../validation.service';
import BillingService, { InsufficientCreditsError } from '../billing.service';

/**
 * Handle validation request for an order
 */
export async function handleValidationRequest(
  dictationText: string,
  patientInfo: any,
  userId: number,
  orgId: number,
  orderId?: number,
  isOverrideValidation: boolean = false,
  radiologyOrganizationId?: number
): Promise<{ success: boolean; orderId: number; validationResult: ValidationResult }> {
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
    const validationContext = {
      patientInfo,
      userId,
      orgId,
      orderId: orderIdToUse,
      isOverrideValidation
    };
    
    const validationResult = await ValidationService.runValidation(dictationText, validationContext);
    
    // Log the validation attempt in the PHI database
    await logValidationAttempt(
      orderIdToUse,
      attemptNumber,
      dictationText,
      validationResult,
      userId
    );
    
    // Log credit usage
    const actionType = isOverrideValidation ? 'override_validate' : 'validate';
    try {
      await BillingService.burnCredit(orgId, userId, orderIdToUse, actionType);
      
      return {
        success: true,
        orderId: orderIdToUse,
        validationResult
      };
    } catch (error) {
      // Handle insufficient credits error
      if (error instanceof InsufficientCreditsError) {
        console.warn(`Insufficient credits for organization ${orgId}: ${error.message}`);
        throw {
          status: 402, // Payment Required
          message: 'Insufficient validation credits. Please contact your administrator to purchase more credits.',
          code: 'INSUFFICIENT_CREDITS',
          orderId: orderIdToUse
        };
      }
      
      // Re-throw other errors
      throw error;
    }
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

/**
 * Create a new draft order
 */
async function createDraftOrder(dictationText: string, userId: number, patientInfo: any, radiologyOrganizationId?: number): Promise<number> {
  // Get user information to determine organization
  const userResult = await queryMainDb(
    'SELECT organization_id FROM users WHERE id = $1',
    [userId]
  );
  
  if (userResult.rows.length === 0) {
    throw new Error('User not found');
  }
  
  const user = userResult.rows[0];
  
  // Extract patient ID from patientInfo
  const patientId = patientInfo?.id;
  
  if (!patientId) {
    throw new Error('Patient ID is required');
  }
  
  // Use default radiology organization ID if not provided
  const radOrgId = radiologyOrganizationId || 1; // Default to 1 if not provided
  
  // Create a new order in the PHI database
  const orderResult = await queryPhiDb(
    `INSERT INTO orders
    (order_number, referring_organization_id, radiology_organization_id,
    created_by_user_id, status, priority, original_dictation, patient_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`,
    [
      `ORD-${Date.now()}`, // Generate a temporary order number
      user.organization_id, // Referring organization
      radOrgId, // Radiology organization
      userId, // Created by user
      OrderStatus.PENDING_VALIDATION, // Status
      OrderPriority.ROUTINE, // Priority
      dictationText, // Original dictation
      patientId // Patient ID
    ]
  );
  
  const orderId = orderResult.rows[0].id;
  
  // Create order history entry
  await queryPhiDb(
    `INSERT INTO order_history 
    (order_id, user_id, event_type, new_status, created_at) 
    VALUES ($1, $2, $3, $4, NOW())`,
    [
      orderId,
      userId,
      'created',
      OrderStatus.PENDING_VALIDATION
    ]
  );
  
  return orderId;
}

/**
 * Get the next attempt number for an order
 */
async function getNextAttemptNumber(orderId: number): Promise<number> {
  const attemptResult = await queryPhiDb(
    'SELECT MAX(attempt_number) as max_attempt FROM validation_attempts WHERE order_id = $1',
    [orderId]
  );
  
  if (attemptResult.rows.length > 0 && attemptResult.rows[0].max_attempt) {
    return attemptResult.rows[0].max_attempt + 1;
  }
  
  return 1;
}

/**
 * Log a validation attempt
 */
async function logValidationAttempt(
  orderId: number,
  attemptNumber: number,
  dictationText: string,
  validationResult: ValidationResult,
  userId: number
): Promise<void> {
  await queryPhiDb(
    `INSERT INTO validation_attempts 
    (order_id, attempt_number, validation_input_text, validation_outcome, 
    generated_icd10_codes, generated_cpt_codes, generated_feedback_text, 
    generated_compliance_score, user_id, created_at) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
    [
      orderId,
      attemptNumber,
      dictationText,
      validationResult.validationStatus,
      JSON.stringify(validationResult.suggestedICD10Codes),
      JSON.stringify(validationResult.suggestedCPTCodes),
      validationResult.feedback,
      validationResult.complianceScore,
      userId
    ]
  );
}