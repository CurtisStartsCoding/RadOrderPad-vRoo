import { getMainDbClient } from '../../../config/db';
import logger from '../../../utils/logger';

/**
 * Update an organization's status
 *
 * @param orgId Organization ID
 * @param newStatus New status ('active', 'purgatory', 'on_hold', 'terminated')
 * @param adminUserId ID of the admin user making the change
 * @returns Promise with the updated organization
 */
interface Organization {
  id: number;
  name: string;
  status: string;
  credit_balance: number;
  type: string;
  npi?: string;
  tax_id?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
  fax_number?: string;
  contact_email?: string;
  website?: string;
  logo_url?: string;
  billing_id?: string;
  subscription_tier?: string;
  assigned_account_manager_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export async function updateOrganizationStatus(
  orgId: number,
  newStatus: string,
  adminUserId: number
): Promise<Organization> {
  // Validate status
  if (!['active', 'purgatory', 'on_hold', 'terminated'].includes(newStatus)) {
    throw new Error('Invalid status. Must be one of: active, purgatory, on_hold, terminated');
  }

  // Get a client for transaction
  const client = await getMainDbClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Get current status
    const currentStatusResult = await client.query(
      'SELECT status FROM organizations WHERE id = $1',
      [orgId]
    );
    
    if (currentStatusResult.rows.length === 0) {
      throw new Error(`Organization with ID ${orgId} not found`);
    }
    
    const currentStatus = currentStatusResult.rows[0].status;
    
    // Update organization status
    const updateResult = await client.query(
      'UPDATE organizations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newStatus, orgId]
    );
    
    const updatedOrg = updateResult.rows[0];
    
    // Handle purgatory events if status is changing to/from 'purgatory'
    if (currentStatus !== 'purgatory' && newStatus === 'purgatory') {
      // Organization is entering purgatory
      await client.query(
        `INSERT INTO purgatory_events 
         (organization_id, reason, triggered_by, triggered_by_id, status, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [orgId, 'manual_admin_action', 'super_admin', adminUserId, 'active']
      );
      
      // Update organization relationships to purgatory status
      await client.query(
        `UPDATE organization_relationships 
         SET status = 'purgatory', updated_at = NOW() 
         WHERE (organization_id = $1 OR related_organization_id = $1) 
         AND status = 'active'`,
        [orgId]
      );
    } else if (currentStatus === 'purgatory' && newStatus !== 'purgatory') {
      // Organization is leaving purgatory
      await client.query(
        `UPDATE purgatory_events 
         SET status = 'resolved', resolved_at = NOW() 
         WHERE organization_id = $1 AND status = 'active'`,
        [orgId]
      );
      
      // Restore organization relationships if new status is 'active'
      if (newStatus === 'active') {
        await client.query(
          `UPDATE organization_relationships 
           SET status = 'active', updated_at = NOW() 
           WHERE (organization_id = $1 OR related_organization_id = $1) 
           AND status = 'purgatory'`,
          [orgId]
        );
      }
    }
    
    // Log the action
    logger.info(`Organization ${orgId} status changed from ${currentStatus} to ${newStatus} by admin ${adminUserId}`);
    
    // Commit transaction
    await client.query('COMMIT');
    
    return updatedOrg;
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    logger.error(`Error updating organization status: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  } finally {
    // Release client back to pool
    client.release();
  }
}