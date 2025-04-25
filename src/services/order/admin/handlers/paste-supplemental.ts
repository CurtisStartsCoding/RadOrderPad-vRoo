import * as clinicalRecordManager from '../clinical-record-manager';
import { SupplementalDocResult } from '../types';
import logger from '../../../../utils/logger';

/**
 * Handle pasted supplemental documents
 * @param orderId Order ID
 * @param pastedText Pasted supplemental text
 * @param userId User ID
 * @returns Promise with result
 */
export async function handlePasteSupplemental(
  orderId: number, 
  pastedText: string, 
  userId: number
): Promise<SupplementalDocResult> {
  try {
    // 1. Verify order exists and has status 'pending_admin'
    const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    
    // 2. Save the raw pasted text to patient_clinical_records
    await clinicalRecordManager.saveSupplementalDocument(orderId, order.patient_id, pastedText, userId);
    
    return {
      success: true,
      orderId,
      message: 'Supplemental documents saved successfully'
    };
  } catch (error) {
    logger.error('Error in handlePasteSupplemental:', {
      error,
      orderId,
      userId
    });
    throw error;
  }
}

export default handlePasteSupplemental;