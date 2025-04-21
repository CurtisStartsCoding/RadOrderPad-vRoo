import { getMainDbClient } from '../../../config/db';
import logger from '../../../utils/logger';

/**
 * Adjust an organization's credit balance
 *
 * @param orgId Organization ID
 * @param amount Amount to adjust (positive or negative)
 * @param reason Reason for the adjustment
 * @param adminUserId ID of the admin user making the adjustment
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

export async function adjustOrganizationCredits(
  orgId: number,
  amount: number,
  reason: string,
  adminUserId: number
): Promise<Organization> {
  // Validate input
  if (isNaN(amount)) {
    throw new Error('Amount must be a number');
  }
  
  if (!reason || reason.trim() === '') {
    throw new Error('A reason for the adjustment is required');
  }
  
  // Get a client for transaction
  const client = await getMainDbClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Check if organization exists
    const orgResult = await client.query(
      'SELECT * FROM organizations WHERE id = $1',
      [orgId]
    );
    
    if (orgResult.rows.length === 0) {
      throw new Error(`Organization with ID ${orgId} not found`);
    }
    
    const organization = orgResult.rows[0];
    const currentBalance = organization.credit_balance;
    const newBalance = currentBalance + amount;
    
    // Update organization credit balance
    const updateResult = await client.query(
      'UPDATE organizations SET credit_balance = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newBalance, orgId]
    );
    
    const updatedOrg = updateResult.rows[0];
    
    // Create billing event record
    await client.query(
      `INSERT INTO billing_events 
       (organization_id, event_type, amount_cents, currency, description, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        orgId,
        'manual_adjustment',
        Math.round(amount * 100), // Convert to cents
        'usd',
        reason
      ]
    );
    
    // Log the action
    logger.info(`Organization ${orgId} credit balance adjusted by ${amount} (${reason}) by admin ${adminUserId}`);
    
    // Commit transaction
    await client.query('COMMIT');
    
    return updatedOrg;
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    logger.error(`Error adjusting organization credits: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  } finally {
    // Release client back to pool
    client.release();
  }
}