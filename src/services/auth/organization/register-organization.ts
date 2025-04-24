import { getMainDbClient } from '../../../config/db';
import { OrganizationRegistrationDTO, UserRegistrationDTO, RegistrationResponse, OrganizationStatus } from '../types';
import { createOrganization } from './create-organization';
import { createStripeCustomer } from './create-stripe-customer';
import { createAdminUser } from './create-admin-user';
import { formatUserResponse } from '../user/format-user-response';
import { generateToken } from '../token/generate-token';
import { generateVerificationToken } from '../token/generate-verification-token';
// Import the notification manager
import NotificationManager from '../../../services/notification/manager/account';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Register a new organization and admin user
 * Modified version that doesn't require a registration key
 */
export async function registerOrganization(
  orgData: OrganizationRegistrationDTO,
  userData: UserRegistrationDTO
): Promise<RegistrationResponse> {
  // Start a transaction
  const client = await getMainDbClient();
  
  try {
    // Begin transaction
    await client.query('BEGIN');
    
    // Check if organization with the same name already exists
    const existingOrgResult = await client.query(
      'SELECT id FROM organizations WHERE name = $1',
      [orgData.name]
    );
    
    if (existingOrgResult.rows.length > 0) {
      throw new Error('Organization already exists');
    }
    
    // Check if user with the same email already exists
    const existingUserResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [userData.email]
    );
    
    if (existingUserResult.rows.length > 0) {
      throw new Error('Email already in use');
    }
    
    // Create the organization
    const organization = await createOrganization(client, {
      ...orgData,
      // Set initial status to pending verification instead of active
      status: OrganizationStatus.PENDING_VERIFICATION
    });
    
    // Create Stripe customer
    const stripeCustomerId = await createStripeCustomer(
      organization.id,
      organization.name,
      orgData.contact_email || userData.email
    );
    
    // Update the organization object with the billing_id
    if (stripeCustomerId) {
      organization.billing_id = stripeCustomerId;
      
      // Update the organization record with the billing_id
      await client.query(
        'UPDATE organizations SET billing_id = $1 WHERE id = $2',
        [stripeCustomerId, organization.id]
      );
    }
    
    // Create the admin user
    const user = await createAdminUser(client, userData, organization.id);
    
    // Generate email verification token
    const verificationToken = await generateVerificationToken(client, user.id);
    
    // Commit the transaction
    await client.query('COMMIT');
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Prepare the response
    const userResponse = formatUserResponse(user);
    
    // Send verification email
    try {
      await NotificationManager.sendVerificationEmail(
        userData.email,
        verificationToken,
        {
          firstName: userData.first_name,
          organizationName: orgData.name
        }
      );
    } catch (emailError) {
      enhancedLogger.error('Failed to send verification email:', emailError);
      // Continue with registration even if email sending fails
    }
    
    return {
      token,
      user: userResponse,
      organization,
      message: 'Registration successful. Please check your email to verify your account.'
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