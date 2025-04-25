import { OrganizationRegistrationDTO, Organization, DatabaseClient, OrganizationStatus } from '../types';

/**
 * Create a new organization
 * Modified version that accepts a status parameter
 */
export async function createOrganization(
  client: DatabaseClient,
  orgData: OrganizationRegistrationDTO & { status?: OrganizationStatus }
): Promise<Organization> {
  const status = orgData.status || OrganizationStatus.ACTIVE;
  
  const orgResult = await client.query(
    `INSERT INTO organizations 
    (name, type, npi, tax_id, address_line1, address_line2, city, state, zip_code, 
    phone_number, fax_number, contact_email, website, status, credit_balance) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
    RETURNING *`,
    [
      orgData.name,
      orgData.type,
      orgData.npi || null,
      orgData.tax_id || null,
      orgData.address_line1 || null,
      orgData.address_line2 || null,
      orgData.city || null,
      orgData.state || null,
      orgData.zip_code || null,
      orgData.phone_number || null,
      orgData.fax_number || null,
      orgData.contact_email || null,
      orgData.website || null,
      status,
      0 // Initial credit balance
    ]
  );
  
  // Cast to unknown first, then to Organization to satisfy TypeScript
  return orgResult.rows[0] as unknown as Organization;
}