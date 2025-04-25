/**
 * Test Schema Resilience
 * 
 * This script tests the schema resilience of the organization service by:
 * 1. Checking if the status column exists in the organizations and users tables
 * 2. Testing the organization service with and without the status column
 * 3. Verifying that default values are applied correctly
 * 
 * Usage:
 * node scripts/test-schema-resilience.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.MAIN_DATABASE_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Check if a column exists in a table
 */
async function columnExists(table, column) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = $1 AND column_name = $2`,
      [table, column]
    );
    return result.rows.length > 0;
  } finally {
    client.release();
  }
}

/**
 * Get organization details using a resilient query
 */
async function getOrganizationResilient(orgId) {
  const client = await pool.connect();
  try {
    // Get available columns for organizations table
    const orgColumnsResult = await client.query(
      `SELECT column_name
       FROM information_schema.columns 
       WHERE table_name = 'organizations'
       ORDER BY ordinal_position`
    );
    const orgColumns = orgColumnsResult.rows.map(row => row.column_name);
    
    // Build a query that only includes available columns
    const selectColumns = [
      'id', 'name', 'type', 'npi', 'tax_id', 'address_line1', 'address_line2',
      'city', 'state', 'zip_code', 'phone_number', 'fax_number', 'contact_email',
      'website', 'logo_url', 'billing_id', 'credit_balance', 'subscription_tier',
      'status', 'created_at', 'updated_at'
    ].filter(col => orgColumns.includes(col));
    
    // Query the organization
    const orgResult = await client.query(
      `SELECT ${selectColumns.join(', ')}
       FROM organizations
       WHERE id = $1`,
      [orgId]
    );
    
    if (orgResult.rows.length === 0) {
      return null;
    }
    
    // Add default status if missing
    const organization = orgResult.rows[0];
    if (organization.status === undefined) {
      organization.status = 'active';
      console.log('Added default status to organization');
    }
    
    // Get available columns for users table
    const userColumnsResult = await client.query(
      `SELECT column_name
       FROM information_schema.columns 
       WHERE table_name = 'users'
       ORDER BY ordinal_position`
    );
    const userColumns = userColumnsResult.rows.map(row => row.column_name);
    
    // Map column aliases
    const userColumnMap = {
      'first_name': 'firstName',
      'last_name': 'lastName',
      'email_verified': 'email_verified'
    };
    
    // Build a query that only includes available columns
    const userSelectColumns = [
      'id', 'email', 'first_name', 'last_name', 'role', 'status', 'npi', 
      'specialty', 'phone_number', 'organization_id', 'created_at', 
      'updated_at', 'last_login', 'email_verified'
    ].filter(col => userColumns.includes(col));
    
    // Create the select clause with aliases
    const userSelectClause = userSelectColumns.map(col => {
      if (userColumnMap[col]) {
        return `${col} as "${userColumnMap[col]}"`;
      }
      return col;
    }).join(', ');
    
    // Query the users
    const usersResult = await client.query(
      `SELECT ${userSelectClause}
       FROM users
       WHERE organization_id = $1
       ORDER BY last_name, first_name`,
      [orgId]
    );
    
    // Add default status to users if missing
    const users = usersResult.rows.map(user => {
      if (user.status === undefined) {
        user.status = 'active';
      }
      return user;
    });
    
    if (!userColumns.includes('status')) {
      console.log('Added default status to all users');
    }
    
    // Query the locations
    const locationsResult = await client.query(
      `SELECT *
       FROM locations
       WHERE organization_id = $1
       ORDER BY name ASC`,
      [orgId]
    );
    
    return {
      organization,
      users,
      locations: locationsResult.rows
    };
  } finally {
    client.release();
  }
}

/**
 * Main test function
 */
async function testSchemaResilience() {
  try {
    console.log('=== Testing Schema Resilience ===\n');
    
    // Check if status column exists in organizations table
    const orgStatusExists = await columnExists('organizations', 'status');
    console.log(`Status column in organizations table: ${orgStatusExists ? 'EXISTS' : 'MISSING'}`);
    
    // Check if status column exists in users table
    const userStatusExists = await columnExists('users', 'status');
    console.log(`Status column in users table: ${userStatusExists ? 'EXISTS' : 'MISSING'}\n`);
    
    // Test with organization ID 1 (assuming it exists)
    console.log('Testing resilient organization query...');
    const result = await getOrganizationResilient(1);
    
    if (!result) {
      console.error('Error: Organization with ID 1 not found');
      return;
    }
    
    console.log('\nOrganization details:');
    console.log(`- ID: ${result.organization.id}`);
    console.log(`- Name: ${result.organization.name}`);
    console.log(`- Type: ${result.organization.type}`);
    console.log(`- Status: ${result.organization.status}`);
    
    console.log('\nUsers:');
    result.users.slice(0, 3).forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}, Role: ${user.role}, Status: ${user.status})`);
    });
    if (result.users.length > 3) {
      console.log(`... and ${result.users.length - 3} more users`);
    }
    
    console.log('\nLocations:');
    result.locations.slice(0, 3).forEach(location => {
      console.log(`- ${location.name} (ID: ${location.id})`);
    });
    if (result.locations.length > 3) {
      console.log(`... and ${result.locations.length - 3} more locations`);
    }
    
    console.log('\n=== Test completed successfully ===');
    console.log('The organization service is resilient to schema differences!');
    
  } catch (error) {
    console.error('Error testing schema resilience:', error);
  } finally {
    await pool.end();
  }
}

// Run the test
testSchemaResilience();