import { ReferringInfo } from '../interfaces';
import { safeString } from '../utils';

/**
 * Transform referring physician and organization data for CSV export
 * @param order Order data containing referring information
 * @returns Transformed referring info for CSV
 */
export function transformReferringData(order: Record<string, unknown>): ReferringInfo {
  if (!order) {
    return {};
  }

  return {
    // Referring physician information
    referring_physician: safeString(order.referring_physician_name),
    referring_physician_npi: safeString(order.referring_physician_npi),
    referring_physician_phone: safeString(order.referring_physician_phone),
    referring_physician_email: safeString(order.referring_physician_email),
    referring_physician_fax: safeString(order.referring_physician_fax),
    referring_physician_address: safeString(order.referring_physician_address),
    referring_physician_city: safeString(order.referring_physician_city),
    referring_physician_state: safeString(order.referring_physician_state),
    referring_physician_zip: safeString(order.referring_physician_zip),
    referring_physician_specialty: safeString(order.referring_physician_specialty),
    referring_physician_license: safeString(order.referring_physician_license),
    
    // Referring organization information
    referring_organization: safeString(order.referring_organization_name),
    referring_organization_address: safeString(order.referring_organization_address),
    referring_organization_city: safeString(order.referring_organization_city),
    referring_organization_state: safeString(order.referring_organization_state),
    referring_organization_zip: safeString(order.referring_organization_zip),
    referring_organization_phone: safeString(order.referring_organization_phone),
    referring_organization_fax: safeString(order.referring_organization_fax),
    referring_organization_email: safeString(order.referring_organization_email),
    referring_organization_tax_id: safeString(order.referring_organization_tax_id),
    referring_organization_npi: safeString(order.referring_organization_npi)
  };
}