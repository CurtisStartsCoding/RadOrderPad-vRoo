/**
 * Query Billing Tables
 * 
 * This script queries the database to check the existence and structure of billing-related tables.
 */

const { queryMainDb, queryPhiDb } = require('../../dist/config/db');

// Main function
async function main() {
  try {
    console.log('=== Querying Billing Tables ===\n');
    
    // Check Main Database
    console.log('Checking Main Database (radorder_main)...\n');
    
    // List all tables in main database
    console.log('All tables in main database:');
    const mainTablesResult = await queryMainDb(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    mainTablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Check if billing_events table exists in main database
    const mainBillingEventsResult = await queryMainDb(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'billing_events'
      );
    `);
    
    const mainBillingEventsExists = mainBillingEventsResult.rows[0].exists;
    console.log(`\nbilling_events table exists in main database: ${mainBillingEventsExists}`);
    
    if (mainBillingEventsExists) {
      // Get table structure
      console.log('\nStructure of billing_events table in main database:');
      const mainBillingEventsStructureResult = await queryMainDb(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'billing_events'
        ORDER BY ordinal_position;
      `);
      
      mainBillingEventsStructureResult.rows.forEach(row => {
        console.log(`- ${row.column_name} (${row.data_type}, ${row.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
      
      // Count records
      const mainBillingEventsCountResult = await queryMainDb(`
        SELECT COUNT(*) FROM billing_events;
      `);
      
      console.log(`\nNumber of records in billing_events table: ${mainBillingEventsCountResult.rows[0].count}`);
    }
    
    // Check PHI Database
    console.log('\n\nChecking PHI Database (radorder_phi)...\n');
    
    // List all tables in PHI database
    console.log('All tables in PHI database:');
    const phiTablesResult = await queryPhiDb(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    phiTablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Check if billing_events table exists in PHI database
    const phiBillingEventsResult = await queryPhiDb(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'billing_events'
      );
    `);
    
    const phiBillingEventsExists = phiBillingEventsResult.rows[0].exists;
    console.log(`\nbilling_events table exists in PHI database: ${phiBillingEventsExists}`);
    
    if (phiBillingEventsExists) {
      // Get table structure
      console.log('\nStructure of billing_events table in PHI database:');
      const phiBillingEventsStructureResult = await queryPhiDb(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'billing_events'
        ORDER BY ordinal_position;
      `);
      
      phiBillingEventsStructureResult.rows.forEach(row => {
        console.log(`- ${row.column_name} (${row.data_type}, ${row.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
      
      // Count records
      const phiBillingEventsCountResult = await queryPhiDb(`
        SELECT COUNT(*) FROM billing_events;
      `);
      
      console.log(`\nNumber of records in billing_events table: ${phiBillingEventsCountResult.rows[0].count}`);
    }
    
    // Check the reportUsage.ts file to see which database it's trying to use
    console.log('\n\nChecking reportUsage.ts implementation...');
    
    // Check if the file is importing queryMainDb or queryPhiDb
    const fs = require('fs');
    const path = require('path');
    
    const reportUsagePath = path.join(__dirname, '../../src/services/billing/usage/reportUsage.ts');
    
    if (fs.existsSync(reportUsagePath)) {
      const reportUsageContent = fs.readFileSync(reportUsagePath, 'utf8');
      
      const usesMainDb = reportUsageContent.includes('queryMainDb');
      const usesPhiDb = reportUsageContent.includes('queryPhiDb');
      
      console.log(`reportUsage.ts uses queryMainDb: ${usesMainDb}`);
      console.log(`reportUsage.ts uses queryPhiDb: ${usesPhiDb}`);
      
      // Check for billing_events table references
      const billingEventsMatches = reportUsageContent.match(/billing_events/g);
      console.log(`Number of 'billing_events' references in reportUsage.ts: ${billingEventsMatches ? billingEventsMatches.length : 0}`);
    } else {
      console.log('reportUsage.ts file not found');
    }
    
    console.log('\n=== Query Complete ===');
  } catch (error) {
    console.error('Error querying billing tables:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);