// Script to check organization connections in the database
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env.production' });

// Get the database URL from environment variables
const mainDbUrl = process.env.MAIN_DATABASE_URL;

// Create modified connection string with SSL verification disabled
const noVerifyMainDbUrl = mainDbUrl.replace('?sslmode=require', '?sslmode=no-verify');

console.log('=== Organization Connections Check Tool ===');
console.log('This tool will check organization connections in the database.');

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString: noVerifyMainDbUrl,
  ssl: {
    rejectUnauthorized: false // Disable SSL certificate verification
  }
});

// Function to check organization details
async function checkOrganization(orgId) {
  console.log(`\nChecking organization with ID ${orgId}...`);
  
  try {
    // Query the database for the organization
    const result = await pool.query('SELECT * FROM organizations WHERE id = $1', [orgId]);
    
    if (result.rows.length === 0) {
      console.log(`❌ Organization with ID ${orgId} not found in the database.`);
      return null;
    }
    
    const org = result.rows[0];
    console.log(`✅ Organization found:`);
    console.log(`  ID: ${org.id}`);
    console.log(`  Name: ${org.name}`);
    console.log(`  Type: ${org.type}`);
    
    return org;
  } catch (err) {
    console.error('❌ Error querying the database:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    return null;
  }
}

// Function to check organization connections
async function checkOrganizationConnections(orgId) {
  console.log(`\nChecking connections for organization with ID ${orgId}...`);
  
  try {
    // Check if the connections table exists
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'organization_connections'
      );
    `);
    
    if (!tableCheckResult.rows[0].exists) {
      console.log('❌ The organization_connections table does not exist.');
      
      // Check for alternative tables
      const altTableCheckResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE '%connection%';
      `);
      
      if (altTableCheckResult.rows.length > 0) {
        console.log('Found alternative connection tables:');
        altTableCheckResult.rows.forEach(row => {
          console.log(`  - ${row.table_name}`);
        });
        
        // Try to query the first alternative table
        if (altTableCheckResult.rows.length > 0) {
          const altTableName = altTableCheckResult.rows[0].table_name;
          console.log(`\nChecking connections in ${altTableName}...`);
          
          // Get the column names for the table
          const columnsResult = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = $1;
          `, [altTableName]);
          
          console.log('Columns in the table:');
          columnsResult.rows.forEach(row => {
            console.log(`  - ${row.column_name}`);
          });
          
          // Try to query the table
          const connectionsResult = await pool.query(`
            SELECT * FROM ${altTableName} 
            WHERE requesting_organization_id = $1 
            OR target_organization_id = $1
          `, [orgId]);
          
          if (connectionsResult.rows.length === 0) {
            console.log(`❌ No connections found for organization with ID ${orgId} in ${altTableName}.`);
          } else {
            console.log(`✅ Found ${connectionsResult.rows.length} connections:`);
            connectionsResult.rows.forEach(conn => {
              console.log(`  Connection ID: ${conn.id}`);
              console.log(`  Requesting Org ID: ${conn.requesting_organization_id}`);
              console.log(`  Target Org ID: ${conn.target_organization_id}`);
              console.log(`  Status: ${conn.status}`);
              console.log('  ---');
            });
          }
        }
      } else {
        console.log('No alternative connection tables found.');
      }
      
      return [];
    }
    
    // Query the database for connections
    const result = await pool.query(`
      SELECT * FROM organization_connections 
      WHERE requesting_organization_id = $1 
      OR target_organization_id = $1
    `, [orgId]);
    
    if (result.rows.length === 0) {
      console.log(`❌ No connections found for organization with ID ${orgId}.`);
      return [];
    }
    
    console.log(`✅ Found ${result.rows.length} connections:`);
    result.rows.forEach(conn => {
      console.log(`  Connection ID: ${conn.id}`);
      console.log(`  Requesting Org ID: ${conn.requesting_organization_id}`);
      console.log(`  Target Org ID: ${conn.target_organization_id}`);
      console.log(`  Status: ${conn.status}`);
      console.log('  ---');
    });
    
    return result.rows;
  } catch (err) {
    console.error('❌ Error querying the database:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    return [];
  }
}

// Function to check the orders table schema
async function checkOrdersTableSchema() {
  console.log('\nChecking orders table schema...');
  
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
    
    // Get the column names for the orders table
    const columnsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'orders';
    `);
    
    console.log('Columns in the orders table:');
    columnsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}`);
    });
    
    // Check if the referring_organization_name column exists
    const hasReferringOrgName = columnsResult.rows.some(row => 
      row.column_name === 'referring_organization_name'
    );
    
    if (hasReferringOrgName) {
      console.log('✅ The referring_organization_name column exists in the orders table.');
    } else {
      console.log('❌ The referring_organization_name column does NOT exist in the orders table.');
      console.log('This explains the error: "column \'referring_organization_name\' of relation \'orders\' does not exist"');
    }
  } catch (err) {
    console.error('❌ Error querying the database:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
  }
}

// Run the tests
async function runTests() {
  try {
    // Check the orders table schema
    await checkOrdersTableSchema();
    
    // Check organization with ID 1
    const org = await checkOrganization(1);
    
    if (org) {
      // Check connections for organization with ID 1
      await checkOrganizationConnections(1);
    }
    
    // Check if there are any radiology organizations
    console.log('\nChecking for radiology organizations...');
    const radiologyOrgsResult = await pool.query(`
      SELECT * FROM organizations WHERE type = 'radiology'
    `);
    
    if (radiologyOrgsResult.rows.length === 0) {
      console.log('❌ No radiology organizations found in the database.');
    } else {
      console.log(`✅ Found ${radiologyOrgsResult.rows.length} radiology organizations:`);
      radiologyOrgsResult.rows.forEach(org => {
        console.log(`  ID: ${org.id}, Name: ${org.name}`);
      });
      
      // Check connections for the first radiology organization
      if (radiologyOrgsResult.rows.length > 0) {
        const radiologyOrgId = radiologyOrgsResult.rows[0].id;
        await checkOrganizationConnections(radiologyOrgId);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the tests
runTests();