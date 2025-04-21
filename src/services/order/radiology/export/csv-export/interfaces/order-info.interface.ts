/**
 * Interface for order information in CSV export
 */
export interface OrderInfo {
  // Basic order information
  order_id: number;
  order_number: string;
  status: string;
  priority: string;
  modality: string;
  body_part: string;
  laterality: string;
  
  // Clinical information
  cpt_code: string;
  cpt_description: string;
  icd10_codes: string;
  icd10_descriptions: string;
  clinical_indication: string;
  original_dictation: string;
  validation_status: string;
  compliance_score: number | string;
  contrast_indicated: string;
  auc_outcome: string;
  guideline_source: string;
  
  // Order history
  order_created_at?: string;
  order_updated_at?: string;
  order_signed_at?: string;
  order_signed_by?: string;
  sent_to_radiology_at?: string;
  scheduled_at?: string;
  completed_at?: string;
}