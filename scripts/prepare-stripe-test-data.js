/**
 * Prepare Test Data for Stripe Webhook Testing
 * 
 * This script ensures that the necessary test data exists in the database
 * before running the Stripe webhook tests.
 * 
 * Usage:
 * node scripts/prepare-stripe-test-data.js --org-id=1 --customer-id=cus_TEST123456
 */

const { Pool } = require('pg');
const { parseArgs } = require('util');
require('dotenv').config();

// Parse command line arguments
const options = {
  'org-id': { type: 'string' },
  'customer-id': { type: 'string' }
};

const { values } = parseArgs({ options, strict: false });
const orgId = parseInt(values['org-id'] || '1', 10);
const customerId = values['customer-id'] || 'cus_TEST123456';

// Database connection
const pool = new Pool({
  connectionString: process.env.MAIN_DATABASE_URL
});

/**
 * Ensure the organization exists with the specified Stripe customer ID
 */
async function ensureOrganizationExists() {
  const client = await pool.connect();
  
  try {
    // Check if the organization exists
    const orgResult = await client.query(
      'SELECT id, name, billing_id FROM organizations WHERE id = $1',
      [orgId]
    );
    
    if (orgResult.rowCount === 0) {
      // Create the organization if it doesn't exist
      console.log(`Creating test organization with ID ${orgId}...`);
      await client.query(
        `INSERT INTO organizations 
         (id, name, type, status, subscription_tier, credit_balance, billing_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [orgId, 'Test Organization', 'referring_practice', 'active', 'tier_1', 100, customerId]
      );
      console.log('Organization created successfully.');
    } else {
      // Update the organization's billing_id if it exists
      console.log(`Updating test organization with ID ${orgId}...`);
      await client.query(
        'UPDATE organizations SET billing_id = $1 WHERE id = $2',
        [customerId, orgId]
      );
      console.log('Organization updated successfully.');
    }
    
    // Ensure there's at least one admin user for the organization
    const userResult = await client.query(
      'SELECT id FROM users WHERE organization_id = $1 AND role IN (\'admin_referring\', \'admin_radiology\')',
      [orgId]
    );
    
    if (userResult.rowCount === 0) {
      console.log('Creating test admin user...');
      await client.query(
        `INSERT INTO users 
         (first_name, last_name, email, role, organization_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        ['Test', 'Admin', 'test.admin@example.com', 'admin_referring', orgId]
      );
      console.log('Admin user created successfully.');
    }
    
    // Clean up any existing test data
    console.log('Cleaning up existing test data...');
    
    // Delete existing purgatory events for this organization
    await client.query(
      'DELETE FROM purgatory_events WHERE organization_id = $1',
      [orgId]
    );
    
    // Reset organization status and subscription tier
    await client.query(
      'UPDATE organizations SET status = $1, subscription_tier = $2, credit_balance = $3 WHERE id = $4',
      ['active', 'tier_1', 100, orgId]
    );
    
    console.log('Test data prepared successfully.');
    
  } catch (error) {
    console.error('Error preparing test data:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await ensureOrganizationExists();
    console.log('Test data preparation completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error in test data preparation:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the main function
main();sole.log('Test data preparation completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error in test data preparation:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the main function
main();