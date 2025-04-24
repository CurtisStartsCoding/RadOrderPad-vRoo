/**
 * Script to directly query the organization_relationships table in the production database
 * Using hardcoded connection strings as a fallback if environment variables are not available
 */
const { Pool } = require('pg');
require('dotenv').config({ path: './.env.production' });

// Use the exact same connection string and configuration as create-pending-relationship.js
const dbConfig = {
  connectionString: 'postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main',
  ssl: { rejectUnauthorized: false }
};

async function queryRelationshipsData() {
  // Create a pool with the same configuration that works in create-pending-relationship.js
  const client = new Pool(dbConfig);
  
  try {
    console.log('Connecting directly to the production database...');
    console.log('Using connection string (masked):', dbConfig.connectionString.replace(/:[^:]*@/, ':****@'));
    
    // Query all relationships with detailed information
    console.log('\n=== ORGANIZATION RELATIONSHIPS ===');
    const relationshipsQuery = `
      SELECT 
        r.id, 
        r.organization_id, 
        r.related_organization_id, 
        r.status,
        r.created_at,
        r.updated_at,
        r.initiated_by_id,
        r.approved_by_id,
        o1.name as initiating_org_name,
        o2.name as target_org_name,
        u1.email as initiator_email,
        u2.email as approver_email
      FROM organization_relationships r
      JOIN organizations o1 ON r.organization_id = o1.id
      JOIN organizations o2 ON r.related_organization_id = o2.id
      LEFT JOIN users u1 ON r.initiated_by_id = u1.id
      LEFT JOIN users u2 ON r.approved_by_id = u2.id
      ORDER BY r.id
    `;
    
    const relationshipsResult = await client.query(relationshipsQuery);
    
    if (relationshipsResult.rows.length > 0) {
      console.log(`Found ${relationshipsResult.rows.length} relationships:`);
      relationshipsResult.rows.forEach(row => {
        console.log('--------------------------------------------------');
        console.log(`ID: ${row.id}`);
        console.log(`Initiating Org: ${row.organization_id} (${row.initiating_org_name})`);
        console.log(`Target Org: ${row.related_organization_id} (${row.target_org_name})`);
        console.log(`Status: ${row.status}`);
        console.log(`Initiated By: ${row.initiated_by_id} (${row.initiator_email || 'N/A'})`);
        console.log(`Approved By: ${row.approved_by_id ? `${row.approved_by_id} (${row.approver_email || 'N/A'})` : 'Not approved yet'}`);
        console.log(`Created: ${row.created_at}`);
        console.log(`Updated: ${row.updated_at}`);
      });
      console.log('--------------------------------------------------');
    } else {
      console.log('No relationships found in the database.');
    }
    
    // Query organizations to understand what we're working with
    console.log('\n=== ORGANIZATIONS ===');
    const orgsQuery = `
      SELECT id, name, type, contact_email
      FROM organizations
      ORDER BY id
    `;
    
    const orgsResult = await client.query(orgsQuery);
    
    if (orgsResult.rows.length > 0) {
      console.log(`Found ${orgsResult.rows.length} organizations:`);
      orgsResult.rows.forEach(row => {
        console.log('--------------------------------------------------');
        console.log(`ID: ${row.id}`);
        console.log(`Name: ${row.name}`);
        console.log(`Type: ${row.type}`);
        console.log(`Email: ${row.contact_email}`);
      });
      console.log('--------------------------------------------------');
    } else {
      console.log('No organizations found in the database.');
    }
    
    // Check the specific relationship ID used in the test
    console.log('\n=== CHECKING TEST RELATIONSHIP ID ===');
    const testRelationshipId = 1; // From .env.test TEST_PENDING_RELATIONSHIP_ID
    const testQuery = `
      SELECT 
        r.id, 
        r.organization_id, 
        r.related_organization_id, 
        r.status,
        o1.name as initiating_org_name,
        o2.name as target_org_name
      FROM organization_relationships r
      JOIN organizations o1 ON r.organization_id = o1.id
      JOIN organizations o2 ON r.related_organization_id = o2.id
      WHERE r.id = $1
    `;
    
    const testResult = await client.query(testQuery, [testRelationshipId]);
    
    if (testResult.rows.length > 0) {
      const row = testResult.rows[0];
      console.log(`Found test relationship ID ${testRelationshipId}:`);
      console.log(`Initiating Org: ${row.organization_id} (${row.initiating_org_name})`);
      console.log(`Target Org: ${row.related_organization_id} (${row.target_org_name})`);
      console.log(`Status: ${row.status}`);
      
      // Check if the test token's organization matches the target organization
      console.log('\nChecking if ADMIN_RADIOLOGY_TOKEN organization matches target organization:');
      console.log(`ADMIN_RADIOLOGY_TOKEN organization ID: 2 (from token)`);
      console.log(`Target organization ID: ${row.related_organization_id}`);
      if (row.related_organization_id === 2) {
        console.log('✅ Match: The token organization matches the target organization');
      } else {
        console.log('❌ Mismatch: The token organization does not match the target organization');
        console.log('This could be causing the 404 error in the approval endpoint');
      }
      
      // Check if the relationship is in pending status
      console.log('\nChecking if relationship is in pending status:');
      if (row.status === 'pending') {
        console.log('✅ Status is pending, can be approved');
      } else {
        console.log(`❌ Status is ${row.status}, cannot be approved (must be pending)`);
        console.log('This could be causing the 404 error in the approval endpoint');
      }
    } else {
      console.log(`Test relationship ID ${testRelationshipId} not found in the database.`);
      console.log('This is definitely causing the 404 error in the approval endpoint');
    }
    
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await client.end();
    console.log('\nDisconnected from database');
  }
}

// Run the function
queryRelationshipsData();