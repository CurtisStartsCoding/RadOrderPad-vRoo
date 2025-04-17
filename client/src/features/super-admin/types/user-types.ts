/**
 * User Types for Super Admin
 * 
 * Types related to user management in the Super Admin feature.
 */

/**
 * User role enum
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN_REFERRING = 'admin_referring',
  ADMIN_RADIOLOGY = 'admin_radiology',
  PHYSICIAN = 'physician',
  ADMIN_STAFF = 'admin_staff',
  RADIOLOGIST = 'radiologist',
  SCHEDULER = 'scheduler'
}

/**
 * User status
 */
export type UserStatus = 'active' | 'pending' | 'inactive';

/**
 * User interface
 */
export interface User {
  id: number;
  organizationId: number;
  organizationName: string;
  primaryLocationId?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  npi?: string;
  signatureUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  specialty?: string;
  phoneNumber?: string;
}

/**
 * User filter params
 */
export interface UserFilterParams {
  email?: string;
  name?: string;
  organizationId?: number;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * User update request
 */
export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  npi?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  specialty?: string;
  phoneNumber?: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  userId: number;
}