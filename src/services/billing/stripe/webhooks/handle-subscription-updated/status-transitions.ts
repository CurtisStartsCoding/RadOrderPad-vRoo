import { PoolClient } from 'pg';
import { generalNotifications } from '../../../../../services/notification/services';

/**
 * Handle transition to purgatory status
 * 
 * @param client Database client
 * @param orgId Organization ID
 * @param orgName Organization name
 * @returns Promise that resolves when the transition is complete
 */
export async function handlePurgatoryTransition(
  client: PoolClient,
  orgId: number,
  orgName: string
): Promise<void> {
  // Create purgatory event
  await client.query(
    `INSERT INTO purgatory_events 
     (organization_id, reason, triggered_by) 
     VALUES ($1, $2, $3)`,
    [
      orgId,
      'subscription_canceled',
      'stripe_webhook'
    ]
  );
  
  // Update organization relationships
  await client.query(
    `UPDATE organization_relationships 
     SET status = 'purgatory' 
     WHERE (organization_id = $1 OR related_organization_id = $1) 
     AND status = 'active'`,
    [orgId]
  );
  
  // Get admin users for notifications
  const adminUsersResult = await client.query(
    `SELECT email, first_name, last_name 
     FROM users 
     WHERE organization_id = $1 
     AND role IN ('admin_referring', 'admin_radiology')`,
    [orgId]
  );
  
  // Send notifications to all admin users
  for (const admin of adminUsersResult.rows) {
    try {
      await generalNotifications.sendNotificationEmail(
        admin.email,
        'IMPORTANT: Account Status Change',
        `Dear ${admin.first_name} ${admin.last_name},\n\n` +
        `We regret to inform you that your organization's account (${orgName}) ` +
        `has been placed on hold due to subscription cancellation.\n\n` +
        `While your account is on hold, you will have limited access to RadOrderPad features. ` +
        `To restore full access, please renew your subscription in your account settings ` +
        `or contact our support team for assistance.\n\n` +
        `Best regards,\n` +
        `The RadOrderPad Team`
      );
    } catch (notificationError) {
      console.error(`Failed to send notification to ${admin.email}:`, notificationError);
      // Continue processing other admins even if one notification fails
    }
  }
  
  console.log(`Organization ${orgId} placed in purgatory mode`);
}

/**
 * Handle transition to active status (reactivation)
 * 
 * @param client Database client
 * @param orgId Organization ID
 * @param orgName Organization name
 * @returns Promise that resolves when the transition is complete
 */
export async function handleReactivationTransition(
  client: PoolClient,
  orgId: number,
  orgName: string
): Promise<void> {
  // Update purgatory events - set all pending purgatory events to resolved
  await client.query(
    `UPDATE purgatory_events 
     SET status = 'resolved', resolved_at = NOW() 
     WHERE organization_id = $1 AND status = 'pending'`,
    [orgId]
  );
  
  // Update organization relationships
  await client.query(
    `UPDATE organization_relationships 
     SET status = 'active' 
     WHERE (organization_id = $1 OR related_organization_id = $1) 
     AND status = 'purgatory'`,
    [orgId]
  );
  
  // Get admin users for notifications
  const adminUsersResult = await client.query(
    `SELECT email, first_name, last_name 
     FROM users 
     WHERE organization_id = $1 
     AND role IN ('admin_referring', 'admin_radiology')`,
    [orgId]
  );
  
  // Send notifications to all admin users
  for (const admin of adminUsersResult.rows) {
    try {
      await generalNotifications.sendNotificationEmail(
        admin.email,
        'Account Reactivated',
        `Dear ${admin.first_name} ${admin.last_name},\n\n` +
        `We're pleased to inform you that your organization's account (${orgName}) ` +
        `has been reactivated. You now have full access to all RadOrderPad features.\n\n` +
        `Thank you for your continued partnership.\n\n` +
        `Best regards,\n` +
        `The RadOrderPad Team`
      );
    } catch (notificationError) {
      console.error(`Failed to send notification to ${admin.email}:`, notificationError);
      // Continue processing other admins even if one notification fails
    }
  }
  
  console.log(`Organization ${orgId} reactivated`);
}