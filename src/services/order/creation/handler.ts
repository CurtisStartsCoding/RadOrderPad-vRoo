/**
 * Order Creation Handler
 * 
 * This service handles the creation and finalization of orders
 * after the physician completes the validation process and signs the order.
 */

import { getPhiDbClient } from '../../../config/db';
import { OrderStatus } from '../../../models';
import { logValidationAttempt } from '../../validation/logging';
import orderHistoryService from '../../order-history.service';
import { handlePatient } from './patient-handling';
import { persistOrder } from './order-persistence';
import { handleSignature } from './signature-handling';
import { createFinalizationLLMResponse } from './llm-utils';
import { CreateFinalizedOrderPayload, OrderCreationResponse } from './types';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Handle order creation and finalization
 * @param payload Order creation payload
 * @param userId User ID of the physician
 * @param referringOrganizationId Organization ID of the referring organization
 * @returns Order creation response
 */
export async function handleOrderCreation(
  payload: CreateFinalizedOrderPayload,
  userId: number,
  referringOrganizationId: number
): Promise<OrderCreationResponse> {
  // Get PHI database client for transaction
  const phiClient = await getPhiDbClient();
  
  try {
    // Start transaction
    await phiClient.query('BEGIN');
    
    // Handle patient (find existing or create new)
    const patientId = await handlePatient(
      phiClient,
      payload.patientInfo,
      referringOrganizationId
    );
    
    // Persist order
    const orderId = await persistOrder(
      phiClient,
      payload,
      patientId,
      userId,
      referringOrganizationId
    );
    
    // Handle signature
    await handleSignature(
      phiClient,
      orderId,
      patientId,
      userId,
      payload.signatureData
    );
    
    // Log validation attempt
    await logValidationAttempt(
      payload.dictationText,
      {
        ...payload.finalValidationResult,
        internalReasoning: payload.finalValidationResult.internalReasoning || 'Final validation from order creation'
      },
      createFinalizationLLMResponse(),
      orderId,
      userId
    );
    
    // Log order history events
    await orderHistoryService.logOrderHistory(
      phiClient,
      orderId,
      userId,
      '', // No previous status for new order
      OrderStatus.PENDING_ADMIN,
      'order_created'
    );
    
    await orderHistoryService.logOrderHistory(
      phiClient,
      orderId,
      userId,
      OrderStatus.PENDING_ADMIN,
      OrderStatus.PENDING_ADMIN, // Status doesn't change
      'order_signed'
    );
    
    // Commit transaction
    await phiClient.query('COMMIT');
    
    // Return success response
    return {
      success: true,
      orderId,
      message: "Order created and submitted successfully."
    };
  } catch (error) {
    // Rollback transaction on error
    await phiClient.query('ROLLBACK');
    
    enhancedLogger.error('Error in handleOrderCreation:', error);
    
    // Re-throw error to be handled by controller
    throw error;
  } finally {
    // Release client back to pool
    phiClient.release();
  }
}