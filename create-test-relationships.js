/**
 * Script to create test relationships for testing connection endpoints
 * 
 * This script inserts test relationships with different statuses into the organization_relationships table.
 * It creates relationships between existing organizations with different statuses to test all connection endpoints.
 */

const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.MAIN_DATABASE_URL
});

// Test data - adjust organization IDs and user IDs based on your database
const TEST_RELATIONSHIPS = [
  {
    // Pending relationship - for testing approve endpoint
    organization_id: 1, // Referring organization (admin_referring's org)
    related_organization_id: 2, // Radiology organization (admin_radiology's org)
    status: 'pending',
    initiated_by_id: 1, // Admin of organization 1
    notes: 'Test pending relationship for approval'
  },
  {
    // Active relationship - for testing terminate endpoint
    organization_id: 1, // Referring organization (admin_referring's org)
    related_organization_id: 2, // Radiology organization (admin_radiology's org)
    status: 'active',
    initiated_by_id: 1, // Admin of organization 1
    approved_by_id: 2, // Admin of organization 2
    notes: 'Test active relationship for termination'
  },
  // We don't need these test relationships for now
];

// Function to insert test relationships
async function insertTestRelationships() {
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Inserting test relationships...');
    
    // First, let's check the existing relationships
    console.log('Checking existing relationships...');
    const checkQuery = `
      SELECT id, organization_id, related_organization_id, status
      FROM organization_relationships
      WHERE id IN (1, 2, 3)
    `;
    
    const checkResult = await client.query(checkQuery);
    
    if (checkResult.rowCount > 0) {
      console.log('Existing relationships:');
      checkResult.rows.forEach(row => {
        console.log(`ID: ${row.id}, Org: ${row.organization_id}, Related Org: ${row.related_organization_id}, Status: ${row.status}`);
      });
    } else {
      console.log('No existing relationships found with IDs 1, 2, 3.');
    }
    
    // Insert each test relationship
    for (const relationship of TEST_RELATIONSHIPS) {
      // Check if organizations exist
      const orgCheckQuery = `
        SELECT id FROM organizations 
        WHERE id IN ($1, $2)
      `;
      const orgCheckResult = await client.query(orgCheckQuery, [
        relationship.organization_id,
        relationship.related_organization_id
      ]);
      
      if (orgCheckResult.rowCount < 2) {
        console.log(`Organizations with IDs ${relationship.organization_id} and ${relationship.related_organization_id} don't exist. Skipping...`);
        continue;
      }
      
      // Check if users exist
      const userIds = [relationship.initiated_by_id];
      if (relationship.approved_by_id) {
        userIds.push(relationship.approved_by_id);
      }
      
      const userCheckQuery = `
        SELECT id FROM users 
        WHERE id IN (${userIds.map((_, i) => `$${i + 1}`).join(', ')})
      `;
      const userCheckResult = await client.query(userCheckQuery, userIds);
      
      if (userCheckResult.rowCount < userIds.length) {
        console.log(`Users with IDs ${userIds.join(', ')} don't exist. Skipping...`);
        continue;
      }
      
      // Check if relationship already exists
      const relationshipCheckQuery = `
        SELECT id FROM organization_relationships 
        WHERE (organization_id = $1 AND related_organization_id = $2)
        OR (organization_id = $2 AND related_organization_id = $1)
      `;
      const relationshipCheckResult = await client.query(relationshipCheckQuery, [
        relationship.organization_id,
        relationship.related_organization_id
      ]);
      
      if (relationshipCheckResult.rowCount > 0) {
        console.log(`Relationship between organizations ${relationship.organization_id} and ${relationship.related_organization_id} already exists. Updating...`);
        
        // Update existing relationship
        const updateQuery = `
          UPDATE organization_relationships
          SET status = $1, 
              initiated_by_id = $2, 
              approved_by_id = $3, 
              notes = $4,
              updated_at = NOW()
          WHERE (organization_id = $5 AND related_organization_id = $6)
          OR (organization_id = $6 AND related_organization_id = $5)
          RETURNING id
        `;
        
        const updateResult = await client.query(updateQuery, [
          relationship.status,
          relationship.initiated_by_id,
          relationship.approved_by_id || null,
          relationship.notes,
          relationship.organization_id,
          relationship.related_organization_id
        ]);
        
        console.log(`Updated relationship with ID ${updateResult.rows[0].id}`);
      } else {
        // Insert new relationship
        const insertQuery = `
          INSERT INTO organization_relationships (
            organization_id, 
            related_organization_id, 
            status, 
            initiated_by_id, 
            approved_by_id, 
            notes
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `;
        
        const insertResult = await client.query(insertQuery, [
          relationship.organization_id,
          relationship.related_organization_id,
          relationship.status,
          relationship.initiated_by_id,
          relationship.approved_by_id || null,
          relationship.notes
        ]);
        
        console.log(`Inserted relationship with ID ${insertResult.rows[0].id}`);
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    // Check the relationships after insertion
    console.log('\nChecking relationships after insertion...');
    const finalCheckQuery = `
      SELECT id, organization_id, related_organization_id, status
      FROM organization_relationships
      WHERE id IN (1, 2, 3)
    `;
    
    const finalCheckResult = await client.query(finalCheckQuery);
    
    if (finalCheckResult.rowCount > 0) {
      console.log('Final relationships:');
      finalCheckResult.rows.forEach(row => {
        console.log(`ID: ${row.id}, Org: ${row.organization_id}, Related Org: ${row.related_organization_id}, Status: ${row.status}`);
      });
    } else {
      console.log('No relationships found with IDs 1, 2, 3 after insertion.');
    }
    
    console.log('\nTest relationships inserted successfully!');
    
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error inserting test relationships:', error);
  } finally {
    // Release client
    client.release();
    // Close pool
    pool.end();
  }
}

// Run the function
insertTestRelationships();