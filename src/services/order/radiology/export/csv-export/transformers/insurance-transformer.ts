import { InsuranceInfo } from '../interfaces';
import { formatDate, safeString } from '../utils';

/**
 * Transform insurance data for CSV export
 * @param insurance Insurance data array from database
 * @param order Order data for authorization information
 * @returns Transformed insurance info for CSV
 */
export function transformInsuranceData(
  insurance: Record<string, unknown>[] | undefined, 
  order: Record<string, unknown>
): InsuranceInfo {
  if (!insurance || !Array.isArray(insurance)) {
    insurance = [];
  }

  const primaryInsurance = insurance[0] || {};
  const secondaryInsurance = insurance[1] || {};

  return {
    // Primary insurance
    insurance_provider: safeString(primaryInsurance.insurer_name),
    insurance_policy_number: safeString(primaryInsurance.policy_number),
    insurance_group_number: safeString(primaryInsurance.group_number),
    insurance_plan_type: safeString(primaryInsurance.plan_type),
    insurance_subscriber_name: safeString(primaryInsurance.subscriber_name),
    insurance_subscriber_relationship: safeString(primaryInsurance.subscriber_relationship),
    
    // Secondary insurance
    secondary_insurance_provider: safeString(secondaryInsurance.insurer_name),
    secondary_insurance_policy_number: safeString(secondaryInsurance.policy_number),
    secondary_insurance_group_number: safeString(secondaryInsurance.group_number),
    
    // Authorization information from order
    insurance_authorization_number: safeString(order?.insurance_authorization_number),
    insurance_authorization_date: formatDate(order?.insurance_authorization_date as string | Date),
    insurance_authorization_contact: safeString(order?.insurance_authorization_contact)
  };
}