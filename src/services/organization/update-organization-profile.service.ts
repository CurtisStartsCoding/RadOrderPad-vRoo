import { queryMainDb } from '../../config/db.js';
import { OrganizationResponse } from '../../models/Organization.js';
import enhancedLogger from '../../utils/enhanced-logger.js';

/**
 * Interface for update organization parameters
 */
export interface UpdateOrganizationParams {
  name?: string;
  npi?: string;
  tax_id?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
  fax_number?: string;
  contact_email?: string;
  website?: string;
  logo_url?: string;
}

/**
 * Updates an organization's profile information
 * 
 * This function allows organization administrators to update their own organization's details.
 * It prevents updating of sensitive fields like id, type, status, credit_balance, billing_id, etc.
 * 
 * @param orgId The ID of the organization to update
 * @param updateData The data to update in the organization's profile
 * @returns Promise with updated organization profile or null if not found
 */
export async function updateOrganizationProfile(
  orgId: number,
  updateData: UpdateOrganizationParams
): Promise<OrganizationResponse | null> {
  try {
    enhancedLogger.debug(`Updating organization profile for organization ID: ${orgId}`, { updateData });
    
    // Check if there's anything to update
    if (!updateData || Object.keys(updateData).length === 0) {
      enhancedLogger.debug('No update data provided, fetching current profile');
      // If no update data provided, just return the current profile
      const currentProfile = await getOrganizationProfile(orgId);
      return currentProfile;
    }
    
    // Build the SET clause and parameters for the UPDATE query
    const setClauses: string[] = [];
    const queryParams: unknown[] = [];
    let paramIndex = 1;
    
    // Map frontend camelCase to database snake_case and add to SET clauses
    if (updateData.name !== undefined) {
      setClauses.push(`name = $${paramIndex++}`);
      queryParams.push(updateData.name);
    }
    
    if (updateData.npi !== undefined) {
      setClauses.push(`npi = $${paramIndex++}`);
      queryParams.push(updateData.npi);
    }
    
    if (updateData.tax_id !== undefined) {
      setClauses.push(`tax_id = $${paramIndex++}`);
      queryParams.push(updateData.tax_id);
    }
    
    if (updateData.address_line1 !== undefined) {
      setClauses.push(`address_line1 = $${paramIndex++}`);
      queryParams.push(updateData.address_line1);
    }
    
    if (updateData.address_line2 !== undefined) {
      setClauses.push(`address_line2 = $${paramIndex++}`);
      queryParams.push(updateData.address_line2);
    }
    
    if (updateData.city !== undefined) {
      setClauses.push(`city = $${paramIndex++}`);
      queryParams.push(updateData.city);
    }
    
    if (updateData.state !== undefined) {
      setClauses.push(`state = $${paramIndex++}`);
      queryParams.push(updateData.state);
    }
    
    if (updateData.zip_code !== undefined) {
      setClauses.push(`zip_code = $${paramIndex++}`);
      queryParams.push(updateData.zip_code);
    }
    
    if (updateData.phone_number !== undefined) {
      setClauses.push(`phone_number = $${paramIndex++}`);
      queryParams.push(updateData.phone_number);
    }
    
    if (updateData.fax_number !== undefined) {
      setClauses.push(`fax_number = $${paramIndex++}`);
      queryParams.push(updateData.fax_number);
    }
    
    if (updateData.contact_email !== undefined) {
      setClauses.push(`contact_email = $${paramIndex++}`);
      queryParams.push(updateData.contact_email);
    }
    
    if (updateData.website !== undefined) {
      setClauses.push(`website = $${paramIndex++}`);
      queryParams.push(updateData.website);
    }
    
    if (updateData.logo_url !== undefined) {
      setClauses.push(`logo_url = $${paramIndex++}`);
      queryParams.push(updateData.logo_url);
    }
    
    // Always update the updated_at timestamp
    setClauses.push(`updated_at = NOW()`);
    
    // Add the orgId as the last parameter
    queryParams.push(orgId);
    
    // Construct the full UPDATE query
    const updateQuery = `
      UPDATE organizations
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id, 
        name, 
        type, 
        npi, 
        address_line1, 
        address_line2,
        city, 
        state, 
        zip_code, 
        phone_number, 
        contact_email,
        website, 
        logo_url, 
        status,
        created_at,
        updated_at
    `;
    
    enhancedLogger.debug('Executing update query', { 
      query: updateQuery, 
      params: queryParams 
    });
    
    // Execute the update query
    const result = await queryMainDb(updateQuery, queryParams);
    
    if (result.rowCount === 0) {
      enhancedLogger.debug(`Organization with ID ${orgId} not found`);
      return null;
    }
    
    const updatedOrg = result.rows[0];
    
    // Map database result to OrganizationResponse interface
    const orgResponse: OrganizationResponse = {
      id: updatedOrg.id,
      name: updatedOrg.name,
      type: updatedOrg.type,
      npi: updatedOrg.npi || undefined,
      address_line1: updatedOrg.address_line1 || undefined,
      city: updatedOrg.city || undefined,
      state: updatedOrg.state || undefined,
      zip_code: updatedOrg.zip_code || undefined,
      phone_number: updatedOrg.phone_number || undefined,
      contact_email: updatedOrg.contact_email || undefined,
      website: updatedOrg.website || undefined,
      logo_url: updatedOrg.logo_url || undefined,
      status: updatedOrg.status,
      created_at: updatedOrg.created_at
    };
    
    enhancedLogger.debug(`Successfully updated organization profile for organization ID: ${orgId}`);
    return orgResponse;
  } catch (error) {
    enhancedLogger.error(`Error updating organization profile for organization ID ${orgId}:`, error);
    throw error;
  }
}

/**
 * Helper function to get organization profile by ID
 * This is used when no update data is provided
 */
async function getOrganizationProfile(orgId: number): Promise<OrganizationResponse | null> {
  try {
    enhancedLogger.debug(`Getting organization profile for organization ID: ${orgId}`);
    
    // Query for the organization
    const orgQuery = `
      SELECT 
        id, 
        name, 
        type, 
        npi, 
        address_line1, 
        city, 
        state, 
        zip_code, 
        phone_number, 
        contact_email,
        website, 
        logo_url, 
        status,
        created_at
      FROM organizations
      WHERE id = $1
    `;
    
    const orgResult = await queryMainDb(orgQuery, [orgId]);
    
    if (orgResult.rowCount === 0) {
      enhancedLogger.debug(`Organization with ID ${orgId} not found`);
      return null;
    }
    
    const org = orgResult.rows[0];
    
    // Map database result to OrganizationResponse interface
    const orgResponse: OrganizationResponse = {
      id: org.id,
      name: org.name,
      type: org.type,
      npi: org.npi || undefined,
      address_line1: org.address_line1 || undefined,
      city: org.city || undefined,
      state: org.state || undefined,
      zip_code: org.zip_code || undefined,
      phone_number: org.phone_number || undefined,
      contact_email: org.contact_email || undefined,
      website: org.website || undefined,
      logo_url: org.logo_url || undefined,
      status: org.status,
      created_at: org.created_at
    };
    
    enhancedLogger.debug(`Successfully retrieved organization profile for organization ID: ${orgId}`);
    return orgResponse;
  } catch (error) {
    enhancedLogger.error(`Error getting organization profile for organization ID ${orgId}:`, error);
    throw error;
  }
}