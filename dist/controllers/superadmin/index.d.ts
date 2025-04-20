/**
 * Export all superadmin controller functions
 */
import * as organizations from './organizations';
import * as users from './users';
import * as prompts from './prompts';
import * as logs from './logs';
export { organizations, users, prompts, logs };
export declare const listAllOrganizationsController: typeof organizations.listAllOrganizationsController, getOrganizationByIdController: typeof organizations.getOrganizationByIdController;
export declare const listAllUsersController: typeof users.listAllUsersController, getUserByIdController: typeof users.getUserByIdController;
