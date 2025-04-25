import { queryMainDb } from '../../../config/db';
import stripeService from './stripe.service';
import logger from '../../../utils/logger';

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
      { radorderpad_org_id: orgId.toString() }
    );
    
    const stripeCustomerId = customer.id;
    
    // Update organization with Stripe customer ID
    await queryMainDb(
      `UPDATE organizations SET billing_id = $1 WHERE id = $2`,
      [stripeCustomerId, orgId]
    );
    
    logger.info(`[BillingService] Created Stripe customer`, {
      stripeCustomerId,
      orgId,
      orgName
    });
    
    return stripeCustomerId;
  } catch (error) {
    logger.error('[BillingService] Error creating Stripe customer:', {
      error,
      orgId,
      orgName,
      orgEmail
    });
    throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
  }
}