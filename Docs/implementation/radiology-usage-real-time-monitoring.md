# Real-Time Radiology Order Usage Monitoring

**Version:** 1.0
**Date:** 2025-04-21
**Status:** Proposed Enhancement

## Overview

This document outlines a proposed enhancement to implement real-time monitoring of radiology order usage. While the current implementation processes billing in batches, high-volume radiology practices (which may receive 1,600+ orders per day) require real-time visibility into order volumes and projected billing amounts.

## Business Need

Radiology groups can process a large volume of orders daily, which can quickly accumulate significant billing amounts. Super administrators need real-time visibility into:

1. Current order counts by radiology group
2. Projected billing amounts for the current period
3. Trends and anomalies in order volume
4. Early warnings when groups approach unusual activity levels

Without real-time monitoring, billing issues might only be discovered at the end of a billing cycle, potentially leading to disputes or financial surprises.

## Current Implementation Limitations

The current batch processing approach:

- Only processes billing at scheduled intervals (e.g., monthly)
- Doesn't provide visibility into current period usage until processing occurs
- Lacks early warning capabilities for unusual activity
- Doesn't allow for proactive intervention in case of billing anomalies

## Proposed Solution

### 1. Real-Time Order Tracking Table

Create a new table in the main database to track real-time order counts:

```sql
CREATE TABLE radiology_usage_tracking (
  id SERIAL PRIMARY KEY,
  radiology_organization_id INTEGER NOT NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  standard_order_count INTEGER NOT NULL DEFAULT 0,
  advanced_order_count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Add indexes for efficient querying
CREATE INDEX idx_radiology_usage_org_id ON radiology_usage_tracking(radiology_organization_id);
CREATE INDEX idx_radiology_usage_period ON radiology_usage_tracking(billing_period_start, billing_period_end);
```

### 2. Real-Time Update Mechanism

Modify the order finalization process to update the tracking table when an order is sent to radiology:

```typescript
/**
 * Update real-time usage tracking when an order is sent to radiology
 * 
 * @param orderId Order ID
 * @param radiologyOrgId Radiology organization ID
 * @param isAdvancedImaging Whether this is advanced imaging
 */
async function updateRealTimeUsageTracking(
  orderId: number,
  radiologyOrgId: number,
  isAdvancedImaging: boolean
): Promise<void> {
  // Determine current billing period
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
  
  // Update the tracking table
  await queryMainDb(`
    INSERT INTO radiology_usage_tracking (
      radiology_organization_id,
      billing_period_start,
      billing_period_end,
      standard_order_count,
      advanced_order_count,
      last_updated
    )
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (radiology_organization_id, billing_period_start, billing_period_end)
    DO UPDATE SET
      standard_order_count = CASE WHEN $6 = false THEN radiology_usage_tracking.standard_order_count + 1 ELSE radiology_usage_tracking.standard_order_count END,
      advanced_order_count = CASE WHEN $6 = true THEN radiology_usage_tracking.advanced_order_count + 1 ELSE radiology_usage_tracking.advanced_order_count END,
      last_updated = NOW()
  `, [
    radiologyOrgId,
    periodStart.toISOString(),
    periodEnd.toISOString(),
    isAdvancedImaging ? 0 : 1,
    isAdvancedImaging ? 1 : 0,
    isAdvancedImaging
  ]);
  
  // Log the update
  logger.info(`Updated real-time usage tracking for radiology organization ${radiologyOrgId}: order ${orderId}, ${isAdvancedImaging ? 'advanced' : 'standard'} imaging`);
}
```

### 3. Super Admin Dashboard API

Create an API endpoint to retrieve current usage statistics:

