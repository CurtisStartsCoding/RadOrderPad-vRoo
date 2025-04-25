/**
 * Resilient Organization Service
 * 
 * This module provides a schema-resilient implementation of the organization service.
 * It uses the schema compatibility utilities to handle potential schema differences
 * between environments, making the code more robust against database schema changes.
 * 
 * This implementation specifically addresses the issue where the 'status' column
 * might not exist in all environments, as documented in DOCS/database-schema-compatibility.md.
 */

import { queryMainDb } from '../../config/db';
import logger from '../../utils/logger';
import enhancedLogger from '../../utils/enhanced-logger';
import { 
  buildResilientSelectQuery, 
  addDefaultValuesToArray,
  logSchemaCompatibilityError
} from '../../utils/schema-compatibility';

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
  status?: string;
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
  status?: string;
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
 * This implementation is resilient to schema differences
 * 
 * @param orgId Organization ID
 * @returns Promise with organization details, locations, and users
 */
export async function getMyOrganization(orgId: number): Promise<{
  organization: OrganizationResponse;
  locations: LocationResponse[];
  users: UserResponse[];
} | null> {
  enhancedLogger.debug('Getting organization details', { orgId });
  
  try {
    // Define the columns we want to select from the organizations table
    const orgColumns = [
      'id', 'name', 'type', 'npi', 'tax_id', 'address_line1', 'address_line2',
      'city', 'state', 'zip_code', 'phone_number', 'fax_number', 'contact_email',
      'website', 'logo_url', 'billing_id', 'credit_balance', 'subscription_tier',
      'status', 'created_at', 'updated_at'
    ];
    
    // Build a resilient query that will work even if some columns don't exist
    const orgQuery = await buildResilientSelectQuery(
      'organizations',
      orgColumns,
      'id = $1'
    );
    
    enhancedLogger.debug('Executing organization query:', { orgId, query: orgQuery });
    const orgResult = await queryMainDb(orgQuery, [orgId]);

    // If no organization is found, return null
    if (orgResult.rows.length === 0) {
      enhancedLogger.debug('No organization found with the given ID', { orgId });
      return null;
    }

    // Add default values for potentially missing columns
    const organization = addDefaultValuesToArray<OrganizationResponse>([orgResult.rows[0]], {
      status: 'active'
    })[0];
    
    enhancedLogger.debug('Retrieved organization data with defaults applied', { 
      orgId, 
      hasStatusColumn: 'status' in orgResult.rows[0]
    });

    // Query the locations table for locations belonging to the organization
    enhancedLogger.debug('Querying locations for organization', { orgId });
    const locationsResult = await queryMainDb(
      `SELECT *
       FROM locations
       WHERE organization_id = $1
       ORDER BY name ASC`,
      [orgId]
    );

    // Define the columns we want to select from the users table
    const userColumns = [
      'id', 'email', 'first_name as "firstName"', 'last_name as "lastName"', 
      'role', 'status', 'npi', 'specialty', 'phone_number', 'organization_id',
      'created_at', 'updated_at', 'last_login', 'email_verified'
    ];
    
    // Build a resilient query for users that will work even if some columns don't exist
    const usersQuery = await buildResilientSelectQuery(
      'users',
      userColumns,
      'organization_id = $1',
      'last_name, first_name'
    );
    
    // Query the users table for users belonging to the organization
    enhancedLogger.debug('Querying users for organization', { orgId, query: usersQuery });
    const usersResult = await queryMainDb(usersQuery, [orgId]);

    // Add default values for potentially missing columns in users
    const users = addDefaultValuesToArray<UserResponse>(usersResult.rows, {
      status: 'active'
    });
    
    enhancedLogger.debug('Successfully retrieved organization data', { 
      orgId,
      locationCount: locationsResult.rows.length,
      userCount: users.length
    });
    
    return {
      organization,
      locations: locationsResult.rows,
      users
    };
  } catch (error) {
    logger.error(`Error getting organization with ID ${orgId}:`, error);
    
    // Log enhanced details for schema compatibility errors
    logSchemaCompatibilityError(error, {
      orgId,
      service: 'getMyOrganization'
    });
    
    throw error;
  }
}