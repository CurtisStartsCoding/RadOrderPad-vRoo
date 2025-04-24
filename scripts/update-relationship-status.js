/**
 * Script to update a relationship status for testing
 */
const { Pool } = require('pg');
require('dotenv').config({ path: './.env.production' });

// Use the connection string from .env.production which includes SSL configuration
const connectionString = process.env.PROD_MAIN_DATABASE_URL;

async function updateRelationshipStatus() {
  const client = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('Connecting to production database...');
    
    // Update relationship ID 1 to pending status
    const updateQuery = `
      UPDATE organization_relationships
      SET status = 'pending', approved_by_id = NULL, updated_at = NOW()
      WHERE id = 1
      RETURNING id, organization_id, related_organization_id, status
    `;
    
    const result = await client.query(updateQuery);
    
    if (result.rows.length > 0) {
      console.log('Relationship updated successfully:');
      console.log(`ID: ${result.rows[0].id}, Org: ${result.rows[0].organization_id}, Related Org: ${result.rows[0].related_organization_id}, Status: ${result.rows[0].status}`);
    } else {
      console.log('No relationship found with ID 1.');
    }
  } catch (error) {
    console.error('Error updating relationship status:', error);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

// Run the function
updateRelationshipStatus();