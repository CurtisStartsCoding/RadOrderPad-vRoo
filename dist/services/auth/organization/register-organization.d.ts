import { OrganizationRegistrationDTO, UserRegistrationDTO, RegistrationResponse } from '../types';
/**
 * Register a new organization and admin user
 * Modified version that doesn't require a registration key
 */
export declare function registerOrganization(orgData: OrganizationRegistrationDTO, userData: UserRegistrationDTO): Promise<RegistrationResponse>;