```typescript
/**
 * Get current radiology usage statistics for the super admin dashboard
 * 
 * @param req Express request
 * @param res Express response
 */
export async function getCurrentRadiologyUsage(req: Request, res: Response): Promise<void> {
  try {
    // Get query parameters
    const { period } = req.query;
    
    // Determine date range
    let periodStart: Date, periodEnd: Date;
    const now = new Date();
    
    if (period === 'month-to-date') {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = now;
    } else if (period === 'previous-month') {
      periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      // Default to current month
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    
    // Query the tracking table
    const result = await queryMainDb(`
      SELECT 
        t.radiology_organization_id,
        o.name AS organization_name,
        t.standard_order_count,
        t.advanced_order_count,
        t.standard_order_count * ${STANDARD_ORDER_PRICE_CENTS} AS standard_order_amount_cents,
        t.advanced_order_count * ${ADVANCED_ORDER_PRICE_CENTS} AS advanced_order_amount_cents,
        (t.standard_order_count * ${STANDARD_ORDER_PRICE_CENTS} + t.advanced_order_count * ${ADVANCED_ORDER_PRICE_CENTS}) AS total_amount_cents,
        t.last_updated
      FROM 
        radiology_usage_tracking t
      JOIN
        organizations o ON t.radiology_organization_id = o.id
      WHERE
        t.billing_period_start <= $1
        AND t.billing_period_end >= $2
      ORDER BY
        total_amount_cents DESC
    `, [periodStart.toISOString(), periodEnd.toISOString()]);
    
    // Calculate totals
    const totalStandardOrders = result.rows.reduce((sum, row) => sum + row.standard_order_count, 0);
    const totalAdvancedOrders = result.rows.reduce((sum, row) => sum + row.advanced_order_count, 0);
    const totalAmountCents = result.rows.reduce((sum, row) => sum + row.total_amount_cents, 0);
    
    // Return the results
    res.json({
      period: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString()
      },
      organizations: result.rows,
      totals: {
        standardOrderCount: totalStandardOrders,
        advancedOrderCount: totalAdvancedOrders,
        totalAmountCents: totalAmountCents,
        totalAmountFormatted: `$${(totalAmountCents / 100).toFixed(2)}`
      }
    });
  } catch (error) {
    logger.error('Error getting current radiology usage:', error);
    res.status(500).json({ error: 'Failed to retrieve radiology usage statistics' });
  }
}
```

### 4. Alert System

Implement an alert system to notify super admins of unusual activity:

```typescript
/**
 * Check for unusual radiology order activity and send alerts if needed
 */
async function checkForUnusualActivity(): Promise<void> {
  try {
    // Get current month usage
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Calculate days elapsed in current month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = now.getDate();
    const monthCompletion = daysElapsed / daysInMonth;
    
    // Get previous month's usage for comparison
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Query current month usage
    const currentUsageResult = await queryMainDb(`
      SELECT 
        t.radiology_organization_id,
        o.name AS organization_name,
        t.standard_order_count + t.advanced_order_count AS total_order_count,
        (t.standard_order_count * ${STANDARD_ORDER_PRICE_CENTS} + t.advanced_order_count * ${ADVANCED_ORDER_PRICE_CENTS}) AS total_amount_cents
      FROM 
        radiology_usage_tracking t
      JOIN
        organizations o ON t.radiology_organization_id = o.id
      WHERE
        t.billing_period_start = $1
    `, [currentMonthStart.toISOString()]);
    
    // Query previous month usage
    const previousUsageResult = await queryMainDb(`
      SELECT 
        t.radiology_organization_id,
        t.standard_order_count + t.advanced_order_count AS total_order_count,
        (t.standard_order_count * ${STANDARD_ORDER_PRICE_CENTS} + t.advanced_order_count * ${ADVANCED_ORDER_PRICE_CENTS}) AS total_amount_cents
      FROM 
        radiology_usage_tracking t
      WHERE
        t.billing_period_start = $1
    `, [previousMonthStart.toISOString()]);
    
    // Create a map of previous month usage by organization ID
    const previousUsageMap = new Map<number, { orderCount: number, amountCents: number }>();
    for (const row of previousUsageResult.rows) {
      previousUsageMap.set(row.radiology_organization_id, {
        orderCount: row.total_order_count,
        amountCents: row.total_amount_cents
      });
    }
    
    // Check each organization for unusual activity
    const alertThreshold = 1.5; // 50% higher than expected based on month completion
    const alerts = [];
    
    for (const row of currentUsageResult.rows) {
      const previousUsage = previousUsageMap.get(row.radiology_organization_id);
      
      if (previousUsage) {
        // Calculate expected usage based on previous month and days elapsed
        const expectedOrderCount = previousUsage.orderCount * monthCompletion;
        const expectedAmountCents = previousUsage.amountCents * monthCompletion;
        
        // Check if current usage exceeds expected by the threshold
        if (row.total_order_count > expectedOrderCount * alertThreshold) {
          alerts.push({
            organizationId: row.radiology_organization_id,
            organizationName: row.organization_name,
            currentOrderCount: row.total_order_count,
            expectedOrderCount: Math.round(expectedOrderCount),
            percentageAboveExpected: Math.round((row.total_order_count / expectedOrderCount - 1) * 100),
            currentAmountCents: row.total_amount_cents,
            expectedAmountCents: Math.round(expectedAmountCents),
            daysElapsed,
            monthCompletion: Math.round(monthCompletion * 100)
          });
        }
      }
    }
    
    // Send alerts if any unusual activity detected
    if (alerts.length > 0) {
      // Send email to super admins
      // This would use the notification service
      logger.info(`Sending unusual activity alerts for ${alerts.length} organizations`);
      
      // Log the alerts
      for (const alert of alerts) {
        logger.warn(`Unusual activity for ${alert.organizationName}: ${alert.currentOrderCount} orders (${alert.percentageAboveExpected}% above expected)`);
      }
    }
  } catch (error) {
    logger.error('Error checking for unusual radiology order activity:', error);
  }
}
```

