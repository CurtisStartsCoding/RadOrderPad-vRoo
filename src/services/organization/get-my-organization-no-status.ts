import { queryMainDb } from '../../config/db';
import logger from '../../utils/logger';
import enhancedLogger from '../../utils/enhanced-logger';

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
  status?: string; // Optional since it might not exist in all database instances
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
 * This version completely avoids using the status column
 * @param orgId Organization ID
 * @returns Promise with organization details, locations, and users
 */
export async function getMyOrganizationNoStatus(orgId: number): Promise<{
  organization: OrganizationResponse;
  locations: LocationResponse[];
  users: UserResponse[];
} | null> {
  try {
    enhancedLogger.debug('Getting organization details (no-status version)', { orgId });
    
    // IMPORTANT: This query deliberately excludes the status column
    const orgQuery = `SELECT
      id, name, type, npi, tax_id, address_line1, address_line2,
      city, state, zip_code, phone_number, fax_number, contact_email,
      website, logo_url, billing_id, credit_balance, subscription_tier,
      created_at, updated_at
     FROM organizations
     WHERE id = $1`;
    
    enhancedLogger.debug('Executing organization query:', { orgId, query: orgQuery });
    const orgResult = await queryMainDb(orgQuery, [orgId]);

    // If no organization is found, return null
    if (orgResult.rows.length === 0) {
      enhancedLogger.debug('No organization found with the given ID', { orgId });
      return null;
    }

    const organization = orgResult.rows[0];
    
    // Always add a default status value
    organization.status = 'active';
    enhancedLogger.debug('Applied default status "active"', { orgId });

    // Query the locations table for locations belonging to the organization
    enhancedLogger.debug('Querying locations for organization', { orgId });
    const locationsResult = await queryMainDb(
      `SELECT *
       FROM locations
       WHERE organization_id = $1
       ORDER BY name ASC`,
      [orgId]
    );

    // Query the users table for users belonging to the organization
    // IMPORTANT: This query deliberately excludes the status column
    enhancedLogger.debug('Querying users for organization', { orgId });
    const usersResult = await queryMainDb(
      `SELECT 
         id, email, first_name as "firstName", last_name as "lastName", 
         role, npi, specialty, phone_number, organization_id,
         created_at, updated_at, last_login, email_verified
       FROM users
       WHERE organization_id = $1
       ORDER BY last_name, first_name`,
      [orgId]
    );

    // Add default status value to each user
    const usersWithStatus = usersResult.rows.map(user => {
      return {
        ...user,
        status: 'active' // Default status value
      };
    });

    enhancedLogger.debug('Added default status "active" to all users', { 
      orgId, 
      userCount: usersWithStatus.length 
    });

    // Return the organization, locations, and users
    enhancedLogger.debug('Successfully retrieved organization data', { 
      orgId,
      locationCount: locationsResult.rows.length,
      userCount: usersWithStatus.length
    });
    
    return {
      organization,
      locations: locationsResult.rows,
      users: usersWithStatus
    };
  } catch (error) {
    logger.error(`Error getting organization with ID ${orgId}:`, error);
    enhancedLogger.error('Error in getMyOrganizationNoStatus', { 
      orgId, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}