/**
 * Simple script to insert test users and organizations into the production database
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Database connection to PRODUCTION with SSL disabled
const pool = new Pool({
  connectionString: 'postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main',
  ssl: {
    rejectUnauthorized: false // Disable SSL verification
  }
});

// Generate a random string for email prefix to avoid conflicts
const randomString = crypto.randomBytes(4).toString('hex');

// Test data with random email prefixes
const TEST_ORGS = [
  {
    name: `Test Referring Org ${randomString}`,
    type: 'referring',
    contact_email: `test.referring.${randomString}@example.com`,
    phone_number: '555-123-4567',
    address_line1: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip_code: '12345',
    status: 'active'
  },
  {
    name: `Test Radiology Org ${randomString}`,
    type: 'radiology',
    contact_email: `test.radiology.${randomString}@example.com`,
    phone_number: '555-987-6543',
    address_line1: '456 Test Ave',
    city: 'Test City',
    state: 'TS',
    zip_code: '12345',
    status: 'active'
  }
];

const TEST_USERS = [
  {
    email: `test.admin_referring.${randomString}@example.com`,
    password: 'password123',
    first_name: 'Test',
    last_name: 'Referring Admin',
    role: 'admin_referring'
  },
  {
    email: `test.admin_radiology.${randomString}@example.com`,
    password: 'password123',
    first_name: 'Test',
    last_name: 'Radiology Admin',
    role: 'admin_radiology'
  }
];

// Function to hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Function to insert test organizations
async function insertTestOrganizations() {
  const client = await pool.connect();
  const orgIds = [];
  
  try {
    await client.query('BEGIN');
    
    console.log('Inserting test organizations...');
    
    for (const org of TEST_ORGS) {
      const result = await client.query(
        `INSERT INTO organizations
         (name, type, contact_email, phone_number, address_line1, city, state, zip_code, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING id`,
        [org.name, org.type, org.contact_email, org.phone_number, org.address_line1, org.city, org.state, org.zip_code, org.status]
      );
      
      const orgId = result.rows[0].id;
      orgIds.push(orgId);
      console.log(`Inserted ${org.type} organization with ID: ${orgId}`);
    }
    
    await client.query('COMMIT');
    return orgIds;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting test organizations:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Function to insert test users
async function insertTestUsers(orgIds) {
  const client = await pool.connect();
  const userIds = [];
  
  try {
    await client.query('BEGIN');
    
    console.log('Inserting test users...');
    
    for (let i = 0; i < TEST_USERS.length; i++) {
      const user = TEST_USERS[i];
      const orgId = orgIds[i]; // Match user to organization
      
      // Hash password
      const hashedPassword = await hashPassword(user.password);
      
      const result = await client.query(
        `INSERT INTO users
         (email, password_hash, first_name, last_name, role, organization_id, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
         RETURNING id`,
        [user.email, hashedPassword, user.first_name, user.last_name, user.role, orgId]
      );
      
      const userId = result.rows[0].id;
      userIds.push(userId);
      console.log(`Inserted ${user.role} user with ID: ${userId}`);
      
      // Update user object with ID and orgId for later use
      user.id = userId;
      user.orgId = orgId;
    }
    
    await client.query('COMMIT');
    return userIds;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting test users:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Function to insert test relationships
async function insertTestRelationships(orgIds, userIds) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Inserting test relationships...');
    
    // Check if a relationship already exists between these organizations
    const checkResult = await client.query(
      `SELECT id, status FROM organization_relationships
       WHERE (organization_id = $1 AND related_organization_id = $2)
       OR (organization_id = $2 AND related_organization_id = $1)`,
      [orgIds[0], orgIds[1]]
    );
    
    let pendingRelationshipId, activeRelationshipId;
    
    if (checkResult.rows.length > 0) {
      // Relationship already exists, update it
      const existingRelationship = checkResult.rows[0];
      console.log(`Found existing relationship with ID: ${existingRelationship.id}, status: ${existingRelationship.status}`);
      
      // Update the relationship to active status
      await client.query(
        `UPDATE organization_relationships
         SET status = 'active',
             approved_by_id = $1,
             notes = 'Test active relationship (updated)',
             updated_at = NOW()
         WHERE id = $2`,
        [userIds[1], existingRelationship.id]
      );
      
      console.log(`Updated relationship ID: ${existingRelationship.id} to active status`);
      activeRelationshipId = existingRelationship.id;
    } else {
      // No relationship exists, create a new one
      const pendingResult = await client.query(
        `INSERT INTO organization_relationships
         (organization_id, related_organization_id, status, initiated_by_id, notes, created_at, updated_at)
         VALUES ($1, $2, 'pending', $3, 'Test pending relationship', NOW(), NOW())
         RETURNING id`,
        [orgIds[0], orgIds[1], userIds[0]]
      );
      
      pendingRelationshipId = pendingResult.rows[0].id;
      console.log(`Inserted pending relationship with ID: ${pendingRelationshipId}`);
      
      // We won't create an active relationship since we can only have one relationship between two organizations
      activeRelationshipId = pendingRelationshipId;
    }
    
    await client.query('COMMIT');
    
    return {
      pendingRelationshipId: pendingRelationshipId || activeRelationshipId,
      activeRelationshipId
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting test relationships:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Main function
async function main() {
  try {
    console.log('=== INSERTING TEST DATA INTO PRODUCTION DATABASE ===');
    
    // Insert test organizations
    const orgIds = await insertTestOrganizations();
    
    // Insert test users
    const userIds = await insertTestUsers(orgIds);
    
    // Insert test relationships
    const relationshipIds = await insertTestRelationships(orgIds, userIds);
    
    console.log('\n=== TEST DATA INSERTION COMPLETE ===');
    console.log('\nTest Organizations:');
    console.log(`- Referring Org ID: ${orgIds[0]}`);
    console.log(`- Radiology Org ID: ${orgIds[1]}`);
    
    console.log('\nTest Users:');
    console.log(`- Admin Referring: ${TEST_USERS[0].email} (ID: ${TEST_USERS[0].id})`);
    console.log(`- Admin Radiology: ${TEST_USERS[1].email} (ID: ${TEST_USERS[1].id})`);
    
    console.log('\nTest Relationships:');
    console.log(`- Pending Relationship ID: ${relationshipIds.pendingRelationshipId}`);
    console.log(`- Active Relationship ID: ${relationshipIds.activeRelationshipId}`);
    
    console.log('\nLogin Credentials:');
    console.log(`- Admin Referring: ${TEST_USERS[0].email} / password123`);
    console.log(`- Admin Radiology: ${TEST_USERS[1].email} / password123`);
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
main();