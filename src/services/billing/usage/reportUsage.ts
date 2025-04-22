/**
 * Radiology Order Usage Reporting
 * 
 * This module orchestrates the process of reporting radiology order usage to Stripe
 * for billing purposes. It uses the other modules to:
 * 1. Query orders from the PHI database
 * 2. Categorize orders as standard or advanced
 * 3. Create Stripe invoice items
 * 4. Record billing events in the database
 */

import { getMainDbClient } from '../../../config/db';
import logger from '../../../utils/logger';
import { OrderUsageReport, OrderUsageData } from './types';
import { getOrderCountsByRadiologyOrg, getRadiologyOrgBillingIds } from './orderQuery';
import { calculateOrderAmounts } from './orderCategorization';
import { createStripeInvoiceItems, recordBillingEvent } from './billingReport';

/**
 * Report radiology order usage for billing purposes
 * 
 * @param startDate Start date for the reporting period
 * @param endDate End date for the reporting period
 * @returns Promise with array of usage reports
 */
export async function reportRadiologyOrderUsage(
  startDate: Date,
  endDate: Date
): Promise<OrderUsageReport[]> {
  logger.info(`Reporting radiology order usage from ${startDate.toISOString()} to ${endDate.toISOString()}`);
  
  try {
    // Get order counts by radiology organization
    const orderCounts = await getOrderCountsByRadiologyOrg(startDate, endDate);
    
    if (orderCounts.length === 0) {
      logger.info('No orders found in the specified date range');
      return [];
    }
    
    // Get billing IDs for the radiology organizations
    const radiologyOrgIds = orderCounts.map(data => data.radiologyOrgId);
    const billingIdMap = await getRadiologyOrgBillingIds(radiologyOrgIds);
    
    // Process each organization and report usage to Stripe
    const reports: OrderUsageReport[] = [];
    
    for (const orderData of orderCounts) {
      const report = await processOrganizationUsage(orderData, billingIdMap.get(orderData.radiologyOrgId), startDate, endDate);
      reports.push(report);
    }
    
    return reports;
  } catch (error) {
    logger.error('Error reporting radiology order usage:', error);
    throw error;
  }
}

/**
 * Process usage data for a single organization
 * 
 * @param orderData Order usage data for the organization
 * @param orgInfo Organization billing info
 * @param startDate Start date for the reporting period
 * @param endDate End date for the reporting period
 * @returns Promise with usage report
 */
async function processOrganizationUsage(
  orderData: OrderUsageData,
  orgInfo: { billingId: string; name: string } | undefined,
  startDate: Date,
  endDate: Date
): Promise<OrderUsageReport> {
  const { radiologyOrgId, standardOrderCount, advancedOrderCount } = orderData;
  
  // Skip if no billing ID found
  if (!orgInfo || !orgInfo.billingId) {
    return {
      organizationId: radiologyOrgId,
      organizationName: orgInfo?.name || 'Unknown',
      billingId: '',
      standardOrderCount,
      advancedOrderCount,
      standardOrderAmount: standardOrderCount * 200, // Using constants directly here for clarity
      advancedOrderAmount: advancedOrderCount * 700,
      totalAmount: (standardOrderCount * 200) + (advancedOrderCount * 700),
      reportedToStripe: false,
      error: 'No Stripe billing ID found for this organization'
    };
  }
  
  const { billingId, name } = orgInfo;
  const { standardOrderAmount, advancedOrderAmount, totalAmount } = calculateOrderAmounts(
    standardOrderCount, 
    advancedOrderCount
  );
  
  // Skip if no orders
  if (standardOrderCount === 0 && advancedOrderCount === 0) {
    return {
      organizationId: radiologyOrgId,
      organizationName: name,
      billingId,
      standardOrderCount: 0,
      advancedOrderCount: 0,
      standardOrderAmount: 0,
      advancedOrderAmount: 0,
      totalAmount: 0,
      reportedToStripe: false
    };
  }
  
  try {
    // Create invoice items in Stripe
    const invoiceItemIds = await createStripeInvoiceItems(
      billingId,
      radiologyOrgId,
      standardOrderCount,
      advancedOrderCount,
      startDate,
      endDate
    );
    
    // Record billing event in database
    const client = await getMainDbClient();
    try {
      const description = `Radiology order usage: ${standardOrderCount} standard orders, ${advancedOrderCount} advanced orders (${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]})`;
      
      await recordBillingEvent(
        client,
        radiologyOrgId,
        totalAmount,
        description,
        invoiceItemIds
      );
      
      logger.info(`Successfully reported usage for organization ${radiologyOrgId} (${name}): ${standardOrderCount} standard orders, ${advancedOrderCount} advanced orders, total amount: $${(totalAmount / 100).toFixed(2)}`);
      
      return {
        organizationId: radiologyOrgId,
        organizationName: name,
        billingId,
        standardOrderCount,
        advancedOrderCount,
        standardOrderAmount,
        advancedOrderAmount,
        totalAmount,
        reportedToStripe: true,
        stripeInvoiceItemIds: invoiceItemIds
      };
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error(`Error processing usage for organization ${radiologyOrgId}:`, error);
    
    return {
      organizationId: radiologyOrgId,
      organizationName: name,
      billingId,
      standardOrderCount,
      advancedOrderCount,
      standardOrderAmount,
      advancedOrderAmount,
      totalAmount,
      reportedToStripe: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}