import { OrderInfo } from '../interfaces';
import { formatBoolean, formatDate, safeString, joinArray } from '../utils';

/**
 * Transform order data for CSV export
 * @param order Order data from database
 * @returns Transformed order info for CSV
 */
export function transformOrderData(order: Record<string, unknown>): OrderInfo {
  if (!order) {
    throw new Error('Order data is required for CSV export');
  }

  return {
    // Basic order information
    order_id: Number(order.id),
    order_number: safeString(order.order_number),
    status: safeString(order.status),
    priority: safeString(order.priority),
    modality: safeString(order.modality),
    body_part: safeString(order.body_part),
    laterality: safeString(order.laterality),
    
    // Clinical information
    cpt_code: safeString(order.final_cpt_code),
    cpt_description: safeString(order.final_cpt_code_description),
    icd10_codes: Array.isArray(order.final_icd10_codes) 
      ? joinArray(order.final_icd10_codes) 
      : safeString(order.final_icd10_codes),
    icd10_descriptions: Array.isArray(order.final_icd10_code_descriptions) 
      ? joinArray(order.final_icd10_code_descriptions) 
      : safeString(order.final_icd10_code_descriptions),
    clinical_indication: safeString(order.clinical_indication),
    original_dictation: safeString(order.original_dictation),
    validation_status: safeString(order.final_validation_status),
    compliance_score: order.final_compliance_score !== undefined ? 
      (typeof order.final_compliance_score === 'number' ? 
        order.final_compliance_score : 
        safeString(order.final_compliance_score)) : 
      '',
    contrast_indicated: formatBoolean(order.is_contrast_indicated as boolean),
    auc_outcome: safeString(order.auc_outcome),
    guideline_source: safeString(order.guideline_source),
    
    // Order history timestamps
    order_created_at: formatDate(order.created_at as string | Date),
    order_updated_at: formatDate(order.updated_at as string | Date),
    order_signed_at: formatDate(order.signature_date as string | Date),
    order_signed_by: order.signed_by_user_id ? `User ID: ${order.signed_by_user_id}` : ''
  };
}