/**
 * User Management Types
 * 
 * This file defines types related to user management.
 */

/**
 * User roles in the system
 */
export enum UserRole {
  PHYSICIAN = 'physician',
  ADMIN_STAFF = 'admin_staff',
  RADIOLOGY_STAFF = 'radiology_staff',
  ADMIN = 'admin'
}

/**
 * User status in the system
 */
export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive'
}

/**
 * User interface representing a user in the system
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  organizationId: string;
  organizationName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for user list item in the admin UI
 */
export interface UserListItem {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  organizationName: string;
  createdAt: string;
}

/**
 * Interface for inviting a new user
 */
export interface InviteUserRequest {
  email: string;
  role: UserRole;
  organizationId?: string; // Optional if admin is inviting to their own org
}

/**
 * Interface for updating a user
 */
export interface UpdateUserRequest {
  id: string;
  role?: UserRole;
  status?: UserStatus;
}

/**
 * Interface for user management filter options
 */
export interface UserFilterOptions {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

/**
 * Interface for user filters
 */
export interface UserFilters {
  status: UserStatus | null;
  role: UserRole | null;
  search: string;
}

/**
 * Type for user sort options
 */
export type UserSortOptions = 'name_asc' | 'name_desc' | 'email_asc' | 'email_desc' | 
                             'role_asc' | 'role_desc' | 'status_asc' | 'status_desc' | 
                             'createdAt_asc' | 'createdAt_desc';