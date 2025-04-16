/**
 * Insurance data for update
 */
export interface InsuranceUpdateData {
  insurerName?: string;
  policyNumber?: string;
  groupNumber?: string;
  planType?: string;
  policyHolderName?: string;
  policyHolderRelationship?: string;
  policyHolderDateOfBirth?: string;
  verificationStatus?: string;
  isPrimary?: boolean;
  [key: string]: any;
}

/**
 * Insurance data with required fields
 */
export interface InsuranceData {
  id: number;
  insurer_name?: string;
  policy_number?: string;
}

/**
 * Result of insurance information update
 */
export interface InsuranceUpdateResult {
  success: boolean;
  orderId: number;
  insuranceId: number;
  message: string;
}