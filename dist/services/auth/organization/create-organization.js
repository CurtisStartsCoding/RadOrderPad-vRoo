import { OrganizationStatus } from '../types';
/**
 * Create a new organization
 */
export async function createOrganization(client, orgData) {
    const orgResult = await client.query(`INSERT INTO organizations 
    (name, type, npi, tax_id, address_line1, address_line2, city, state, zip_code, 
    phone_number, fax_number, contact_email, website, status, credit_balance) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
    RETURNING *`, [
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
        OrganizationStatus.ACTIVE,
        0 // Initial credit balance
    ]);
    return orgResult.rows[0];
}
//# sourceMappingURL=create-organization.js.map