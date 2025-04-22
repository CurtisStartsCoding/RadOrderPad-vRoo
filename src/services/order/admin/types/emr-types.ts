/**
 * Patient information extracted from EMR summary
 */
export interface ParsedPatientInfo {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
}

/**
 * Insurance information extracted from EMR summary
 */
export interface ParsedInsuranceInfo {
  insurerName?: string;
  policyNumber?: string;
  groupNumber?: string;
  policyHolderName?: string;
  relationship?: string;
  authorizationNumber?: string;
}

/**
 * Data parsed from EMR summary
 */
export interface ParsedEmrData {
  patientInfo?: ParsedPatientInfo;
  insuranceInfo?: ParsedInsuranceInfo;
}

/**
 * Result of EMR summary processing
 */
export interface EmrSummaryResult {
  success: boolean;
  orderId: number;
  message: string;
  parsedData: ParsedEmrData;
}

/**
 * Result of supplemental document processing
 */
export interface SupplementalDocResult {
  success: boolean;
  orderId: number;
  message: string;
}