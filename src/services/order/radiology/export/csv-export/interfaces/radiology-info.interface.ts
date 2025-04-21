/**
 * Interface for radiology organization information in CSV export
 */
export interface RadiologyInfo {
  radiology_organization?: string;
  radiology_organization_address?: string;
  radiology_organization_city?: string;
  radiology_organization_state?: string;
  radiology_organization_zip?: string;
  radiology_organization_phone?: string;
  radiology_organization_fax?: string;
  radiology_organization_email?: string;
  radiology_organization_tax_id?: string;
  radiology_organization_npi?: string;
}