/**
 * Script to run the dual credit system migration
 * Date: 2025-06-11
 * 
 * Usage: node scripts/run-dual-credit-migration.js
 */

const { query } = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Starting dual credit system migration...\n');
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'implement-dual-credit-system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration SQL:');
    console.log('================');
    console.log(sql);
    console.log('================\n');
    
    // Run the migration
    console.log('⏳ Executing migration...');
    await query(sql);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    
    // Check organization table columns
    const orgColumns = await query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'organizations' 
      AND column_name IN ('credit_balance', 'basic_credit_balance', 'advanced_credit_balance')
      ORDER BY column_name
    `);
    
    console.log('\nOrganization credit columns:');
    orgColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (default: ${col.column_default || 'none'})`);
    });
    
    // Check credit_usage_logs columns
    const logColumns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'credit_usage_logs' 
      AND column_name = 'credit_type'
    `);
    
    console.log('\nCredit usage logs columns:');
    logColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Check radiology organizations
    const radiologyOrgs = await query(`
      SELECT id, name, basic_credit_balance, advanced_credit_balance 
      FROM organizations 
      WHERE organization_type = 'radiology_group'
    `);
    
    console.log('\nRadiology organizations with new credit balances:');
    radiologyOrgs.rows.forEach(org => {
      console.log(`  - ${org.name} (ID: ${org.id}): Basic=${org.basic_credit_balance}, Advanced=${org.advanced_credit_balance}`);
    });
    
    console.log('\n🎉 All done!');
    
  } catch (error) {
    console.error('\n❌ Migration failed!');
    console.error('Error:', error.message);
    
    if (error.code === '42701') {
      console.error('\n⚠️  It looks like the columns already exist. The migration may have already been run.');
    }
    
    process.exit(1);
  }
}

// Run the migration
runMigration().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});