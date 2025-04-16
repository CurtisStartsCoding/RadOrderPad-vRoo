import { User, UserRegistrationDTO, UserLoginDTO, Organization, OrganizationRegistrationDTO, AuthTokenPayload, LoginResponse, RegistrationResponse, UserResponse, OrganizationStatus } from '../../models';
export { User, UserRegistrationDTO, UserLoginDTO, Organization, OrganizationRegistrationDTO, AuthTokenPayload, LoginResponse, RegistrationResponse, UserResponse, OrganizationStatus };
export interface DatabaseClient {
    query: (text: string, params?: any[]) => Promise<any>;
    release: () => void;
}
