/**
 * Organization Types for Super Admin
 * 
 * Types related to organization management in the Super Admin feature.
 */

/**
 * Organization status enum
 */
export enum OrganizationStatus {
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
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
 * Organization interface
 */
export interface Organization {
  id: number;
  name: string;
  type: OrganizationType;
  npi?: string;
  taxId?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  faxNumber?: string;
  contactEmail?: string;
  website?: string;
  logoUrl?: string;
  billingId?: string;
  creditBalance: number;
  subscriptionTier?: string;
  status: OrganizationStatus;
  assignedAccountManagerId?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Organization filter params
 */
export interface OrganizationFilterParams {
  name?: string;
  npi?: string;
  type?: OrganizationType;
  status?: OrganizationStatus;
  accountManagerId?: number;
}

/**
 * Status update request
 */
export interface StatusUpdateRequest {
  status: OrganizationStatus;
  reason?: string;
}

/**
 * Credit adjustment request
 */
export interface CreditAdjustmentRequest {
  amount: number;
  reason: string;
}

/**
 * Account manager assignment request
 */
export interface AccountManagerAssignmentRequest {
  accountManagerId: number;
}