/**
 * Export all superadmin service functions
 */
import * as organizations from './organizations';
import * as users from './users';
import * as prompts from './prompts';
import * as logs from './logs';
export { organizations, users, prompts, logs };
export declare const listAllOrganizations: typeof organizations.listAllOrganizations, getOrganizationById: typeof organizations.getOrganizationById;
export declare const listAllUsers: typeof users.listAllUsers, getUserById: typeof users.getUserById;
