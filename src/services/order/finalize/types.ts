import { Order, OrderStatus, ValidationStatus } from '../../../models';
import { PoolClient } from 'pg';

/**
 * Patient information for temporary patients
 */
export interface PatientInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  [key: string]: any; // Allow additional fields
}

/**
 * Payload for finalizing an order
 */
export interface FinalizeOrderPayload {
  finalValidationStatus: ValidationStatus;
  finalComplianceScore?: number;
  finalICD10Codes?: string[];
  finalICD10CodeDescriptions?: string[];
  finalCPTCode: string;
  finalCPTCodeDescription?: string;
  clinicalIndication: string;
  isTemporaryPatient?: boolean;
  patientInfo?: PatientInfo;
  overridden?: boolean;
  overrideJustification?: string;
  isUrgentOverride?: boolean;
  signatureData?: string;
}

/**
 * Response for finalize order operation
 */
export interface FinalizeOrderResponse {
  success: boolean;
  orderId: number;
  message: string;
  signatureUploadNote?: string; // Note about signature upload flow
}

/**
 * Transaction context for order finalization
 */
export interface TransactionContext {
  client: PoolClient;
  orderId: number;
  order: Order;
  userId: number;
  payload: FinalizeOrderPayload;
  patientId?: number;
}