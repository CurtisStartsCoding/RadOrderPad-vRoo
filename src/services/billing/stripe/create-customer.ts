import { queryMainDb } from '../../../config/db';
import stripeService from './stripe.service';

/**
 * Create a Stripe customer for an organization and update the organization's billing_id
 * 
 * @param orgId Organization ID
 * @param orgName Organization name
 * @param orgEmail Organization email
 * @returns Promise<string> Stripe customer ID
 * @throws Error if there's an issue creating the Stripe customer or updating the database
 */
export async function createStripeCustomerForOrg(
  orgId: number,
  orgName: string,
  orgEmail: string
): Promise<string> {
  try {
    // Create Stripe customer
    const customer = await stripeService.createCustomer(
      orgName,
      orgEmail,
      { radorderpad_org_id: orgId }
    );
    
    const stripeCustomerId = customer.id;
    
    // Update organization with Stripe customer ID
    await queryMainDb(
      `UPDATE organizations SET billing_id = $1 WHERE id = $2`,
      [stripeCustomerId, orgId]
    );
    
    console.log(`[BillingService] Created Stripe customer ${stripeCustomerId} for organization ${orgId}`);
    
    return stripeCustomerId;
  } catch (error) {
    console.error('[BillingService] Error creating Stripe customer:', error);
    throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
  }
}