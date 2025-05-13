import { User, UserRegistrationDTO, UserLoginDTO, OrganizationRegistrationDTO, LoginResponse, RegistrationResponse } from './types';
import { login } from './user';
import { registerOrganization } from './organization';
import { generateToken } from './token';
import { registerTrialUser, loginTrialUser, getTrialUserProfile } from './trial';
import { TrialLoginResult } from './trial/login-trial-user.service';
import { TrialRegisterResult } from './trial/register-trial-user.service';
import { TrialUserProfileResult } from './trial/get-trial-user-profile.service';

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
   * Register a trial user
   */
  async registerTrialUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    specialty: string
  ): Promise<TrialRegisterResult> {
    return registerTrialUser(email, password, firstName, lastName, specialty);
  }
  
  /**
   * Login a trial user
   */
  async loginTrialUser(email: string, password: string): Promise<TrialLoginResult> {
    return loginTrialUser(email, password);
  }
  
  /**
   * Get a trial user's profile by ID
   */
  async getTrialUserProfile(trialUserId: number): Promise<TrialUserProfileResult | null> {
    return getTrialUserProfile(trialUserId);
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

// Export trial functionality
export * from './trial';

// Export default instance
export default new AuthService();