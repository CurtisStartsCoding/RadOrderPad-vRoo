import { withTransaction } from '../utils/transaction';
import parseEmrSummary from '../emr-parser';
import * as clinicalRecordManager from '../clinical-record-manager';
import * as patientManager from '../patient-manager';
import * as insuranceManager from '../insurance-manager';
import { EmrSummaryResult } from '../types';

/**
 * Handle pasted EMR summary
 * @param orderId Order ID
 * @param pastedText Pasted EMR summary text
 * @param userId User ID
 * @returns Promise with result
 */
export async function handlePasteSummary(
  orderId: number, 
  pastedText: string, 
  userId: number
): Promise<EmrSummaryResult> {
  return withTransaction(async (_client) => {
    // 1. Verify order exists and has status 'pending_admin'
    const order = await clinicalRecordManager.verifyOrderStatus(orderId);
    
    // 2. Save the raw pasted text to patient_clinical_records
    await clinicalRecordManager.saveEmrSummary(orderId, order.patient_id, pastedText, userId);
    
    // 3. Parse the text to extract patient demographics and insurance details
    const parsedData = parseEmrSummary(pastedText);
    
    // 4. Update patient information with extracted data
    if (parsedData.patientInfo) {
      await patientManager.updatePatientFromEmr(order.patient_id, parsedData.patientInfo);
    }
    
    // 5. Create/Update insurance information with extracted data
    if (parsedData.insuranceInfo) {
      await insuranceManager.updateInsuranceFromEmr(order.patient_id, parsedData.insuranceInfo);
    }
    
    return {
      success: true,
      orderId,
      message: 'EMR summary processed successfully',
      parsedData
    };
  });
}

export default handlePasteSummary;