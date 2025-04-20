/**
 * Export all superadmin controller functions
 */
import * as organizations from './organizations';
import * as users from './users';
import * as prompts from './prompts';
import * as logs from './logs';

// Export all modules
export { organizations, users, prompts, logs };

// Export individual functions for backward compatibility
export const {
  listAllOrganizationsController,
  getOrganizationByIdController
} = organizations;

export const {
  listAllUsersController,
  getUserByIdController
} = users;