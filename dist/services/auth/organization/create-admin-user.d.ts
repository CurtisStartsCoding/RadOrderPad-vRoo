import { UserRegistrationDTO, User, DatabaseClient } from '../types';
/**
 * Create an admin user for an organization
 */
export declare function createAdminUser(client: DatabaseClient, userData: UserRegistrationDTO, organizationId: number): Promise<User>;
