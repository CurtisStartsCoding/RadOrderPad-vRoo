/**
 * Connection Types
 * 
 * Types for the connection management feature.
 */

/**
 * Connection status enum
 */
export enum ConnectionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  PURGATORY = 'purgatory',
  TERMINATED = 'terminated'
}

/**
 * Organization type enum
 */
export enum OrganizationType {
  REFERRING_PRACTICE = 'referring_practice',
  RADIOLOGY_GROUP = 'radiology_group'
}

/**
 * Connection interface
 */
export interface Connection {
  id: number;
  organizationId: number;
  relatedOrganizationId: number;
  relatedOrganizationName: string;
  relatedOrganizationType: OrganizationType;
  status: ConnectionStatus;
  initiatedById: number;
  approvedById?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Connection request interface
 */
export interface ConnectionRequest {
  id: number;
  organizationId: number;
  organizationName: string;
  organizationType: OrganizationType;
  status: ConnectionStatus;
  initiatedById: number;
  initiatedByName: string;
  notes?: string;
  createdAt: string;
}

/**
 * Organization search result interface
 */
export interface OrganizationSearchResult {
  id: number;
  name: string;
  type: OrganizationType;
  npi?: string;
  city?: string;
  state?: string;
}

/**
 * Connection request payload
 */
export interface CreateConnectionRequest {
  relatedOrganizationId: number;
  notes?: string;
}

/**
 * Connection search params
 */
export interface OrganizationSearchParams {
  name?: string;
  npi?: string;
  city?: string;
  state?: string;
  type: OrganizationType;
}