import { ValidationStatus } from './validation-types';
/**
 * Order interface representing a radiology order
 */
export interface Order {
    id: number;
    order_number: string;
    patient_id: number;
    referring_organization_id: number;
    radiology_organization_id: number;
    originating_location_id?: number;
    target_facility_id?: number;
    created_by_user_id: number;
    signed_by_user_id?: number;
    updated_by_user_id?: number;
    status: OrderStatus;
    priority: OrderPriority;
    original_dictation?: string;
    clinical_indication?: string;
    modality?: string;
    body_part?: string;
    laterality?: string;
    final_cpt_code?: string;
    final_cpt_code_description?: string;
    final_icd10_codes?: string;
    final_icd10_code_descriptions?: string;
    is_contrast_indicated?: boolean;
    final_validation_status?: ValidationStatus;
    final_compliance_score?: number;
    final_validation_notes?: string;
    validated_at?: Date;
    override_justification?: string;
    overridden?: boolean;
    is_urgent_override?: boolean;
    signature_date?: Date;
    created_at: Date;
    updated_at: Date;
    referring_physician_name?: string;
    referring_physician_npi?: string;
    radiology_organization_name?: string;
    referring_physician_phone?: string;
    referring_physician_email?: string;
    referring_physician_fax?: string;
    referring_physician_address?: string;
    referring_physician_city?: string;
    referring_physician_state?: string;
    referring_physician_zip?: string;
    referring_physician_specialty?: string;
    referring_physician_license?: string;
    referring_organization_address?: string;
    referring_organization_city?: string;
    referring_organization_state?: string;
    referring_organization_zip?: string;
    referring_organization_phone?: string;
    referring_organization_fax?: string;
    referring_organization_email?: string;
    referring_organization_tax_id?: string;
    referring_organization_npi?: string;
    radiology_organization_address?: string;
    radiology_organization_city?: string;
    radiology_organization_state?: string;
    radiology_organization_zip?: string;
    radiology_organization_phone?: string;
    radiology_organization_fax?: string;
    radiology_organization_email?: string;
    radiology_organization_tax_id?: string;
    radiology_organization_npi?: string;
    patient_consent_obtained?: boolean;
    patient_consent_date?: Date;
    insurance_authorization_number?: string;
    insurance_authorization_date?: Date;
    insurance_authorization_contact?: string;
    medical_necessity_documentation?: string;
}
/**
 * Order status enum
 */
export declare enum OrderStatus {
    DRAFT = "draft",
    PENDING_VALIDATION = "pending_validation",
    PENDING_ADMIN = "pending_admin",
    PENDING_RADIOLOGY = "pending_radiology",
    OVERRIDE_PENDING_SIGNATURE = "override_pending_signature",
    SCHEDULED = "scheduled",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    RESULTS_AVAILABLE = "results_available",
    RESULTS_ACKNOWLEDGED = "results_acknowledged"
}
/**
 * Order priority enum
 */
export declare enum OrderPriority {
    ROUTINE = "routine",
    STAT = "stat"
}
/**
 * Order history interface
 */
export interface OrderHistory {
    id: number;
    order_id: number;
    user_id?: number;
    event_type: string;
    previous_status?: string;
    new_status?: string;
    details?: string;
    created_at: Date;
}
