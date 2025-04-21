import { RadiologyInfo } from '../interfaces';
import { safeString } from '../utils';

/**
 * Transform radiology organization data for CSV export
 * @param order Order data containing radiology organization information
 * @returns Transformed radiology organization info for CSV
 */
export function transformRadiologyData(order: Record<string, unknown>): RadiologyInfo {
  if (!order) {
    return {};
  }

  return {
    radiology_organization: safeString(order.radiology_organization_name),
    radiology_organization_address: safeString(order.radiology_organization_address),
    radiology_organization_city: safeString(order.radiology_organization_city),
    radiology_organization_state: safeString(order.radiology_organization_state),
    radiology_organization_zip: safeString(order.radiology_organization_zip),
    radiology_organization_phone: safeString(order.radiology_organization_phone),
    radiology_organization_fax: safeString(order.radiology_organization_fax),
    radiology_organization_email: safeString(order.radiology_organization_email),
    radiology_organization_tax_id: safeString(order.radiology_organization_tax_id),
    radiology_organization_npi: safeString(order.radiology_organization_npi)
  };
}