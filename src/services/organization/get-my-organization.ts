/**
 * Organization Service
 * 
 * This module provides organization data retrieval functionality.
 */

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
  basic_credit_balance?: number;
  advanced_credit_balance?: number;
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
  npi?: string;
  specialty?: string;
  phone_number?: string;
  organization_id: number;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  email_verified: boolean;
  is_active: boolean;
}

/**
 * Get organization details for the current user
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
    // Query organization directly - all these columns exist
    const orgQuery = `
      SELECT 
        id, name, type, npi, tax_id, address_line1, address_line2,
        city, state, zip_code, phone_number, fax_number, contact_email,
        website, logo_url, billing_id, credit_balance, subscription_tier,
        status, created_at, updated_at, basic_credit_balance, advanced_credit_balance
      FROM organizations
      WHERE id = $1
    `;
    
    enhancedLogger.debug('Executing organization query', { orgId });
    const orgResult = await queryMainDb(orgQuery, [orgId]);

    // If no organization is found, return null
    if (orgResult.rows.length === 0) {
      enhancedLogger.debug('No organization found with the given ID', { orgId });
      return null;
    }

    const organization = orgResult.rows[0];

    // Query locations
    enhancedLogger.debug('Querying locations for organization', { orgId });
    const locationsResult = await queryMainDb(
      `SELECT *
       FROM locations
       WHERE organization_id = $1 AND is_active = true
       ORDER BY name ASC`,
      [orgId]
    );

    // Query users
    enhancedLogger.debug('Querying users for organization', { orgId });
    const usersResult = await queryMainDb(
      `SELECT 
        id, email, first_name as "firstName", last_name as "lastName", 
        role, npi, specialty, phone_number, organization_id,
        created_at, updated_at, last_login, email_verified, is_active
      FROM users
      WHERE organization_id = $1
      ORDER BY last_name, first_name`,
      [orgId]
    );
    
    enhancedLogger.debug('Successfully retrieved organization data', { 
      orgId,
      locationCount: locationsResult.rows.length,
      userCount: usersResult.rows.length
    });
    
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