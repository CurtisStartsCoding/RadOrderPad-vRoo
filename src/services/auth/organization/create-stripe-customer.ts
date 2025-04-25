import BillingService from '../../../services/billing';
import logger from '../../../utils/logger';

/**
 * Create a Stripe customer for an organization
 */
export async function createStripeCustomer(
  organizationId: number,
  organizationName: string,
  contactEmail: string
): Promise<string | null> {
  try {
    const stripeCustomerId = await BillingService.createStripeCustomerForOrg({
      orgId: organizationId,
      orgName: organizationName,
      orgEmail: contactEmail
    });
    
    return stripeCustomerId;
  } catch (error) {
    logger.error('Error creating Stripe customer:', {
      error,
      organizationId,
      organizationName,
      contactEmail
    });
    // Continue with registration even if Stripe customer creation fails
    // The billing_id can be updated later
    return null;
  }
}