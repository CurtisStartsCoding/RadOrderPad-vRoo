/**
 * Export all superadmin controller functions
 */
import * as organizations from './organizations';
import * as users from './users';

// Export all modules
export { organizations, users };

// Export individual functions for backward compatibility
export const {
  listAllOrganizationsController,
  getOrganizationByIdController
} = organizations;

export const {
  listAllUsersController,
  getUserByIdController
} = users;