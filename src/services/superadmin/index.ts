/**
 * Export all superadmin service functions
 */
import * as organizations from './organizations';
import * as users from './users';

// Export all modules
export { organizations, users };

// Export individual functions for backward compatibility
export const {
  listAllOrganizations,
  getOrganizationById
} = organizations;

export const {
  listAllUsers,
  getUserById
} = users;