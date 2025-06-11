/**
 * Script to execute dual credit migration on production database
 * This can be run via SSH on the production server
 * Date: 2025-06-11
 */

const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  connectionString: 'postgresql://postgres:password@radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main',
  ssl: { rejectUnauthorized: false }
});

const migrationSQL = `
-- Migration: Implement dual credit system for radiology organizations
-- Date: 2025-06-11
-- Description: Adds support for basic and advanced credit balances for radiology organizations

-- Add dual credit fields to organizations table
ALTER TABLE organizations 
ADD COLUMN basic_credit_balance INTEGER DEFAULT 0,
ADD COLUMN advanced_credit_balance INTEGER DEFAULT 0;

-- Update credit_usage_logs to track credit type
ALTER TABLE credit_usage_logs 
ADD COLUMN credit_type TEXT DEFAULT 'referring_credit' 
CHECK (credit_type IN ('referring_credit', 'radiology_basic', 'radiology_advanced'));

-- Update existing credit_usage_logs entries
-- All existing entries are from referring organizations
UPDATE credit_usage_logs 
SET credit_type = 'referring_credit' 
WHERE credit_type IS NULL;

-- Set initial test credits for existing radiology organizations
UPDATE organizations 
SET basic_credit_balance = 100, 
    advanced_credit_balance = 100
WHERE organization_type = 'radiology_group';

-- Add comments to document the credit system
COMMENT ON COLUMN organizations.credit_balance IS 'Credit balance for referring organizations (single credit type)';
COMMENT ON COLUMN organizations.basic_credit_balance IS 'Basic imaging credit balance for radiology organizations';
COMMENT ON COLUMN organizations.advanced_credit_balance IS 'Advanced imaging credit balance for radiology organizations (MRI, CT, PET, Nuclear)';
COMMENT ON COLUMN credit_usage_logs.credit_type IS 'Type of credit used: referring_credit for physicians, radiology_basic or radiology_advanced for radiology orgs';
`;

async function runMigration() {
  try {
    console.log('🚀 Starting dual credit system migration...\n');
    
    // Test connection
    console.log('🔗 Testing database connection...');
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected at:', testResult.rows[0].now);
    
    // Check if columns already exist
    console.log('\n🔍 Checking existing schema...');
    const columnsCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'organizations' 
      AND column_name IN ('basic_credit_balance', 'advanced_credit_balance')
    `);
    
    if (columnsCheck.rows.length > 0) {
      console.log('⚠️  Migration appears to have already been run.');
      console.log('   Found columns:', columnsCheck.rows.map(r => r.column_name).join(', '));
      
      // Show current radiology org credits
      const radiologyOrgs = await pool.query(`
        SELECT id, name, basic_credit_balance, advanced_credit_balance 
        FROM organizations 
        WHERE organization_type = 'radiology_group'
        ORDER BY name
      `);
      
      if (radiologyOrgs.rows.length > 0) {
        console.log('\n📊 Current radiology organization credits:');
        radiologyOrgs.rows.forEach(org => {
          console.log(`   ${org.name}: Basic=${org.basic_credit_balance}, Advanced=${org.advanced_credit_balance}`);
        });
      }
      
      return;
    }
    
    // Run migration
    console.log('\n⏳ Executing migration...');
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    
    // Check organization table columns
    const orgColumns = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'organizations' 
      AND column_name IN ('credit_balance', 'basic_credit_balance', 'advanced_credit_balance')
      ORDER BY column_name
    `);
    
    console.log('\nOrganization credit columns:');
    orgColumns.rows.forEach(col => {
      console.log(`  ✓ ${col.column_name}: ${col.data_type} (default: ${col.column_default || 'none'})`);
    });
    
    // Check credit_usage_logs columns
    const logColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'credit_usage_logs' 
      AND column_name = 'credit_type'
    `);
    
    console.log('\nCredit usage logs columns:');
    logColumns.rows.forEach(col => {
      console.log(`  ✓ ${col.column_name}: ${col.data_type}`);
    });
    
    // Show radiology organizations with new credits
    const radiologyOrgs = await pool.query(`
      SELECT id, name, basic_credit_balance, advanced_credit_balance 
      FROM organizations 
      WHERE organization_type = 'radiology_group'
      ORDER BY name
    `);
    
    if (radiologyOrgs.rows.length > 0) {
      console.log('\n📊 Radiology organizations with new credit balances:');
      radiologyOrgs.rows.forEach(org => {
        console.log(`  ✓ ${org.name} (ID: ${org.id}): Basic=${org.basic_credit_balance}, Advanced=${org.advanced_credit_balance}`);
      });
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed!');
    console.error('Error:', error.message);
    
    if (error.code === '42701') {
      console.error('\n⚠️  Columns already exist. The migration may have already been run.');
    }
    
    throw error;
  } finally {
    await pool.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the migration
runMigration().then(() => {
  console.log('\n✅ Script completed successfully');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Script failed:', error.message);
  process.exit(1);
});