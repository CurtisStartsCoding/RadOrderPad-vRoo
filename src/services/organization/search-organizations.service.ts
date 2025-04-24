import { queryMainDb } from '../../config/db.js';
import { OrganizationResponse } from '../../models/Organization.js';
import enhancedLogger from '../../utils/enhanced-logger.js';

// Add ESLint disable comment for the specific line with the any type

/**
 * Interface for search filters
 */
export interface OrganizationSearchFilters {
  name?: string;
  npi?: string;
  type?: string;
  city?: string;
  state?: string;
}

/**
 * Search for organizations based on provided filters
 * 
 * @param requestingOrgId The ID of the organization making the request (to exclude from results)
 * @param filters Search filters (name, npi, type, city, state)
 * @returns Promise with array of matching organizations
 */
export async function searchOrganizations(
  requestingOrgId: number,
  filters: OrganizationSearchFilters
): Promise<OrganizationResponse[]> {
  try {
    enhancedLogger.debug(`Searching organizations with filters: ${JSON.stringify(filters)}`);
    
    // Build the query parameters array
    const queryParams: (string | number)[] = [requestingOrgId]; // First parameter is the requesting org ID
    let paramIndex = 2; // Start with $2 since $1 is already used
    
    // Start building the query
    let query = `
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
      WHERE id != $1 AND status = 'active'
    `;
    
    // Add filters to the query if they exist
    if (filters.name) {
      query += ` AND name ILIKE $${paramIndex}`;
      queryParams.push(`%${filters.name}%`);
      paramIndex++;
    }
    
    if (filters.npi) {
      query += ` AND npi = $${paramIndex}`;
      queryParams.push(filters.npi);
      paramIndex++;
    }
    
    if (filters.type) {
      query += ` AND type = $${paramIndex}`;
      queryParams.push(filters.type);
      paramIndex++;
    }
    
    if (filters.city) {
      query += ` AND city ILIKE $${paramIndex}`;
      queryParams.push(`%${filters.city}%`);
      paramIndex++;
    }
    
    if (filters.state) {
      query += ` AND state = $${paramIndex}`;
      queryParams.push(filters.state);
      paramIndex++;
    }
    
    // Add ordering and limit
    query += ` ORDER BY name ASC LIMIT 50`;
    
    // Execute the query
    const result = await queryMainDb(query, queryParams);
    
    // Map the database results to OrganizationResponse objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organizations: OrganizationResponse[] = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      npi: row.npi,
      address_line1: row.address_line1,
      city: row.city,
      state: row.state,
      zip_code: row.zip_code,
      phone_number: row.phone_number,
      contact_email: row.contact_email,
      website: row.website,
      logo_url: row.logo_url,
      status: row.status,
      created_at: row.created_at
    }));
    
    enhancedLogger.debug(`Found ${organizations.length} organizations matching the search criteria`);
    return organizations;
  } catch (error) {
    enhancedLogger.error(`Error searching organizations: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}