### 5. Integration with Batch Billing

The real-time tracking system would complement, not replace, the batch billing process:

1. Real-time tracking provides visibility and alerts
2. Batch processing handles the actual billing
3. At the end of each billing period, the real-time tracking data can be reconciled with the batch processing results

## Implementation Considerations

### Database Impact

- The tracking table will have one row per radiology organization per billing period
- For 100 radiology organizations with monthly billing, this would be 1,200 rows per year
- The table size would be minimal, even with frequent updates

### Performance Considerations

- Updates to the tracking table should be done asynchronously to avoid impacting order processing
- Consider using a message queue for high-volume scenarios
- Implement appropriate indexes for efficient querying

### Security and Access Control

- Real-time usage data should only be accessible to super admins
- Implement appropriate API authentication and authorization
- Log all access to usage data for audit purposes

## UI Mockup for Super Admin Dashboard

```
+-----------------------------------------------+
| Radiology Order Usage - Current Month         |
+-----------------------------------------------+
| Organization | Standard | Advanced | Amount   |
|--------------|----------|----------|----------|
| Rad Group A  | 1,245    | 876      | $8,622   |
| Rad Group B  | 987      | 432      | $5,004   |
| Rad Group C  | 654      | 321      | $3,555   |
|--------------|----------|----------|----------|
| Total        | 2,886    | 1,629    | $17,181  |
+-----------------------------------------------+

+-----------------------------------------------+
| Unusual Activity Alerts                       |
+-----------------------------------------------+
| ⚠️ Rad Group A: 50% above expected volume     |
| ⚠️ Rad Group D: 75% above expected volume     |
+-----------------------------------------------+
```

## Implementation Timeline

1. **Phase 1**: Database schema changes and tracking table creation
2. **Phase 2**: Real-time update mechanism implementation
3. **Phase 3**: Super admin dashboard API development
4. **Phase 4**: Alert system implementation
5. **Phase 5**: UI integration and testing

## Related Documentation

- [Radiology Order Usage Reporting](./radiology-usage-reporting.md) - The current batch billing implementation
- [Billing Credits](../billing_credits.md) - Overview of the billing system
- [Stripe Integration Setup](./stripe-integration-setup.md) - Details on Stripe integration

## Conclusion

Implementing real-time monitoring of radiology order usage will provide critical visibility for super administrators, especially for high-volume practices. This enhancement will complement the existing batch billing process, allowing for proactive management of billing issues and early detection of unusual activity patterns.

The proposed solution balances the need for real-time visibility with system performance considerations, ensuring that order processing remains efficient while providing the necessary monitoring capabilities.