import { queryMainDb } from '../../config/db';
import stripeService from './stripe/stripe.service';
import enhancedLogger from '../../utils/enhanced-logger';
import { BillingOverviewResponse } from './types';

export interface EnhancedBillingOverviewResponse extends BillingOverviewResponse {
  organizationType?: string;
  basicCreditBalance?: number;
  advancedCreditBalance?: number;
}

/**
 * Get enhanced billing overview for an organization
 * Now includes dual credit balances for radiology organizations
 * 
 * @param orgId Organization ID
 * @returns Promise with enhanced billing overview or null if organization not found
 */
export async function getBillingOverview(orgId: number): Promise<EnhancedBillingOverviewResponse | null> {
  try {
    // Query the organization from the database including dual credit fields
    const query = `
      SELECT 
        id, 
        name,
        type,
        billing_id, 
        credit_balance, 
        basic_credit_balance,
        advanced_credit_balance,
        subscription_tier, 
        status 
      FROM organizations 
      WHERE id = $1
    `;
    
    const result = await queryMainDb(query, [orgId]);
    
    // If no organization found, return null
    if (result.rows.length === 0) {
      enhancedLogger.warn('Organization not found when getting billing overview', { orgId });
      return null;
    }
    
    const organization = result.rows[0];
    
    // Initialize response with organization data
    const response: EnhancedBillingOverviewResponse = {
      organizationStatus: organization.status,
      organizationType: organization.type,
      subscriptionTier: organization.subscription_tier,
      currentCreditBalance: organization.credit_balance || 0,
      stripeSubscriptionStatus: null,
      currentPeriodEnd: null,
      billingInterval: null,
      cancelAtPeriodEnd: null
    };
    
    // Set appropriate credit balances based on organization type
    if (organization.type === 'radiology' || organization.type === 'radiology_group') {
      // Radiology organizations only use dual credits
      response.basicCreditBalance = organization.basic_credit_balance;
      response.advancedCreditBalance = organization.advanced_credit_balance;
    } else {
      // Referring organizations only use single credit
      response.currentCreditBalance = organization.credit_balance;
    }
    
    // If the organization has a billing_id, get Stripe subscription details
    if (organization.billing_id) {
      try {
        // Get the Stripe customer
        const _customer = await stripeService.getCustomer(organization.billing_id);
        
        // Get the customer's subscriptions
        const stripe = stripeService.getStripeInstance();
        const subscriptions = await stripe.subscriptions.list({
          customer: organization.billing_id,
          status: 'active',
          limit: 1
        });
        
        // If there's an active subscription, add its details to the response
        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          
          response.stripeSubscriptionStatus = subscription.status;
          
          // Use type assertion to access properties that might have different names in the Stripe API
          const subscriptionObj = subscription as unknown as Record<string, unknown>;
          
          const currentPeriodEnd = (subscriptionObj.current_period_end as number) ||
                                  (subscriptionObj.currentPeriodEnd as number);
          if (currentPeriodEnd) {
            response.currentPeriodEnd = new Date(currentPeriodEnd * 1000).toISOString();
          }
          
          const cancelAtPeriodEnd = (subscriptionObj.cancel_at_period_end as boolean) ||
                                   (subscriptionObj.cancelAtPeriodEnd as boolean);
          response.cancelAtPeriodEnd = !!cancelAtPeriodEnd;
          
          // Get the subscription plan details
          if (subscription.items.data.length > 0) {
            const plan = subscription.items.data[0].plan;
            response.billingInterval = plan.interval as 'month' | 'year';
          }
          
          // Generate a Stripe customer portal URL if possible
          try {
            const session = await stripe.billingPortal.sessions.create({
              customer: organization.billing_id,
              return_url: process.env.STRIPE_PORTAL_RETURN_URL || 'https://app.radorderpad.com/billing'
            });
            
            response.stripeCustomerPortalUrl = session.url;
          } catch (portalError) {
            enhancedLogger.warn('Error creating Stripe customer portal session', {
              error: portalError instanceof Error ? portalError.message : String(portalError),
              orgId,
              customerId: organization.billing_id
            });
            // Continue without the portal URL
          }
        }
      } catch (stripeError) {
        enhancedLogger.warn('Error retrieving Stripe subscription details', {
          error: stripeError instanceof Error ? stripeError.message : String(stripeError),
          orgId,
          customerId: organization.billing_id
        });
        // Continue with partial data
      }
    }
    
    return response;
  } catch (error) {
    enhancedLogger.error('Error getting billing overview', {
      error: error instanceof Error ? error.message : String(error),
      orgId
    });
    throw error;
  }
}