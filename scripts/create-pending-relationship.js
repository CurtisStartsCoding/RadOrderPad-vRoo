/**
 * Script to create a pending relationship between two organizations
 * One of which should be organization ID 2 (the organization in our admin token)
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

async function createPendingRelationship() {
  console.log('Creating a pending relationship...');
  
  try {
    // Connect to the database
    const client = await pool.connect();
    
    try {
      // First, check if organization ID 2 exists
      const orgResult = await client.query(`
        SELECT id, name, type FROM organizations WHERE id = 2
      `);
      
      if (orgResult.rows.length === 0) {
        console.error('Organization ID 2 not found in the database');
        return;
      }
      
      const org2 = orgResult.rows[0];
      console.log(`Found organization ID 2: ${org2.name} (${org2.type})`);
      
      // Find another organization to create a relationship with
      const otherOrgResult = await client.query(`
        SELECT id, name, type FROM organizations 
        WHERE id != 2 
        ORDER BY id 
        LIMIT 1
      `);
      
      if (otherOrgResult.rows.length === 0) {
        console.error('No other organizations found in the database');
        return;
      }
      
      const otherOrg = otherOrgResult.rows[0];
      console.log(`Found other organization: ${otherOrg.name} (ID: ${otherOrg.id}, ${otherOrg.type})`);
      
      // Determine which organization should be the initiator and which should be the target
      // Typically, referring organizations initiate relationships with radiology organizations
      let organizationId, relatedOrganizationId;
      
      if (org2.type === 'referring' && otherOrg.type === 'radiology') {
        organizationId = 2;
        relatedOrganizationId = otherOrg.id;
      } else if (org2.type === 'radiology' && otherOrg.type === 'referring') {
        organizationId = otherOrg.id;
        relatedOrganizationId = 2;
      } else {
        // If types are the same or unknown, just use ID 2 as the initiator
        organizationId = otherOrg.id;
        relatedOrganizationId = 2;
      }
      
      // Check if a relationship already exists between these organizations
      const existingRelationshipResult = await client.query(`
        SELECT id, status FROM organization_relationships
        WHERE (organization_id = $1 AND related_organization_id = $2)
        OR (organization_id = $2 AND related_organization_id = $1)
      `, [organizationId, relatedOrganizationId]);
      
      if (existingRelationshipResult.rows.length > 0) {
        const existingRelationship = existingRelationshipResult.rows[0];
        console.log(`A relationship already exists between these organizations (ID: ${existingRelationship.id}, Status: ${existingRelationship.status})`);
        
        // If the relationship exists but is not pending, update it to pending
        if (existingRelationship.status !== 'pending') {
          await client.query(`
            UPDATE organization_relationships
            SET status = 'pending', updated_at = NOW()
            WHERE id = $1
          `, [existingRelationship.id]);
          
          console.log(`Updated relationship ID ${existingRelationship.id} to 'pending' status`);
        }
        
        return existingRelationship.id;
      }
      
      // Create a new pending relationship
      const result = await client.query(`
        INSERT INTO organization_relationships
        (organization_id, related_organization_id, status, created_at, updated_at)
        VALUES ($1, $2, 'pending', NOW(), NOW())
        RETURNING id
      `, [organizationId, relatedOrganizationId]);
      
      const relationshipId = result.rows[0].id;
      console.log(`Created new pending relationship with ID ${relationshipId}`);
      console.log(`Organization ID ${organizationId} is requesting to connect with Organization ID ${relatedOrganizationId}`);
      
      return relationshipId;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error('Error creating pending relationship:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the function
createPendingRelationship().then(relationshipId => {
  if (relationshipId) {
    console.log(`\nTo test the approval endpoint, use relationship ID: ${relationshipId}`);
    console.log(`Update TEST_PENDING_RELATIONSHIP_ID in .env.test to ${relationshipId}`);
  }
}).catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});