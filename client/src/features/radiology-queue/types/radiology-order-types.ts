import { Patient } from '../../physician-order/types/patient-types';
import { InsuranceInfo } from '../../admin-finalization/types';

/**
 * Enum for radiology order status
 */
export enum RadiologyOrderStatus {
  PENDING_REVIEW = 'pending_review',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Interface for radiology order filter options
 */
export interface RadiologyOrderFilters {
  status?: RadiologyOrderStatus;
  patientName?: string;
  dateFrom?: string;
  dateTo?: string;
  modality?: string;
}

/**
 * Interface for a document attached to a radiology order
 */
export interface RadiologyDocument {
  id: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

/**
 * Interface for override information
 */
export interface OverrideInfo {
  isOverridden: boolean;
  overriddenBy?: string;
  overriddenAt?: string;
  reason?: string;
}

/**
 * Interface for a radiology order
 */
export interface RadiologyOrder {
  id: string;
  patient: Patient;
  insurance: InsuranceInfo;
  status: RadiologyOrderStatus;
  modality: string;
  bodyPart: string;
  contrast: boolean;
  contrastType?: string;
  instructions?: string;
  clinicalIndications: string[];
  icd10Codes: Array<{ code: string; description: string }>;
  cptCodes: Array<{ code: string; description: string }>;
  documents: RadiologyDocument[];
  overrideInfo?: OverrideInfo;
  scheduledDate?: string;
  scheduledBy?: string;
  completedDate?: string;
  completedBy?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

/**
 * Interface for radiology queue response
 */
export interface RadiologyQueueResponse {
  orders: RadiologyOrder[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Interface for status update request
 */
export interface StatusUpdateRequest {
  status: RadiologyOrderStatus;
  notes?: string;
}

/**
 * Interface for export options
 */
export interface ExportOptions {
  format: 'json' | 'csv';
  includePatientInfo: boolean;
  includeInsuranceInfo: boolean;
}