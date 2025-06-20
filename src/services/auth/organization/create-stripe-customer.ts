import BillingService from '../../../services/billing';

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
    console.error('Error creating Stripe customer:', error);
    // Continue with registration even if Stripe customer creation fails
    // The billing_id can be updated later
    return null;
  }
}