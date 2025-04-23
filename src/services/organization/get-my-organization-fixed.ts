import { queryMainDb } from '../../config/db';
import logger from '../../utils/logger';

/**
 * Interface for organization response
 */
export interface OrganizationResponse {
  id: number;
  name: string;
  type: string;
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
  billing_id?: string;
  credit_balance?: number;
  subscription_tier?: string;
  status?: string; // Optional since it might not exist in all database instances
  created_at: string;
  updated_at: string;
}

/**
 * Interface for location response
 */
export interface LocationResponse {
  id: number;
  organization_id: number;
  name: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for user response
 */
export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  npi?: string;
  specialty?: string;
  phone_number?: string;
  organization_id: number;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  email_verified: boolean;
}

/**
 * Get organization details for the current user
 * @param orgId Organization ID
 * @returns Promise with organization details, locations, and users
 */
export async function getMyOrganization(orgId: number): Promise<{
  organization: OrganizationResponse;
  locations: LocationResponse[];
  users: UserResponse[];
} | null> {
  try {
    // First check if the status column exists in the organizations table
    const checkStatusColumn = await queryMainDb(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'organizations' AND column_name = 'status'`
    );
    
    const statusColumnExists = checkStatusColumn.rows.length > 0;
    
    // Query the organizations table for the organization with the given ID
    // Dynamically build the query based on whether the status column exists
    const orgQuery = `SELECT
      id, name, type, npi, tax_id, address_line1, address_line2,
      city, state, zip_code, phone_number, fax_number, contact_email,
      website, logo_url, billing_id, credit_balance, subscription_tier,
      ${statusColumnExists ? 'status,' : ''} created_at, updated_at
     FROM organizations
     WHERE id = $1`;
    
    const orgResult = await queryMainDb(orgQuery, [orgId]);

    // If no organization is found, return null
    if (orgResult.rows.length === 0) {
      return null;
    }

    const organization = orgResult.rows[0];
    
    // If status column doesn't exist, add a default value
    if (!statusColumnExists && !organization.status) {
      organization.status = 'active'; // Default value
    }

    // Query the locations table for locations belonging to the organization
    const locationsResult = await queryMainDb(
      `SELECT *
       FROM locations
       WHERE organization_id = $1
       ORDER BY name ASC`,
      [orgId]
    );

    // Query the users table for users belonging to the organization
    const usersResult = await queryMainDb(
      `SELECT 
         id, email, first_name as "firstName", last_name as "lastName", 
         role, status, npi, specialty, phone_number, organization_id,
         created_at, updated_at, last_login, email_verified
       FROM users
       WHERE organization_id = $1
       ORDER BY last_name, first_name`,
      [orgId]
    );

    // Return the organization, locations, and users
    return {
      organization,
      locations: locationsResult.rows,
      users: usersResult.rows
    };
  } catch (error) {
    logger.error(`Error getting organization with ID ${orgId}:`, error);
    throw error;
  }
}