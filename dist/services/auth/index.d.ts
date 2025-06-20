import { UserRegistrationDTO, UserLoginDTO, OrganizationRegistrationDTO, LoginResponse, RegistrationResponse } from './types';
/**
 * Service for handling authentication-related operations
 */
export declare class AuthService {
    /**
     * Register a new organization and admin user
     */
    registerOrganization(orgData: OrganizationRegistrationDTO, userData: UserRegistrationDTO): Promise<RegistrationResponse>;
    /**
     * Login a user
     */
    login(loginData: UserLoginDTO): Promise<LoginResponse>;
    /**
     * Generate a JWT token for a user
     */
    private generateToken;
}
export * from './types';
export * from './user';
export * from './organization';
export * from './token';
declare const _default: AuthService;
export default _default;
