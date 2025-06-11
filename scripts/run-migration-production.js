/**
 * Script to run the dual credit system migration on production database
 * Date: 2025-06-11
 * 
 * Usage: 
 * For production with private DB: USE_PRIVATE_DB=true NODE_ENV=production node scripts/run-migration-production.js
 * For production with public DB: NODE_ENV=production node scripts/run-migration-production.js
 */

require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Determine which database URL to use
const usePrivateDb = process.env.USE_PRIVATE_DB === 'true';
const isProduction = process.env.NODE_ENV === 'production';

console.log('🔧 Database Configuration:');
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`   Using Private DB: ${usePrivateDb}`);

// Get the appropriate connection string
let connectionString;
if (isProduction) {
  if (usePrivateDb) {
    connectionString = process.env.PRIVATE_MAIN_DATABASE_URL;
    console.log('   Using PRIVATE_MAIN_DATABASE_URL');
  } else {
    connectionString = process.env.MAIN_DATABASE_URL;
    console.log('   Using MAIN_DATABASE_URL');
  }
} else {
  connectionString = process.env.DEV_MAIN_DATABASE_URL;
  console.log('   Using DEV_MAIN_DATABASE_URL');
}

if (!connectionString) {
  console.error('❌ No database connection string found!');
  console.error('   Please check your .env.production file');
  process.exit(1);
}

// Create pool with SSL for production
const pool = new Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  console.log('\n🚀 Starting dual credit system migration...\n');
  
  try {
    // Test connection first
    console.log('🔗 Testing database connection...');
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', testResult.rows[0].now);
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'implement-dual-credit-system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('\n📄 Migration SQL loaded successfully');
    console.log('   File:', migrationPath);
    
    // Run the migration
    console.log('\n⏳ Executing migration...');
    await pool.query(sql);
    
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
    
    // Check radiology organizations
    const radiologyOrgs = await pool.query(`
      SELECT id, name, basic_credit_balance, advanced_credit_balance 
      FROM organizations 
      WHERE organization_type = 'radiology_group'
      LIMIT 5
    `);
    
    if (radiologyOrgs.rows.length > 0) {
      console.log('\nRadiology organizations with new credit balances:');
      radiologyOrgs.rows.forEach(org => {
        console.log(`  ✓ ${org.name} (ID: ${org.id}): Basic=${org.basic_credit_balance}, Advanced=${org.advanced_credit_balance}`);
      });
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed!');
    console.error('Error:', error.message);
    
    if (error.code === '42701') {
      console.error('\n⚠️  It looks like the columns already exist. The migration may have already been run.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Could not connect to database. Please check your connection string.');
    }
    
    throw error;
  } finally {
    // Close the connection
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