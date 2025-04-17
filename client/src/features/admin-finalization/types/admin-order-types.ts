/**
 * Admin Order Types
 * 
 * This file contains types related to admin order management.
 */

import { Patient } from "../../physician-order/types/patient-types";

/**
 * Admin Order Status
 */
export enum AdminOrderStatus {
  PENDING_ADMIN = 'pending_admin',
  SENT_TO_RADIOLOGY = 'sent_to_radiology',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Insurance Information
 */
export interface InsuranceInfo {
  /** Insurance provider name */
  provider: string;
  
  /** Member ID */
  memberId: string;
  
  /** Group number (optional) */
  groupNumber?: string;
  
  /** Primary insurance holder name */
  primaryHolder: string;
  
  /** Relationship to primary holder */
  relationship: 'self' | 'spouse' | 'child' | 'other';
  
  /** Whether insurance has been verified */
  verified: boolean;
}

/**
 * ICD-10 Code
 */
export interface ICD10Code {
  /** ICD-10 code */
  code: string;
  
  /** ICD-10 code description */
  description: string;
}

/**
 * CPT Code
 */
export interface CPTCode {
  /** CPT code */
  code: string;
  
  /** CPT code description */
  description: string;
}

/**
 * EMR Summary
 */
export interface EmrSummary {
  /** Raw EMR text */
  rawText: string;
  
  /** Processed EMR text */
  processedText: string;
  
  /** When the EMR was processed */
  processedAt: string;
  
  /** Who processed the EMR */
  processedBy: string;
}

/**
 * Supplemental Document
 */
export interface SupplementalDocument {
  /** Document ID */
  id: string;
  
  /** Document type */
  type: 'lab_result' | 'prior_imaging' | 'clinical_note' | 'other';
  
  /** Document content */
  content: string;
  
  /** Document description */
  description?: string;
  
  /** When the document was added */
  addedAt: string;
  
  /** Who added the document */
  addedBy: string;
}

/**
 * Admin Order Data
 */
export interface AdminOrderData {
  /** Order ID */
  id: string;
  
  /** Patient information */
  patient: Patient;
  
  /** Insurance information */
  insurance: InsuranceInfo;
  
  /** Order status */
  status: AdminOrderStatus;
  
  /** Imaging modality */
  modality: string;
  
  /** Body part to be imaged */
  bodyPart: string;
  
  /** Whether contrast is required */
  contrast: boolean;
  
  /** Type of contrast */
  contrastType?: string;
  
  /** Special instructions */
  instructions?: string;
  
  /** Clinical indications */
  clinicalIndications: string[];
  
  /** ICD-10 codes */
  icd10Codes: ICD10Code[];
  
  /** CPT codes */
  cptCodes: CPTCode[];
  
  /** EMR summary */
  emrSummary?: EmrSummary;
  
  /** Supplemental documents */
  supplementalDocuments?: SupplementalDocument[];
  
  /** When the order was created */
  createdAt: string;
  
  /** Who created the order */
  createdBy: string;
  
  /** When the order was last updated */
  updatedAt: string;
  
  /** Who last updated the order */
  updatedBy: string;
  
  /** When the order was sent to radiology */
  sentToRadiologyAt?: string;
  
  /** Who sent the order to radiology */
  sentToRadiologyBy?: string;
}

/**
 * Admin Order Queue Item
 */
export interface AdminOrderQueueItem {
  /** Order ID */
  id: string;
  
  /** Patient name */
  patientName: string;
  
  /** Patient date of birth */
  patientDob: string;
  
  /** Patient medical record number */
  patientMrn: string;
  
  /** Order status */
  status: AdminOrderStatus;
  
  /** Imaging modality */
  modality: string;
  
  /** Body part to be imaged */
  bodyPart: string;
  
  /** Whether EMR has been processed */
  emrProcessed: boolean;
  
  /** Whether insurance has been verified */
  insuranceVerified: boolean;
  
  /** When the order was created */
  createdAt: string;
  
  /** Physician name */
  physicianName: string;
}