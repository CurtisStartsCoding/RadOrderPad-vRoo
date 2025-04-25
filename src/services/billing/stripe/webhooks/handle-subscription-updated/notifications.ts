import { PoolClient } from 'pg';
import { generalNotifications } from '../../../../../services/notification/services';
import logger from '../../../../../utils/logger';

/**
 * Send tier change notifications to organization admins
 * 
 * @param client Database client
 * @param orgId Organization ID
 * @param orgName Organization name
 * @param currentTier Current subscription tier
 * @param newTier New subscription tier
 * @returns Promise that resolves when notifications are sent
 */
export async function sendTierChangeNotifications(
  client: PoolClient,
  orgId: number,
  orgName: string,
  currentTier: string,
  newTier: string
): Promise<void> {
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
        'Subscription Tier Change',
        `Dear ${admin.first_name} ${admin.last_name},\n\n` +
        `Your organization's subscription tier has been updated from ${currentTier} to ${newTier}.\n\n` +
        `This change may affect your monthly credit allocation and billing amount. ` +
        `Please review your account settings for more details.\n\n` +
        `Best regards,\n` +
        `The RadOrderPad Team`
      );
    } catch (notificationError) {
      logger.error(`Failed to send notification to admin`, {
        error: notificationError,
        adminEmail: admin.email,
        orgId
      });
      // Continue processing other admins even if one notification fails
    }
  }
  
  logger.info(`Sent tier change notifications for organization`, {
    orgId,
    orgName,
    currentTier,
    newTier,
    recipientCount: adminUsersResult.rows.length
  });
}