/**
 * Script to set a relationship to pending status for testing the approval endpoint
 */
const { Client } = require('pg');
require('dotenv').config();

// Load environment variables from .env.production file
require('dotenv').config({ path: './.env.production' });

// Use the connection string from .env.production which includes SSL configuration
const connectionString = process.env.PROD_MAIN_DATABASE_URL;

console.log('Connecting to production database using connection string...');

async function setRelationshipPending() {
  const client = new Client({
    connectionString: connectionString
  });
  let relationshipId = null;
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // First check if there are any existing relationships with organization 2 as the target
    const checkResult = await client.query(`
      SELECT id, organization_id, related_organization_id, status
      FROM organization_relationships
      WHERE related_organization_id = 2
      LIMIT 1
    `);
    
    if (checkResult.rows.length === 0) {
      console.log('No relationships found. Creating a new relationship...');
      
      // Get two organizations to create a relationship between
      const orgsResult = await client.query(`
        SELECT id FROM organizations LIMIT 2
      `);
      
      if (orgsResult.rows.length < 2) {
        throw new Error('Need at least 2 organizations in the database');
      }
      
      // Create a new relationship with organization 2 as the target organization
      // This ensures the ADMIN_RADIOLOGY_TOKEN can be used to approve it
      const insertResult = await client.query(`
        INSERT INTO organization_relationships
        (organization_id, related_organization_id, status, created_by_id)
        VALUES ($1, 2, 'pending', 1)
        RETURNING id
      `, [orgsResult.rows[0].id]);
      
      relationshipId = insertResult.rows[0].id;
      console.log(`Created new relationship with ID: ${relationshipId}`);
    } else {
      // Update an existing relationship to pending
      relationshipId = checkResult.rows[0].id;
      
      await client.query(`
        UPDATE organization_relationships 
        SET status = 'pending' 
        WHERE id = $1
      `, [relationshipId]);
      
      console.log(`Updated relationship ${relationshipId} to pending status`);
    }
    
    // Get the details of the relationship for testing
    const detailsResult = await client.query(`
      SELECT r.id, r.organization_id, r.related_organization_id, r.status,
             o1.name as initiating_org_name, o2.name as target_org_name
      FROM organization_relationships r
      JOIN organizations o1 ON r.organization_id = o1.id
      JOIN organizations o2 ON r.related_organization_id = o2.id
      WHERE r.id = $1
    `, [relationshipId]);
    
    console.log('\nRelationship details for testing:');
    console.log(detailsResult.rows[0]);
    console.log('\nTo test approval, use:');
    console.log(`Relationship ID: ${relationshipId}`);
    console.log(`Target Organization ID: ${detailsResult.rows[0].related_organization_id}`);
    
    // Update the test script with the relationship ID
    console.log('\nUpdate test-connection-approve.js with these values');
    
    return relationshipId;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

setRelationshipPending().catch(console.error);