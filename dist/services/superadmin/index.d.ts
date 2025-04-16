/**
 * Export all superadmin service functions
 */
import * as organizations from './organizations';
import * as users from './users';
export { organizations, users };
export declare const listAllOrganizations: typeof organizations.listAllOrganizations, getOrganizationById: typeof organizations.getOrganizationById;
export declare const listAllUsers: typeof users.listAllUsers, getUserById: typeof users.getUserById;
