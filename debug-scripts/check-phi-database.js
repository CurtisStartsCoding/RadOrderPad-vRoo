// Script to check the PHI database
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') });

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

console.log('=== PHI Database Check Tool ===');
console.log('This tool will check the PHI database for orders table and columns.');

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString: noVerifyPhiDbUrl,
  ssl: {
    rejectUnauthorized: false, // Disable SSL certificate verification
    sslmode: 'no-verify'
  }
});

// Function to check orders table schema
async function checkOrdersTableSchema() {
  console.log('\n=== Orders Table Schema ===');
  
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
    
    // Get the column names for the orders table
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'orders'
      ORDER BY ordinal_position;
    `);
    
    console.log(`Found ${columnsResult.rows.length} columns in the orders table:`);
    
    // Check if the referring_organization_name column exists
    const hasReferringOrgName = columnsResult.rows.some(row => 
      row.column_name === 'referring_organization_name'
    );
    
    if (hasReferringOrgName) {
      console.log('✅ The referring_organization_name column exists in the orders table.');
      
      // Find the column details
      const referringOrgNameColumn = columnsResult.rows.find(row => 
        row.column_name === 'referring_organization_name'
      );
      
      console.log(`  Data type: ${referringOrgNameColumn.data_type}`);
      console.log(`  Nullable: ${referringOrgNameColumn.is_nullable}`);
    } else {
      console.log('❌ The referring_organization_name column does NOT exist in the orders table.');
      console.log('This explains the error: "column \'referring_organization_name\' of relation \'orders\' does not exist"');
    }
    
    // List all columns
    console.log('\nAll columns in the orders table:');
    columnsResult.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`  - ${col.column_name} (${col.data_type}, ${nullable})`);
    });
    
    // Get row count for the table
    try {
      const countResult = await pool.query(`SELECT COUNT(*) FROM "orders"`);
      console.log(`\nTotal orders: ${countResult.rows[0].count}`);
    } catch (countErr) {
      console.log(`Error getting row count: ${countErr.message}`);
    }
  } catch (err) {
    console.error('❌ Error querying the database:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  }
}

// Run the function
async function run() {
  try {
    await checkOrdersTableSchema();
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the script
run();