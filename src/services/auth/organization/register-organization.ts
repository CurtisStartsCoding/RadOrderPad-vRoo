import { queryMainDb } from '../../../config/db';
import { OrganizationRegistrationDTO, UserRegistrationDTO, RegistrationResponse } from '../types';
import { verifyRegistrationKey } from './verify-registration-key';
import { createOrganization } from './create-organization';
import { createStripeCustomer } from './create-stripe-customer';
import { createAdminUser } from './create-admin-user';
import { formatUserResponse } from '../user/format-user-response';
import { generateToken } from '../token/generate-token';

/**
 * Register a new organization and admin user
 */
export async function registerOrganization(
  orgData: OrganizationRegistrationDTO,
  userData: UserRegistrationDTO
): Promise<RegistrationResponse> {
  // Verify registration key
  if (!verifyRegistrationKey(orgData.registration_key)) {
    throw new Error('Invalid registration key');
  }

  // Start a transaction
  const client = await queryMainDb('BEGIN');
  
  try {
    // Create the organization
    const organization = await createOrganization(client, orgData);
    
    // Create Stripe customer
    const stripeCustomerId = await createStripeCustomer(
      organization.id,
      organization.name,
      orgData.contact_email || userData.email
    );
    
    // Update the organization object with the billing_id
    if (stripeCustomerId) {
      organization.billing_id = stripeCustomerId;
    }
    
    // Create the admin user
    const user = await createAdminUser(client, userData, organization.id);
    
    // Commit the transaction
    await client.query('COMMIT');
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Prepare the response
    const userResponse = formatUserResponse(user);
    
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