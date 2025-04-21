/**
 * Interface for insurance information in CSV export
 */
export interface InsuranceInfo {
  // Primary insurance
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_group_number?: string;
  insurance_plan_type?: string;
  insurance_subscriber_name?: string;
  insurance_subscriber_relationship?: string;
  
  // Secondary insurance
  secondary_insurance_provider?: string;
  secondary_insurance_policy_number?: string;
  secondary_insurance_group_number?: string;
  
  // Authorization information
  insurance_authorization_number?: string;
  insurance_authorization_date?: string;
  insurance_authorization_contact?: string;
}