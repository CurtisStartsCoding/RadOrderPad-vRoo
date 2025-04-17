/**
 * Types related to order processing, validation, and signature
 */

import { Patient } from './patient-types';
import { ValidationStatus } from './dictation-types';

/**
 * Order validation result interface
 */
export interface ValidationResult {
  /** Status of the validation */
  status: ValidationStatus;
  
  /** Main message to display */
  message: string;
  
  /** Optional detailed feedback */
  details?: string;
  
  /** Optional list of specific issues */
  issues?: Array<{
    type: string;
    message: string;
  }>;
  
  /** Parsed order data (if validation was successful or had warnings) */
  orderData?: OrderData;
}

/**
 * Order data interface
 */
export interface OrderData {
  /** Unique identifier for the order */
  id?: string;
  
  /** Patient information */
  patient: Patient;
  
  /** Modality (e.g., CT, MRI, X-Ray) */
  modality: string;
  
  /** Body part or region */
  bodyPart: string;
  
  /** Whether contrast is required */
  contrast?: boolean;
  
  /** Type of contrast if required */
  contrastType?: string;
  
  /** Additional instructions */
  instructions?: string;
  
  /** Clinical indications */
  clinicalIndications: string[];
  
  /** ICD-10 codes */
  icd10Codes: Array<{
    code: string;
    description: string;
  }>;
  
  /** CPT codes */
  cptCodes: Array<{
    code: string;
    description: string;
  }>;
  
  /** Order status */
  status: OrderStatus;
  
  /** Timestamp when the order was created */
  createdAt?: string;
  
  /** Timestamp when the order was last updated */
  updatedAt?: string;
  
  /** Physician who created the order */
  physician?: {
    id: string;
    name: string;
  };
  
  /** Signature data */
  signature?: {
    signedAt: string;
    signatureData: string;
  };
}

/**
 * Order status enum
 */
export enum OrderStatus {
  DRAFT = "draft",
  PENDING = "pending",
  VALIDATED = "validated",
  SIGNED = "signed",
  SUBMITTED = "submitted",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

/**
 * Clinical context item interface
 */
export interface ClinicalContextItem {
  /** Type of context item */
  type: 'allergy' | 'medication' | 'condition' | 'lab' | 'note';
  
  /** Title or name of the item */
  title: string;
  
  /** Description or details */
  description: string;
  
  /** Severity or importance level */
  severity?: 'low' | 'medium' | 'high' | 'critical';
  
  /** Date associated with the item */
  date?: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Signature data interface
 */
export interface SignatureData {
  /** Base64 encoded signature image data */
  signatureImage: string;
  
  /** Timestamp when the signature was created */
  timestamp: string;
  
  /** Physician ID who signed */
  physicianId: string;
  
  /** Physician name who signed */
  physicianName: string;
}

/**
 * Override request interface
 */
export interface OverrideRequest {
  /** Order ID to override */
  orderId: string;
  
  /** Reason for the override */
  reason: string;
  
  /** Physician ID requesting the override */
  physicianId: string;
  
  /** Timestamp of the request */
  timestamp: string;
}