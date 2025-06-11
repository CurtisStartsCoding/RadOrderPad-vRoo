/**
 * Types for order creation and finalization
 */
import { ValidationStatus } from '../../../models';

/**
 * Interface for ICD10 code with description
 */
export interface ICD10CodeWithDescription {
  code: string;
  description: string;
  isPrimary?: boolean;
}

/**
 * Interface for CPT code with description
 */
export interface CPTCodeWithDescription {
  code: string;
  description: string;
  isPrimary?: boolean;
}

/**
 * Interface for patient information in order creation request
 */
export interface PatientInfoForOrder {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  mrn?: string;
  pidn?: string;
}

/**
 * Interface for final validation result in order creation request
 */
export interface FinalValidationResult {
  validationStatus: ValidationStatus;
  complianceScore: number;
  feedback: string;
  suggestedICD10Codes: ICD10CodeWithDescription[];
  suggestedCPTCodes: CPTCodeWithDescription[];
  internalReasoning?: string; // Added to match ValidationResult interface
}

/**
 * Interface for order creation and finalization request payload
 */
export interface CreateFinalizedOrderPayload {
  patientInfo: PatientInfoForOrder;
  dictationText: string;
  finalValidationResult: FinalValidationResult;
  isOverride: boolean;
  overrideJustification?: string;
  signatureData: string; // Base64 data URL or fileKey
  signerFullName: string;
  radiologyOrganizationId?: number;
  originatingLocationId?: number; // Location where the order was created
}

/**
 * Interface for order creation response
 */
export interface OrderCreationResponse {
  success: boolean;
  orderId: number;
  message: string;
}