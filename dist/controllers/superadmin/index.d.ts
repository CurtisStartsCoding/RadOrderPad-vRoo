/**
 * Export all superadmin controller functions
 */
import * as organizations from './organizations';
import * as users from './users';
export { organizations, users };
export declare const listAllOrganizationsController: typeof organizations.listAllOrganizationsController, getOrganizationByIdController: typeof organizations.getOrganizationByIdController;
export declare const listAllUsersController: typeof users.listAllUsersController, getUserByIdController: typeof users.getUserByIdController;
