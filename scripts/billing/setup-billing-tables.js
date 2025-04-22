/**
 * Setup Billing Tables
 * 
 * This script checks if the necessary billing tables exist in the database
 * and creates them if they don't.
 */

const { queryMainDb, queryPhiDb } = require('../../dist/config/db');

// Main function
async function main() {
  try {
    console.log('=== Setting Up Billing Tables ===\n');
    
    console.log('Checking Main Database (radorder_main)...');
    
    // Check if billing_events table exists in main database
    const tableCheckResult = await queryMainDb(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'billing_events'
      );
    `);
    
    const billingEventsExists = tableCheckResult.rows[0].exists;
    
    if (billingEventsExists) {
      console.log('billing_events table already exists in main database.');
      
      // Get table details
      const tableDetailsResult = await queryMainDb(`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_name = 'billing_events';
      `);
      
      console.log('Table details:', tableDetailsResult.rows);
    } else {
      console.log('billing_events table does not exist in main database. Creating it now...');
      
      // Create billing_events table
      await queryMainDb(`
        CREATE TABLE billing_events (
          id SERIAL PRIMARY KEY,
          organization_id INTEGER NOT NULL,
          event_type VARCHAR(50) NOT NULL,
          amount INTEGER,
          stripe_event_id VARCHAR(255),
          stripe_invoice_id VARCHAR(255),
          stripe_invoice_item_id VARCHAR(255),
          description TEXT,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
      `);
      
      console.log('billing_events table created successfully in main database.');
    }
    
    // Check if credit_usage_logs table exists
    const creditLogsCheckResult = await queryMainDb(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'credit_usage_logs'
      );
    `);
    
    const creditUsageLogsExists = creditLogsCheckResult.rows[0].exists;
    
    if (creditUsageLogsExists) {
      console.log('credit_usage_logs table already exists in main database.');
    } else {
      console.log('credit_usage_logs table does not exist in main database. Creating it now...');
      
      // Create credit_usage_logs table
      await queryMainDb(`
        CREATE TABLE credit_usage_logs (
          id SERIAL PRIMARY KEY,
          organization_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          order_id INTEGER,
          action_type VARCHAR(50) NOT NULL,
          credits_used INTEGER NOT NULL,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
      `);
      
      console.log('credit_usage_logs table created successfully in main database.');
    }
    
    // Check if purgatory_events table exists
    const purgatoryCheckResult = await queryMainDb(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'purgatory_events'
      );
    `);
    
    const purgatoryEventsExists = purgatoryCheckResult.rows[0].exists;
    
    if (purgatoryEventsExists) {
      console.log('purgatory_events table already exists in main database.');
    } else {
      console.log('purgatory_events table does not exist in main database. Creating it now...');
      
      // Create purgatory_events table
      await queryMainDb(`
        CREATE TABLE purgatory_events (
          id SERIAL PRIMARY KEY,
          organization_id INTEGER NOT NULL,
          status VARCHAR(50) NOT NULL,
          reason VARCHAR(100) NOT NULL,
          resolved_at TIMESTAMP WITHOUT TIME ZONE,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
      `);
      
      console.log('purgatory_events table created successfully in main database.');
    }
    
    console.log('\nChecking PHI Database (radorder_phi)...');
    
    // Check if billing_events table exists in PHI database
    const phiTableCheckResult = await queryPhiDb(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'billing_events'
      );
    `);
    
    const phiBillingEventsExists = phiTableCheckResult.rows[0].exists;
    
    if (phiBillingEventsExists) {
      console.log('billing_events table already exists in PHI database.');
      
      // Get table details
      const tableDetailsResult = await queryPhiDb(`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_name = 'billing_events';
      `);
      
      console.log('Table details:', tableDetailsResult.rows);
    } else {
      console.log('billing_events table does not exist in PHI database.');
      console.log('Creating billing_events table in PHI database...');
      
      // Create billing_events table in PHI database
      await queryPhiDb(`
        CREATE TABLE billing_events (
          id SERIAL PRIMARY KEY,
          organization_id INTEGER NOT NULL,
          event_type VARCHAR(50) NOT NULL,
          amount INTEGER,
          stripe_event_id VARCHAR(255),
          stripe_invoice_id VARCHAR(255),
          stripe_invoice_item_id VARCHAR(255),
          description TEXT,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
      `);
      
      console.log('billing_events table created successfully in PHI database.');
    }
    
    console.log('\nAll billing tables have been set up successfully!');
  } catch (error) {
    console.error('Error setting up billing tables:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);