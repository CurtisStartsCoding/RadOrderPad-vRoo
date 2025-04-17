/**
 * Format Utilities
 * 
 * Utility functions for formatting and transforming user management data.
 */

import { UserRole, UserStatus } from '../types/user-types';

/**
 * Format a role for display
 * 
 * @param role - The role to format
 * @returns The formatted role
 */
export const formatRole = (role: UserRole): string => {
  switch (role) {
    case UserRole.PHYSICIAN:
      return 'Physician';
    case UserRole.ADMIN_STAFF:
      return 'Admin Staff';
    case UserRole.RADIOLOGY_STAFF:
      return 'Radiology Staff';
    case UserRole.ADMIN:
      return 'Administrator';
    default:
      return role;
  }
};

/**
 * Format a date for display
 * 
 * @param dateString - The date string to format
 * @returns The formatted date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Format a date with time for display
 * 
 * @param dateString - The date string to format
 * @returns The formatted date with time
 */
export const formatDateWithTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

/**
 * Get the badge variant for a status
 * 
 * @param status - The status to get the variant for
 * @returns The badge variant
 */
export const getStatusBadgeVariant = (status: UserStatus): 'default' | 'secondary' | 'destructive' => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'default';
    case UserStatus.PENDING:
      return 'secondary';
    case UserStatus.INACTIVE:
      return 'destructive';
    default:
      return 'default';
  }
};

/**
 * Get the available roles based on the current user's role
 * 
 * @param currentUserRole - The current user's role
 * @returns The available roles
 */
export const getAvailableRoles = (currentUserRole: string): UserRole[] => {
  // Only admins can create other admins
  if (currentUserRole === UserRole.ADMIN) {
    return [
      UserRole.PHYSICIAN,
      UserRole.ADMIN_STAFF,
      UserRole.RADIOLOGY_STAFF,
      UserRole.ADMIN
    ];
  }

  return [
    UserRole.PHYSICIAN,
    UserRole.ADMIN_STAFF,
    UserRole.RADIOLOGY_STAFF
  ];
};

/**
 * Get the available statuses based on the current status
 * 
 * @param currentStatus - The current status
 * @returns The available statuses
 */
export const getAvailableStatuses = (currentStatus: UserStatus): UserStatus[] => {
  switch (currentStatus) {
    case UserStatus.ACTIVE:
      return [UserStatus.ACTIVE, UserStatus.INACTIVE];
    case UserStatus.PENDING:
      return [UserStatus.PENDING, UserStatus.ACTIVE, UserStatus.INACTIVE];
    case UserStatus.INACTIVE:
      return [UserStatus.INACTIVE, UserStatus.ACTIVE];
    default:
      return [UserStatus.ACTIVE, UserStatus.PENDING, UserStatus.INACTIVE];
  }
};