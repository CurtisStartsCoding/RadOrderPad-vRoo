/**
 * Interface for referring physician and organization information in CSV export
 */
export interface ReferringInfo {
  // Referring physician information
  referring_physician?: string;
  referring_physician_npi?: string;
  referring_physician_phone?: string;
  referring_physician_email?: string;
  referring_physician_fax?: string;
  referring_physician_address?: string;
  referring_physician_city?: string;
  referring_physician_state?: string;
  referring_physician_zip?: string;
  referring_physician_specialty?: string;
  referring_physician_license?: string;
  
  // Referring organization information
  referring_organization?: string;
  referring_organization_address?: string;
  referring_organization_city?: string;
  referring_organization_state?: string;
  referring_organization_zip?: string;
  referring_organization_phone?: string;
  referring_organization_fax?: string;
  referring_organization_email?: string;
  referring_organization_tax_id?: string;
  referring_organization_npi?: string;
}