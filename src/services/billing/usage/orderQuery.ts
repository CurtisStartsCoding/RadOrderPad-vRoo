/**
 * Order query service
 *
 * This module handles database interactions related to retrieving order data.
 */

import { getPhiDbClient, queryMainDb } from '../../../config/db';
import { OrderUsageData, RadiologyOrgInfo } from './types';
import { isAdvancedImaging } from './orderCategorization';

/**
 * Query the PHI database to get order counts by radiology organization
 * 
 * @param startDate Start date for the reporting period
 * @param endDate End date for the reporting period
 * @returns Promise with order usage data by radiology organization
 */
export async function getOrderCountsByRadiologyOrg(
  startDate: Date,
  endDate: Date
): Promise<OrderUsageData[]> {
  const client = await getPhiDbClient();
  
  try {
    // First, get all relevant orders in the date range
    const ordersQuery = `
      SELECT 
        radiology_organization_id,
        modality,
        final_cpt_code
      FROM 
        orders
      WHERE 
        status IN ('pending_radiology', 'scheduled', 'completed', 'results_available', 'results_acknowledged')
        AND (
          -- Orders that moved to pending_radiology or later within the date range
          (
            SELECT 
              created_at 
            FROM 
              order_history 
            WHERE 
              order_id = orders.id 
              AND (
                new_status = 'pending_radiology'
                OR event_type = 'sent_to_radiology'
              )
              AND created_at BETWEEN $1 AND $2
            ORDER BY 
              created_at ASC
            LIMIT 1
          ) IS NOT NULL
        )
    `;
    
    const ordersResult = await client.query(ordersQuery, [startDate.toISOString(), endDate.toISOString()]);
    
    // Process the orders and categorize them
    const orgOrderCounts: Record<number, { standard: number, advanced: number }> = {};
    
    for (const order of ordersResult.rows) {
      const radiologyOrgId = order.radiology_organization_id;
      
      // Use the isAdvancedImaging function from orderCategorization.ts
      // We'll import this function when we refactor reportUsage.ts
      const isAdvanced = isAdvancedImaging(order.modality, order.final_cpt_code);
      
      if (!orgOrderCounts[radiologyOrgId]) {
        orgOrderCounts[radiologyOrgId] = { standard: 0, advanced: 0 };
      }
      
      if (isAdvanced) {
        orgOrderCounts[radiologyOrgId].advanced += 1;
      } else {
        orgOrderCounts[radiologyOrgId].standard += 1;
      }
    }
    
    // Convert to array format
    return Object.entries(orgOrderCounts).map(([orgId, counts]) => ({
      radiologyOrgId: parseInt(orgId),
      standardOrderCount: counts.standard,
      advancedOrderCount: counts.advanced
    }));
  } finally {
    client.release();
  }
}

/**
 * Get Stripe billing IDs for radiology organizations
 * 
 * @param radiologyOrgIds Array of radiology organization IDs
 * @returns Promise with mapping of organization ID to billing ID and name
 */
export async function getRadiologyOrgBillingIds(
  radiologyOrgIds: number[]
): Promise<Map<number, RadiologyOrgInfo>> {
  if (radiologyOrgIds.length === 0) {
    return new Map();
  }
  
  const placeholders = radiologyOrgIds.map((_, index) => `$${index + 1}`).join(',');
  const query = `
    SELECT 
      id, 
      name, 
      billing_id 
    FROM 
      organizations 
    WHERE 
      id IN (${placeholders})
      AND type = 'radiology_group'
      AND billing_id IS NOT NULL
  `;
  
  const result = await queryMainDb(query, radiologyOrgIds);
  
  const billingIdMap = new Map<number, RadiologyOrgInfo>();
  for (const org of result.rows) {
    billingIdMap.set(org.id, { 
      billingId: org.billing_id,
      name: org.name
    });
  }
  
  return billingIdMap;
}

// The isAdvancedImaging function is now imported from orderCategorization.ts