/**
 * Context for validation
 */
export interface ValidationContext {
    patientInfo?: Record<string, unknown>;
    userId?: number;
    orgId?: number;
    orderId?: number;
    isOverrideValidation?: boolean;
}
/**
 * Options for validation
 */
export interface ValidationOptions {
    testMode?: boolean;
}
