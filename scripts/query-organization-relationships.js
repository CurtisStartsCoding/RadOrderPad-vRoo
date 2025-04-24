/**
 * Script to query the organization_relationships table
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration - using production connection string
const dbConfig = {
  connectionString: 'postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main',
  ssl: { rejectUnauthorized: false }
};

// Create a new pool
const pool = new Pool(dbConfig);

async function queryOrganizationRelationships() {
  console.log('Querying organization_relationships table...');
  
  try {
    // Connect to the database
    const client = await pool.connect();
    
    try {
      // Query all relationships with a simpler query
      const result = await client.query(`
        SELECT
          r.id,
          r.organization_id,
          o1.name as organization_name,
          r.related_organization_id,
          o2.name as related_organization_name,
          r.status,
          r.created_at,
          r.updated_at
        FROM
          organization_relationships r
        JOIN
          organizations o1 ON r.organization_id = o1.id
        JOIN
          organizations o2 ON r.related_organization_id = o2.id
        ORDER BY
          r.id
      `);
      
      // Print the results
      console.log(`Found ${result.rows.length} relationships:`);
      console.log('='.repeat(100));
      
      result.rows.forEach(row => {
        console.log(`ID: ${row.id}`);
        console.log(`Organization: ${row.organization_name} (ID: ${row.organization_id})`);
        console.log(`Related Organization: ${row.related_organization_name} (ID: ${row.related_organization_id})`);
        console.log(`Status: ${row.status}`);
        console.log(`Created At: ${row.created_at}`);
        console.log(`Updated At: ${row.updated_at}`);
        console.log('-'.repeat(100));
      });
      
      // Count by status
      const statusCounts = {};
      result.rows.forEach(row => {
        statusCounts[row.status] = (statusCounts[row.status] || 0) + 1;
      });
      
      console.log('Status Summary:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`${status}: ${count}`);
      });
      
      // Find pending relationships
      const pendingRelationships = result.rows.filter(row => row.status === 'pending');
      
      console.log('\nPending Relationships:');
      if (pendingRelationships.length === 0) {
        console.log('No pending relationships found.');
      } else {
        pendingRelationships.forEach(row => {
          console.log(`ID: ${row.id}`);
          console.log(`Organization: ${row.organization_name} (ID: ${row.organization_id})`);
          console.log(`Related Organization: ${row.related_organization_name} (ID: ${row.related_organization_id})`);
          console.log('-'.repeat(50));
        });
      }
      
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the query
queryOrganizationRelationships().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});