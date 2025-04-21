/**
 * Script to verify that the referring_organization_name column was added to the orders table
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.production') });

// Get the database URL from environment variables
const phiDbUrl = process.env.PROD_PHI_DATABASE_URL || process.env.PHI_DATABASE_URL;

console.log('Environment variables loaded:');
console.log('- PHI_DATABASE_URL:', process.env.PHI_DATABASE_URL ? 'Set' : 'Not set');
console.log('- PROD_PHI_DATABASE_URL:', process.env.PROD_PHI_DATABASE_URL ? 'Set' : 'Not set');

// Show which database URL we're using
console.log('Using database URL from:', process.env.PROD_PHI_DATABASE_URL ? 'PROD_PHI_DATABASE_URL' : 'PHI_DATABASE_URL');

// Create modified connection string with SSL verification disabled
const noVerifyPhiDbUrl = phiDbUrl ? phiDbUrl.replace('?sslmode=require', '?sslmode=no-verify') : null;

// Show more details about the connection string (masking password)
const maskedUrl = noVerifyPhiDbUrl ? noVerifyPhiDbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'null';
console.log(`Connection string: ${maskedUrl}`);

console.log('=== Migration Verification Tool ===');
console.log('This tool will check if the referring_organization_name column was added to the orders table.');

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString: noVerifyPhiDbUrl,
  ssl: {
    rejectUnauthorized: false, // Disable SSL certificate verification
    sslmode: 'no-verify'
  }
});

// Function to check if the column exists
async function checkColumnExists() {
  console.log('\n=== Checking Orders Table Schema ===');
  
  try {
    // Check if the orders table exists
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'orders'
      );
    `);
    
    if (!tableCheckResult.rows[0].exists) {
      console.log('❌ The orders table does not exist.');
      return;
    }
    
    console.log('✅ The orders table exists.');
    
    // Check if the referring_organization_name column exists
    const columnCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'referring_organization_name'
      );
    `);
    
    if (columnCheckResult.rows[0].exists) {
      console.log('✅ The referring_organization_name column exists in the orders table.');
      
      // Get column details
      const columnDetailsResult = await pool.query(`
        SELECT data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'referring_organization_name';
      `);
      
      const columnDetails = columnDetailsResult.rows[0];
      console.log(`  Data type: ${columnDetails.data_type}`);
      console.log(`  Nullable: ${columnDetails.is_nullable}`);
      
      console.log('\n✅ Migration was successful!');
    } else {
      console.log('❌ The referring_organization_name column does NOT exist in the orders table.');
      console.log('\n❌ Migration failed or has not been run yet.');
    }
  } catch (err) {
    console.error('❌ Error querying the database:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  } finally {
    await pool.end();
  }
}

// Run the function
checkColumnExists();