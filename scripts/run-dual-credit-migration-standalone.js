#!/usr/bin/env node

/**
 * Standalone script to run dual credit migration
 * Can be run directly on the server without any environment setup
 * Date: 2025-06-11
 */

const { Pool } = require('pg');

// Direct database connection configuration
const DATABASE_URL = 'postgresql://postgres:password@radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  let client;
  
  try {
    console.log('🚀 Starting dual credit system migration...\n');
    console.log('📍 Connecting to database: radorder_main');
    
    // Get a client from the pool
    client = await pool.connect();
    
    // Test connection
    console.log('🔗 Testing database connection...');
    const testResult = await client.query('SELECT NOW()');
    console.log('✅ Database connected at:', testResult.rows[0].now);
    
    // Check if columns already exist
    console.log('\n🔍 Checking if migration has already been applied...');
    const columnsCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'organizations' 
      AND column_name IN ('basic_credit_balance', 'advanced_credit_balance')
    `);
    
    if (columnsCheck.rows.length > 0) {
      console.log('\n⚠️  Migration has already been applied!');
      console.log('   Found columns:', columnsCheck.rows.map(r => r.column_name).join(', '));
      
      // Show current radiology org credits
      const radiologyOrgs = await client.query(`
        SELECT id, name, type, basic_credit_balance, advanced_credit_balance 
        FROM organizations 
        WHERE type IN ('radiology_group', 'radiology')
        ORDER BY name
      `);
      
      if (radiologyOrgs.rows.length > 0) {
        console.log('\n📊 Current radiology organization credits:');
        radiologyOrgs.rows.forEach(org => {
          console.log(`   ${org.name} (ID: ${org.id}): Basic=${org.basic_credit_balance}, Advanced=${org.advanced_credit_balance}`);
        });
      } else {
        console.log('\n📊 No radiology organizations found in the database.');
      }
      
      return;
    }
    
    // Start transaction
    console.log('\n🔄 Starting transaction...');
    await client.query('BEGIN');
    
    try {
      // Add dual credit fields to organizations table
      console.log('\n📝 Adding basic_credit_balance and advanced_credit_balance columns to organizations table...');
      await client.query(`
        ALTER TABLE organizations 
        ADD COLUMN basic_credit_balance INTEGER DEFAULT 0,
        ADD COLUMN advanced_credit_balance INTEGER DEFAULT 0
      `);
      console.log('   ✓ Columns added successfully');
      
      // Update credit_usage_logs to track credit type
      console.log('\n📝 Adding credit_type column to credit_usage_logs table...');
      await client.query(`
        ALTER TABLE credit_usage_logs 
        ADD COLUMN credit_type TEXT DEFAULT 'referring_credit' 
        CHECK (credit_type IN ('referring_credit', 'radiology_basic', 'radiology_advanced'))
      `);
      console.log('   ✓ Column added successfully');
      
      // Update existing credit_usage_logs entries
      console.log('\n📝 Updating existing credit_usage_logs entries...');
      const updateResult = await client.query(`
        UPDATE credit_usage_logs 
        SET credit_type = 'referring_credit' 
        WHERE credit_type IS NULL
      `);
      console.log(`   ✓ Updated ${updateResult.rowCount} existing log entries`);
      
      // Set initial test credits for existing radiology organizations
      console.log('\n📝 Setting initial credits for radiology organizations...');
      const creditResult = await client.query(`
        UPDATE organizations 
        SET basic_credit_balance = 100, 
            advanced_credit_balance = 100
        WHERE type IN ('radiology_group', 'radiology')
        RETURNING id, name, type, basic_credit_balance, advanced_credit_balance
      `);
      
      if (creditResult.rows.length > 0) {
        console.log(`   ✓ Updated ${creditResult.rows.length} radiology organizations with initial credits:`);
        creditResult.rows.forEach(org => {
          console.log(`     - ${org.name} (${org.type}): Basic=100, Advanced=100`);
        });
      } else {
        console.log('   ℹ️  No radiology organizations found to update');
      }
      
      // Add comments to document the credit system
      console.log('\n📝 Adding documentation comments...');
      await client.query(`
        COMMENT ON COLUMN organizations.credit_balance IS 'Credit balance for referring organizations (single credit type)'
      `);
      await client.query(`
        COMMENT ON COLUMN organizations.basic_credit_balance IS 'Basic imaging credit balance for radiology organizations'
      `);
      await client.query(`
        COMMENT ON COLUMN organizations.advanced_credit_balance IS 'Advanced imaging credit balance for radiology organizations (MRI, CT, PET, Nuclear)'
      `);
      await client.query(`
        COMMENT ON COLUMN credit_usage_logs.credit_type IS 'Type of credit used: referring_credit for physicians, radiology_basic or radiology_advanced for radiology orgs'
      `);
      console.log('   ✓ Comments added successfully');
      
      // Commit transaction
      console.log('\n💾 Committing transaction...');
      await client.query('COMMIT');
      console.log('   ✓ Transaction committed successfully');
      
      // Verify the changes
      console.log('\n🔍 Verifying migration results...');
      
      // Check organization table columns
      const orgColumns = await client.query(`
        SELECT column_name, data_type, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'organizations' 
        AND column_name IN ('credit_balance', 'basic_credit_balance', 'advanced_credit_balance')
        ORDER BY column_name
      `);
      
      console.log('\n✅ Organization table columns:');
      orgColumns.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} (default: ${col.column_default || 'none'})`);
      });
      
      // Check credit_usage_logs columns
      const logColumns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'credit_usage_logs' 
        AND column_name = 'credit_type'
      `);
      
      console.log('\n✅ Credit usage logs columns:');
      logColumns.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type}`);
      });
      
      console.log('\n🎉 Migration completed successfully!');
      
    } catch (error) {
      // Rollback on error
      console.log('\n❌ Error during migration, rolling back...');
      await client.query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed!');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === '42701') {
      console.error('\n⚠️  This error typically means the columns already exist.');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('\n⚠️  Could not connect to database. Please check:');
      console.error('   1. You are running this on the correct server');
      console.error('   2. The database is accessible from this server');
      console.error('   3. The connection string is correct');
    }
    
    throw error;
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
    // Close the pool
    await pool.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the migration
console.log('==================================================');
console.log('  Dual Credit System Migration for RadOrderPad');
console.log('==================================================\n');

runMigration().then(() => {
  console.log('\n✅ Script completed successfully');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Script failed');
  process.exit(1);
});