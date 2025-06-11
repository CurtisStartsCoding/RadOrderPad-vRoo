/**
 * Order Persistence Service
 * 
 * This service handles the persistence of order data to the database.
 */

import { PoolClient } from 'pg';
import { OrderStatus } from '../../../models';
import { CreateFinalizedOrderPayload } from './types';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Persist order to database
 * 
 * @param client Database client
 * @param payload Order creation payload
 * @param patientId Patient ID
 * @param userId User ID
 * @param referringOrganizationId Organization ID
 * @returns Order ID
 */
export async function persistOrder(
  client: PoolClient,
  payload: CreateFinalizedOrderPayload,
  patientId: number,
  userId: number,
  referringOrganizationId: number
): Promise<number> {
  try {
    // Extract primary CPT code
    const primaryCptCode = payload.finalValidationResult.suggestedCPTCodes.find(code => code.isPrimary)?.code || 
                          payload.finalValidationResult.suggestedCPTCodes[0]?.code;
    
    const primaryCptDescription = payload.finalValidationResult.suggestedCPTCodes.find(code => code.isPrimary)?.description || 
                                 payload.finalValidationResult.suggestedCPTCodes[0]?.description;
    
    // Format ICD10 codes for storage
    const icd10Codes = payload.finalValidationResult.suggestedICD10Codes.map(code => code.code);
    const icd10Descriptions = payload.finalValidationResult.suggestedICD10Codes.map(code => code.description);
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Insert order record
    const orderResult = await client.query(
      `INSERT INTO orders (
        order_number,
        patient_id,
        referring_organization_id,
        radiology_organization_id,
        originating_location_id,
        created_by_user_id,
        signed_by_user_id,
        status,
        priority,
        original_dictation,
        clinical_indication,
        final_cpt_code,
        final_cpt_code_description,
        final_icd10_codes,
        final_icd10_code_descriptions,
        final_validation_status,
        final_compliance_score,
        final_validation_notes,
        overridden,
        override_justification,
        signature_date,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW(), NOW()
      ) RETURNING id`,
      [
        orderNumber,
        patientId,
        referringOrganizationId,
        payload.radiologyOrganizationId || null,
        payload.originatingLocationId || null,
        userId,
        userId, // signed_by_user_id is the same as created_by_user_id
        OrderStatus.PENDING_ADMIN,
        'routine', // Default priority
        payload.dictationText,
        payload.dictationText, // Use dictation as clinical indication initially
        primaryCptCode,
        primaryCptDescription,
        JSON.stringify(icd10Codes),
        JSON.stringify(icd10Descriptions),
        payload.finalValidationResult.validationStatus,
        payload.finalValidationResult.complianceScore,
        payload.finalValidationResult.feedback,
        payload.isOverride,
        payload.overrideJustification || null,
      ]
    );
    
    return orderResult.rows[0].id;
  } catch (error) {
    enhancedLogger.error('Error in persistOrder:', error);
    throw error;
  }
}