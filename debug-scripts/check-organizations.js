// Script to check organizations in the main database
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') });

// Get the database URL from environment variables
const mainDbUrl = process.env.PROD_MAIN_DATABASE_URL || process.env.MAIN_DATABASE_URL;

console.log('Environment variables loaded:');
console.log('- MAIN_DATABASE_URL:', process.env.MAIN_DATABASE_URL ? 'Set' : 'Not set');
console.log('- PROD_MAIN_DATABASE_URL:', process.env.PROD_MAIN_DATABASE_URL ? 'Set' : 'Not set');

// Create modified connection string with SSL verification disabled
const noVerifyMainDbUrl = mainDbUrl ? mainDbUrl.replace('?sslmode=require', '?sslmode=no-verify') : null;

console.log(`Connection string: ${noVerifyMainDbUrl ? noVerifyMainDbUrl.substring(0, 20) + '...' : 'null'}`);

console.log('=== Organizations Check Tool ===');
console.log('This tool will check organizations in the main database.');

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString: noVerifyMainDbUrl,
  ssl: {
    rejectUnauthorized: false, // Disable SSL certificate verification
    sslmode: 'no-verify'
  }
});

// Function to list all organizations
async function listAllOrganizations() {
  console.log('\n=== All Organizations ===');
  
  try {
    // Query to get all organizations
    const orgsResult = await pool.query(`
      SELECT * FROM organizations ORDER BY id;
    `);
    
    if (orgsResult.rows.length === 0) {
      console.log('❌ No organizations found in the database.');
      return;
    }
    
    console.log(`✅ Found ${orgsResult.rows.length} organizations:`);
    orgsResult.rows.forEach((org, index) => {
      console.log(`\nOrganization #${index + 1}:`);
      console.log(`  ID: ${org.id}`);
      console.log(`  Name: ${org.name}`);
      console.log(`  Type: ${org.type}`);
      console.log(`  Status: ${org.status}`);
      console.log(`  Credit Balance: ${org.credit_balance}`);
      
      // Print other fields if they exist
      if (org.npi) console.log(`  NPI: ${org.npi}`);
      if (org.tax_id) console.log(`  Tax ID: ${org.tax_id}`);
      if (org.address_line1) console.log(`  Address: ${org.address_line1}`);
      if (org.city) console.log(`  City: ${org.city}`);
      if (org.state) console.log(`  State: ${org.state}`);
      if (org.zip_code) console.log(`  ZIP: ${org.zip_code}`);
      if (org.phone_number) console.log(`  Phone: ${org.phone_number}`);
      if (org.fax_number) console.log(`  Fax: ${org.fax_number}`);
      if (org.contact_email) console.log(`  Email: ${org.contact_email}`);
      if (org.website) console.log(`  Website: ${org.website}`);
      if (org.created_at) console.log(`  Created: ${new Date(org.created_at).toISOString()}`);
    });
  } catch (err) {
    console.error('❌ Error querying organizations:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  }
}

// Function to check organization relationships
async function checkOrganizationRelationships() {
  console.log('\n=== Organization Relationships ===');
  
  try {
    // Check if the organization_relationships table exists
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'organization_relationships'
      );
    `);
    
    if (!tableCheckResult.rows[0].exists) {
      console.log('❌ The organization_relationships table does not exist.');
      return;
    }
    
    // Get the column names for the organization_relationships table
    const columnsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'organization_relationships';
    `);
    
    console.log('Columns in the organization_relationships table:');
    columnsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}`);
    });
    
    // Query to get all organization relationships
    const relsResult = await pool.query(`
      SELECT * FROM organization_relationships ORDER BY id;
    `);
    
    if (relsResult.rows.length === 0) {
      console.log('❌ No organization relationships found in the database.');
      return;
    }
    
    console.log(`✅ Found ${relsResult.rows.length} organization relationships:`);
    relsResult.rows.forEach((rel, index) => {
      console.log(`\nRelationship #${index + 1}:`);
      console.log(`  ID: ${rel.id}`);
      console.log(`  Requesting Organization ID: ${rel.requesting_organization_id}`);
      console.log(`  Target Organization ID: ${rel.target_organization_id}`);
      console.log(`  Status: ${rel.status}`);
      
      // Print other fields if they exist
      if (rel.notes) console.log(`  Notes: ${rel.notes}`);
      if (rel.created_at) console.log(`  Created: ${new Date(rel.created_at).toISOString()}`);
      if (rel.updated_at) console.log(`  Updated: ${new Date(rel.updated_at).toISOString()}`);
    });
  } catch (err) {
    console.error('❌ Error querying organization relationships:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  }
}

// Function to check users
async function checkUsers() {
  console.log('\n=== Users ===');
  
  try {
    // Query to get all users
    const usersResult = await pool.query(`
      SELECT * FROM users ORDER BY id;
    `);
    
    if (usersResult.rows.length === 0) {
      console.log('❌ No users found in the database.');
      return;
    }
    
    console.log(`✅ Found ${usersResult.rows.length} users:`);
    usersResult.rows.forEach((user, index) => {
      console.log(`\nUser #${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.first_name} ${user.last_name}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Organization ID: ${user.organization_id}`);
      
      // Print other fields if they exist
      if (user.npi) console.log(`  NPI: ${user.npi}`);
      if (user.created_at) console.log(`  Created: ${new Date(user.created_at).toISOString()}`);
    });
  } catch (err) {
    console.error('❌ Error querying users:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  }
}

// Run the functions
async function run() {
  try {
    // List all organizations
    await listAllOrganizations();
    
    // Check organization relationships
    await checkOrganizationRelationships();
    
    // Check users
    await checkUsers();
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the script
run();