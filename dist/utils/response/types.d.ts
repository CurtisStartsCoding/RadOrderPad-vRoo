import { ValidationStatus } from '../../models';
/**
 * Interface for partial information extracted from a malformed response
 */
export interface PartialInformation {
    complianceScore?: number;
    feedback?: string;
    icd10Codes?: Array<{
        code: string;
        description: string;
    }>;
    cptCodes?: Array<{
        code: string;
        description: string;
    }>;
}
/**
 * Interface for normalized response fields
 */
export interface NormalizedResponse {
    validationStatus: string;
    complianceScore: number;
    feedback: string;
    suggestedICD10Codes: Array<{
        code: string;
        description: string;
        isPrimary?: boolean;
    }>;
    suggestedCPTCodes: Array<{
        code: string;
        description: string;
        isPrimary?: boolean;
    }>;
    internalReasoning?: string;
}
/**
 * Type for field mapping
 */
export type FieldMap = Record<string, string>;
/**
 * Type for status mapping
 */
export type StatusMap = Record<string, ValidationStatus>;
