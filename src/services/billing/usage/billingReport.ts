/**
 * Billing report service
 * 
 * This module handles Stripe interactions and billing event recording.
 */

import { PoolClient } from 'pg';
import stripeService from '../stripe/stripe.service';
import logger from '../../../utils/logger';
import { STANDARD_ORDER_PRICE_CENTS, ADVANCED_ORDER_PRICE_CENTS } from './types';

/**
 * Create Stripe invoice items for radiology organization usage
 * 
 * @param billingId Stripe customer ID
 * @param organizationId Organization ID
 * @param standardOrderCount Number of standard orders
 * @param advancedOrderCount Number of advanced orders
 * @param startDate Start date of the billing period
 * @param endDate End date of the billing period
 * @returns Promise with array of created invoice item IDs
 */
export async function createStripeInvoiceItems(
  billingId: string,
  organizationId: number,
  standardOrderCount: number,
  advancedOrderCount: number,
  startDate: Date,
  endDate: Date
): Promise<string[]> {
  const stripe = stripeService.getStripeInstance();
  const invoiceItemIds: string[] = [];
  const periodDescription = `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`;
  
  try {
    // Create invoice item for standard orders if any
    if (standardOrderCount > 0) {
      const standardOrderItem = await stripe.invoiceItems.create({
        customer: billingId,
        amount: standardOrderCount * STANDARD_ORDER_PRICE_CENTS,
        currency: 'usd',
        description: `${standardOrderCount} Standard Imaging Orders (${periodDescription})`,
        metadata: {
          organization_id: organizationId.toString(),
          order_type: 'standard',
          order_count: standardOrderCount.toString(),
          period_start: startDate.toISOString(),
          period_end: endDate.toISOString()
        }
      });
      
      invoiceItemIds.push(standardOrderItem.id);
    }
    
    // Create invoice item for advanced orders if any
    if (advancedOrderCount > 0) {
      const advancedOrderItem = await stripe.invoiceItems.create({
        customer: billingId,
        amount: advancedOrderCount * ADVANCED_ORDER_PRICE_CENTS,
        currency: 'usd',
        description: `${advancedOrderCount} Advanced Imaging Orders (${periodDescription})`,
        metadata: {
          organization_id: organizationId.toString(),
          order_type: 'advanced',
          order_count: advancedOrderCount.toString(),
          period_start: startDate.toISOString(),
          period_end: endDate.toISOString()
        }
      });
      
      invoiceItemIds.push(advancedOrderItem.id);
    }
    
    return invoiceItemIds;
  } catch (error) {
    logger.error(`Error creating Stripe invoice items for organization ${organizationId}:`, error);
    throw error;
  }
}

/**
 * Record a billing event in the database
 * 
 * @param client Database client
 * @param organizationId Organization ID
 * @param amountCents Amount in cents
 * @param description Description of the billing event
 * @param invoiceItemIds Array of Stripe invoice item IDs
 * @returns Promise with the inserted row ID
 */
export async function recordBillingEvent(
  client: PoolClient,
  organizationId: number,
  amountCents: number,
  description: string,
  invoiceItemIds: string[]
): Promise<number> {
  const query = `
    INSERT INTO billing_events (
      organization_id,
      event_type,
      amount_cents,
      description,
      metadata,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id
  `;
  
  const metadata = {
    stripe_invoice_item_ids: invoiceItemIds
  };
  
  const result = await client.query(query, [
    organizationId,
    'radiology_order_usage',
    amountCents,
    description,
    JSON.stringify(metadata)
  ]);
  
  return result.rows[0].id;
}