import { OrganizationRegistrationDTO, UserRegistrationDTO, RegistrationResponse } from '../types';
/**
 * Register a new organization and admin user
 */
export declare function registerOrganization(orgData: OrganizationRegistrationDTO, userData: UserRegistrationDTO): Promise<RegistrationResponse>;
