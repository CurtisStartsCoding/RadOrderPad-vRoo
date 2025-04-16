import { ValidationStatus } from './validation-types';
import { PatientInfo } from './patient-types';
/**
 * Order finalization request interface
 */
export interface OrderFinalizationRequest {
    finalValidationStatus: ValidationStatus;
    finalComplianceScore: number;
    finalICD10Codes: string;
    finalICD10CodeDescriptions: string;
    finalCPTCode: string;
    finalCPTCodeDescription: string;
    clinicalIndication: string;
    isTemporaryPatient?: boolean;
    patientInfo?: PatientInfo;
    overridden?: boolean;
    overrideJustification?: string;
    isUrgentOverride?: boolean;
    signatureData?: string;
}
