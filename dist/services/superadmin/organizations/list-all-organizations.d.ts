import { Organization } from '../types';
/**
 * List all organizations with optional filtering
 *
 * @param filters Optional filters for organizations
 * @returns Promise with array of organizations
 */
export declare function listAllOrganizations(filters: {
    name?: string;
    type?: string;
    status?: string;
}): Promise<Organization[]>;
