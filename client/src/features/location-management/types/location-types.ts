/**
 * Location Management Types
 * 
 * This file defines types related to location management.
 */

/**
 * Location status in the system
 */
export enum LocationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

/**
 * Location interface representing a location in the system
 */
export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  status: LocationStatus;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for location list item in the admin UI
 */
export interface LocationListItem {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  status: LocationStatus;
  createdAt: string;
}

/**
 * Interface for creating a new location
 */
export interface CreateLocationRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

/**
 * Interface for updating a location
 */
export interface UpdateLocationRequest {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  status?: LocationStatus;
}

/**
 * Interface for location management filter options
 */
export interface LocationFilterOptions {
  status?: LocationStatus;
  search?: string;
}

/**
 * Type for location sort options
 */
export type LocationSortOptions = 'name_asc' | 'name_desc' | 'createdAt_asc' | 'createdAt_desc';