import { OrganizationRegistrationDTO, Organization, DatabaseClient, OrganizationStatus } from '../types';
/**
 * Create a new organization
 * Modified version that accepts a status parameter
 */
export declare function createOrganization(client: DatabaseClient, orgData: OrganizationRegistrationDTO & {
    status?: OrganizationStatus;
}): Promise<Organization>;
