import bcrypt from 'bcrypt';
import { queryMainDb } from '../config/db';
import { generateToken } from '../utils/token.utils';
import BillingService from './billing.service';
import {
  User,
  UserRegistrationDTO,
  UserLoginDTO,
  Organization,
  OrganizationRegistrationDTO,
  AuthTokenPayload,
  LoginResponse,
  RegistrationResponse,
  UserResponse,
  OrganizationStatus
} from '../models';

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
    // Verify registration key
    const registrationKey = process.env.REGISTRATION_KEY;
    if (orgData.registration_key !== registrationKey) {
      throw new Error('Invalid registration key');
    }

    // Start a transaction
    const client = await queryMainDb('BEGIN');
    
    try {
      // Create the organization
      const orgResult = await client.query(
        `INSERT INTO organizations 
        (name, type, npi, tax_id, address_line1, address_line2, city, state, zip_code, 
        phone_number, fax_number, contact_email, website, status, credit_balance) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
        RETURNING *`,
        [
          orgData.name,
          orgData.type,
          orgData.npi || null,
          orgData.tax_id || null,
          orgData.address_line1 || null,
          orgData.address_line2 || null,
          orgData.city || null,
          orgData.state || null,
          orgData.zip_code || null,
          orgData.phone_number || null,
          orgData.fax_number || null,
          orgData.contact_email || null,
          orgData.website || null,
          OrganizationStatus.ACTIVE,
          0 // Initial credit balance
        ]
      );
      
      const organization = orgResult.rows[0] as Organization;
      
      // Create Stripe customer
      let stripeCustomerId = null;
      try {
        stripeCustomerId = await BillingService.createStripeCustomerForOrg(
          organization.id,
          organization.name,
          orgData.contact_email || userData.email
        );
        
        // Update the organization object with the billing_id
        organization.billing_id = stripeCustomerId;
      } catch (error) {
        console.error('Error creating Stripe customer:', error);
        // Continue with registration even if Stripe customer creation fails
        // The billing_id can be updated later
      }
      
      // Hash the password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);
      
      // Create the admin user
      const userResult = await client.query(
        `INSERT INTO users
        (organization_id, email, password_hash, first_name, last_name, role, npi,
        specialty, phone_number, is_active, email_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          organization.id,
          userData.email,
          passwordHash,
          userData.first_name,
          userData.last_name,
          userData.role,
          userData.npi || null,
          userData.specialty || null,
          userData.phone_number || null,
          true, // is_active
          false // email_verified
        ]
      );
      
      const user = userResult.rows[0] as User;
      
      // Commit the transaction
      await client.query('COMMIT');
      
      // Generate JWT token
      const token = this.generateToken(user);
      
      // Prepare the response
      const userResponse: UserResponse = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        organization_id: user.organization_id,
        npi: user.npi,
        specialty: user.specialty,
        is_active: user.is_active,
        email_verified: user.email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
      
      return {
        token,
        user: userResponse,
        organization
      };
    } catch (error) {
      // Rollback the transaction in case of error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  }
  
  /**
   * Login a user
   */
  async login(loginData: UserLoginDTO): Promise<LoginResponse> {
    // Find the user by email
    const result = await queryMainDb(
      'SELECT * FROM users WHERE email = $1',
      [loginData.email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }
    
    const user = result.rows[0] as User;
    
    // Check if the user is active
    if (!user.is_active) {
      throw new Error('User account is inactive');
    }
    
    // Verify the password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Update last login timestamp
    await queryMainDb(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );
    
    // Generate JWT token
    const token = this.generateToken(user);
    
    // Prepare the response
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      organization_id: user.organization_id,
      npi: user.npi,
      specialty: user.specialty,
      is_active: user.is_active,
      email_verified: user.email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
    
    return {
      token,
      user: userResponse
    };
  }
  
  /**
   * Generate a JWT token for a user
   */
  private generateToken(user: User): string {
    return generateToken(user);
  }
}

export default new AuthService();