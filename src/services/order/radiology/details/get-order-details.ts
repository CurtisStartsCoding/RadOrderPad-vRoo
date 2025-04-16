import { OrderDetails } from '../types';
import { fetchOrder } from './fetch-order';
import { fetchPatient } from './fetch-patient';
import { fetchInsurance } from './fetch-insurance';
import { fetchClinicalRecords } from './fetch-clinical-records';
import { fetchDocumentUploads } from './fetch-document-uploads';
import { fetchValidationAttempts } from './fetch-validation-attempts';
import { fetchOrderHistory } from './fetch-order-history';

/**
 * Get full details of an order
 * @param orderId Order ID
 * @param orgId Radiology organization ID
 * @returns Promise with order details
 */
export async function getOrderDetails(orderId: number, orgId: number): Promise<OrderDetails> {
  try {
    // 1. Get the order
    const order = await fetchOrder(orderId, orgId);
    
    // 2. Get patient information
    const patient = await fetchPatient(order.patient_id);
    
    // 3. Get insurance information
    const insurance = await fetchInsurance(order.patient_id);
    
    // 4. Get clinical records
    const clinicalRecords = await fetchClinicalRecords(orderId);
    
    // 5. Get document uploads
    const documentUploads = await fetchDocumentUploads(orderId);
    
    // 6. Get validation attempts
    const validationAttempts = await fetchValidationAttempts(orderId);
    
    // 7. Get order history
    const orderHistory = await fetchOrderHistory(orderId);
    
    // Combine all data into a comprehensive order package
    return {
      order,
      patient,
      insurance,
      clinicalRecords,
      documentUploads,
      validationAttempts,
      orderHistory
    };
  } catch (error) {
    console.error('Error in getOrderDetails:', error);
    throw error;
  }
}

export default getOrderDetails;