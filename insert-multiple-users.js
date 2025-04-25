/**
 * Script to insert multiple users into the production database
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Database connection to PUBLIC RDS instance
const pool = new Pool({
  connectionString: 'postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main',
  ssl: {
    rejectUnauthorized: false // Disable SSL verification
  }
});

// Generate a random string for email prefix to avoid conflicts
const randomString = crypto.randomBytes(4).toString('hex');

// Test organizations data
const TEST_ORGS = [
  {
    name: `Referring Practice ${randomString}`,
    type: 'referring',
    contact_email: `referring.${randomString}@example.com`,
    phone_number: '555-123-4567',
    address_line1: '123 Medical St',
    city: 'Healthcare City',
    state: 'HC',
    zip_code: '12345',
    status: 'active'
  },
  {
    name: `Radiology Group ${randomString}`,
    type: 'radiology',
    contact_email: `radiology.${randomString}@example.com`,
    phone_number: '555-987-6543',
    address_line1: '456 Imaging Ave',
    city: 'Scan City',
    state: 'SC',
    zip_code: '54321',
    status: 'active'
  }
];

// Function to generate multiple test users
function generateTestUsers(count, orgType) {
  const users = [];
  const roles = {
    referring: ['admin_referring', 'physician', 'admin_staff'],
    radiology: ['admin_radiology', 'scheduler', 'radiologist']
  };
  
  const roleDistribution = orgType === 'referring' 
    ? [0.2, 0.5, 0.3] // 20% admin_referring, 50% physician, 30% admin_staff
    : [0.2, 0.5, 0.3]; // 20% admin_radiology, 50% scheduler, 30% radiologist
  
  for (let i = 0; i < count; i++) {
    // Determine role based on distribution
    let roleIndex = 0;
    const rand = Math.random();
    let cumulativeProbability = 0;
    
    for (let j = 0; j < roleDistribution.length; j++) {
      cumulativeProbability += roleDistribution[j];
      if (rand <= cumulativeProbability) {
        roleIndex = j;
        break;
      }
    }
    
    const role = roles[orgType][roleIndex];
    const roleShort = role.replace('admin_', '').replace('_', '');
    
    users.push({
      email: `${roleShort}.${i}.${randomString}@example.com`,
      password: 'password123',
      first_name: `${roleShort.charAt(0).toUpperCase() + roleShort.slice(1)}`,
      last_name: `User${i}`,
      role: role
    });
  }
  
  return users;
}

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
async function insertTestUsers(referringOrgId, radiologyOrgId, referringUsers, radiologyUsers) {
  const client = await pool.connect();
  const userIds = { referring: [], radiology: [] };
  
  try {
    await client.query('BEGIN');
    
    console.log('Inserting referring organization users...');
    
    for (const user of referringUsers) {
      // Hash password
      const hashedPassword = await hashPassword(user.password);
      
      const result = await client.query(
        `INSERT INTO users
         (email, password_hash, first_name, last_name, role, organization_id, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
         RETURNING id`,
        [user.email, hashedPassword, user.first_name, user.last_name, user.role, referringOrgId]
      );
      
      const userId = result.rows[0].id;
      userIds.referring.push(userId);
      console.log(`Inserted ${user.role} user with ID: ${userId} (${user.email})`);
    }
    
    console.log('Inserting radiology organization users...');
    
    for (const user of radiologyUsers) {
      // Hash password
      const hashedPassword = await hashPassword(user.password);
      
      const result = await client.query(
        `INSERT INTO users
         (email, password_hash, first_name, last_name, role, organization_id, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
         RETURNING id`,
        [user.email, hashedPassword, user.first_name, user.last_name, user.role, radiologyOrgId]
      );
      
      const userId = result.rows[0].id;
      userIds.radiology.push(userId);
      console.log(`Inserted ${user.role} user with ID: ${userId} (${user.email})`);
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

// Function to insert a super_admin user
async function insertSuperAdminUser(referringOrgId) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Inserting super_admin user...');
    
    // Create a super_admin user
    const superAdminEmail = `superadmin.${randomString}@example.com`;
    const hashedPassword = await hashPassword('password123');
    
    // Use the referring organization ID since super_admin needs an organization
    const result = await client.query(
      `INSERT INTO users
       (email, password_hash, first_name, last_name, role, organization_id, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
       RETURNING id`,
      [superAdminEmail, hashedPassword, 'Super', 'Admin', 'super_admin', referringOrgId]
    );
    
    const superAdminId = result.rows[0].id;
    console.log(`Inserted super_admin user with ID: ${superAdminId} (${superAdminEmail})`);
    
    await client.query('COMMIT');
    return { id: superAdminId, email: superAdminEmail };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting super_admin user:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Function to insert test relationship
async function insertTestRelationship(referringOrgId, radiologyOrgId, referringAdminId, radiologyAdminId) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Inserting test relationship...');
    
    // Check if a relationship already exists between these organizations
    const checkResult = await client.query(
      `SELECT id, status FROM organization_relationships
       WHERE (organization_id = $1 AND related_organization_id = $2)
       OR (organization_id = $2 AND related_organization_id = $1)`,
      [referringOrgId, radiologyOrgId]
    );
    
    let relationshipId;
    
    if (checkResult.rows.length > 0) {
      // Relationship already exists, update it
      const existingRelationship = checkResult.rows[0];
      console.log(`Found existing relationship with ID: ${existingRelationship.id}, status: ${existingRelationship.status}`);
      
      // Update the relationship to active status
      await client.query(
        `UPDATE organization_relationships
         SET status = 'active',
             approved_by_id = $1,
             notes = 'Active relationship between test organizations',
             updated_at = NOW()
         WHERE id = $2`,
        [radiologyAdminId, existingRelationship.id]
      );
      
      console.log(`Updated relationship ID: ${existingRelationship.id} to active status`);
      relationshipId = existingRelationship.id;
    } else {
      // No relationship exists, create a new one
      const result = await client.query(
        `INSERT INTO organization_relationships
         (organization_id, related_organization_id, status, initiated_by_id, approved_by_id, notes, created_at, updated_at)
         VALUES ($1, $2, 'active', $3, $4, 'Active relationship between test organizations', NOW(), NOW())
         RETURNING id`,
        [referringOrgId, radiologyOrgId, referringAdminId, radiologyAdminId]
      );
      
      relationshipId = result.rows[0].id;
      console.log(`Inserted active relationship with ID: ${relationshipId}`);
    }
    
    await client.query('COMMIT');
    return relationshipId;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting test relationship:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Main function
async function main() {
  try {
    console.log('=== INSERTING MULTIPLE USERS INTO PRODUCTION DATABASE ===');
    
    // Number of users to create for each organization
    const referringUserCount = 20;
    const radiologyUserCount = 15;
    
    // Generate test users
    const referringUsers = generateTestUsers(referringUserCount, 'referring');
    const radiologyUsers = generateTestUsers(radiologyUserCount, 'radiology');
    
    // Insert test organizations
    const orgIds = await insertTestOrganizations();
    const referringOrgId = orgIds[0];
    const radiologyOrgId = orgIds[1];
    
    // Insert test users
    const userIds = await insertTestUsers(referringOrgId, radiologyOrgId, referringUsers, radiologyUsers);
    
    // Get admin IDs for relationship
    const referringAdminId = userIds.referring[0]; // First user is an admin
    const radiologyAdminId = userIds.radiology[0]; // First user is an admin
    
    // Insert test relationship
    const relationshipId = await insertTestRelationship(referringOrgId, radiologyOrgId, referringAdminId, radiologyAdminId);
    
    // Insert super_admin user
    const superAdmin = await insertSuperAdminUser(referringOrgId);
    
    console.log('\n=== MULTIPLE USERS INSERTION COMPLETE ===');
    console.log('\nTest Organizations:');
    console.log(`- Referring Org ID: ${referringOrgId}`);
    console.log(`- Radiology Org ID: ${radiologyOrgId}`);
    
    console.log('\nTest Users:');
    console.log(`- Referring Users: ${referringUsers.length} users created`);
    console.log(`- Radiology Users: ${radiologyUsers.length} users created`);
    console.log(`- Super Admin User: ${superAdmin.email} / password123`);
    
    console.log('\nTest Relationship:');
    console.log(`- Active Relationship ID: ${relationshipId}`);
    
    console.log('\nSample Login Credentials:');
    console.log(`- Referring Admin: ${referringUsers[0].email} / password123`);
    console.log(`- Radiology Admin: ${radiologyUsers[0].email} / password123`);
    console.log(`- Super Admin: ${superAdmin.email} / password123`);
    
    console.log('\nAll users have the password: password123');
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
main();