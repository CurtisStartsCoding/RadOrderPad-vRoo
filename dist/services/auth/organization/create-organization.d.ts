import { OrganizationRegistrationDTO, Organization, DatabaseClient } from '../types';
/**
 * Create a new organization
 */
export declare function createOrganization(client: DatabaseClient, orgData: OrganizationRegistrationDTO): Promise<Organization>;
