/**
 * Types for superadmin services
 */

/**
 * Basic user information
 */
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  organization_id?: number;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
  [key: string]: unknown;
}

/**
 * Detailed user information including password hash (for internal use only)
 */
export interface UserWithSensitiveData extends User {
  password_hash?: string;
}

/**
 * Basic organization information
 */
export interface Organization {
  id: number;
  name: string;
  type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  subscription_tier?: string;
  subscription_status?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  [key: string]: unknown;
}

/**
 * Organization relationship
 */
export interface OrganizationRelationship {
  id: number;
  organization_id: number;
  related_organization_id: number;
  relationship_type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  organization_name?: string;
  related_organization_name?: string;
  [key: string]: unknown;
}

/**
 * Billing event
 */
export interface BillingEvent {
  id: number;
  organization_id: number;
  event_type: string;
  amount?: number;
  currency?: string;
  status: string;
  created_at: Date;
  external_id?: string;
  [key: string]: unknown;
}

/**
 * Purgatory event
 */
export interface PurgatoryEvent {
  id: number;
  organization_id: number;
  event_type: string;
  reason: string;
  status: string;
  created_at: Date;
  resolved_at?: Date;
  resolved_by_id?: number;
  [key: string]: unknown;
}

/**
 * Organization with related data
 */
/**
 * Location information
 */
export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number?: string;
  organization_id: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  [key: string]: unknown;
}

/**
 * User with assigned locations
 */
export interface UserWithLocations extends User {
  organization_name?: string;
  organization_type?: string;
  locations: Location[];
}

export interface OrganizationWithRelatedData extends Organization {
  users: User[];
  connections: OrganizationRelationship[];
  billingHistory: BillingEvent[];
  purgatoryHistory: PurgatoryEvent[];
}