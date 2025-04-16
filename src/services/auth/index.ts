import { User, UserRegistrationDTO, UserLoginDTO, OrganizationRegistrationDTO, LoginResponse, RegistrationResponse } from './types';
import { login } from './user';
import { registerOrganization } from './organization';
import { generateToken } from './token';

/**
 * Service for handling authentication-related operations
 */
export class AuthService {
  /**
   * Register a new organization and admin user
   */
  async registerOrganization(
    orgData: OrganizationRegistrationDTO,
    userData: UserRegistrationDTO
  ): Promise<RegistrationResponse> {
    return registerOrganization(orgData, userData);
  }
  
  /**
   * Login a user
   */
  async login(loginData: UserLoginDTO): Promise<LoginResponse> {
    return login(loginData);
  }
  
  /**
   * Generate a JWT token for a user
   */
  private generateToken(user: User): string {
    return generateToken(user);
  }
}

// Export types
export * from './types';

// Export user functionality
export * from './user';

// Export organization functionality
export * from './organization';

// Export token functionality
export * from './token';

// Export default instance
export default new AuthService();