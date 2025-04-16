/**
 * Validation status enum
 */
export declare enum ValidationStatus {
    APPROPRIATE = "appropriate",
    INAPPROPRIATE = "inappropriate",
    NEEDS_CLARIFICATION = "needs_clarification",
    OVERRIDE = "override"
}
/**
 * Validation attempt interface
 */
export interface ValidationAttempt {
    id: number;
    order_id: number;
    attempt_number: number;
    validation_input_text: string;
    validation_outcome: string;
    generated_icd10_codes?: string;
    generated_cpt_codes?: string;
    generated_feedback_text?: string;
    generated_compliance_score?: number;
    is_rare_disease_feedback?: boolean;
    llm_validation_log_id?: number;
    user_id: number;
    created_at: Date;
}
/**
 * Validation result interface
 */
export interface ValidationResult {
    validationStatus: ValidationStatus;
    complianceScore: number;
    feedback: string;
    suggestedICD10Codes: Array<{
        code: string;
        description: string;
    }>;
    suggestedCPTCodes: Array<{
        code: string;
        description: string;
    }>;
    internalReasoning: string;
}
/**
 * Order validation request interface
 */
export interface OrderValidationRequest {
    dictationText: string;
    patientInfo?: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        gender: string;
        mrn?: string;
    };
    orderId?: number;
    isOverrideValidation?: boolean;
}
