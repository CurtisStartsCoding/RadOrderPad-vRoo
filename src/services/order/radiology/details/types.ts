/**
 * Types for order details
 */

/**
 * Clinical record from patient_clinical_records table
 */
export interface ClinicalRecord {
  id: number;
  patient_id: number;
  order_id: number;
  record_type: string;
  content: string;
  added_by_id: number;
  added_at: Date;
  updated_at: Date;
  [key: string]: unknown; // For any additional fields
}

/**
 * Document upload
 */
export interface DocumentUpload {
  id: number;
  document_type?: string;
  filename: string;
  file_path: string;
  mime_type: string;
  uploaded_at: Date;
  [key: string]: unknown;
}

/**
 * Insurance information
 */
export interface Insurance {
  id: number;
  patient_id: number;
  insurer_name: string;
  policy_number: string;
  group_number?: string;
  plan_type?: string;
  policy_holder_name?: string;
  policy_holder_relationship?: string;
  policy_holder_date_of_birth?: Date;
  verification_status?: string;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
  [key: string]: unknown;
}

/**
 * Order history entry
 */
export interface OrderHistoryEntry {
  id: number;
  order_id: number;
  action: string;
  previous_status?: string;
  new_status?: string;
  performed_by_id: number;
  created_at: Date;
  notes?: string;
  [key: string]: unknown;
}

/**
 * Patient information
 */
export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  gender: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
  email?: string;
  mrn?: string;
  created_at: Date;
  updated_at: Date;
  [key: string]: unknown;
}

/**
 * Order information
 */
export interface Order {
  id: number;
  order_number: string;
  patient_id: number;
  radiology_organization_id: number;
  referring_organization_id: number;
  referring_physician_id?: number;
  referring_physician_name?: string;
  status: string;
  modality?: string;
  body_part?: string;
  laterality?: string;
  priority?: string;
  clinical_indication?: string;
  final_cpt_code?: string;
  final_cpt_code_description?: string;
  final_icd10_codes?: string[];
  final_icd10_code_descriptions?: string[];
  created_at: Date;
  updated_at: Date;
  [key: string]: unknown;
}

/**
 * Validation attempt
 */
export interface ValidationAttempt {
  id: number;
  attempt_number: number;
  validation_outcome: string;
  generated_compliance_score?: number;
  created_at: Date;
  [key: string]: unknown;
}