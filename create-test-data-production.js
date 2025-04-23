/**
 * Script to create test data for connection endpoints testing in PRODUCTION
 * 
 * This script creates:
 * 1. Two new organizations (referring and radiology)
 * 2. Admin users for each organization
 * 3. Relationships between the organizations
 * 
 * IMPORTANT: This script connects to the PRODUCTION database!
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: '.env.production' });

// Constants
const API_URL = 'https://api.radorderpad.com';
const TOKENS_DIR = path.join(__dirname, 'tokens');

// Ensure tokens directory exists
if (!fs.existsSync(TOKENS_DIR)) {
  fs.mkdirSync(TOKENS_DIR, { recursive: true });
}

// Database connection to PRODUCTION
const pool = new Pool({
  connectionString: process.env.MAIN_DATABASE_URL || 'postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main',
  ssl: {
    rejectUnauthorized: false // Disable SSL verification
  }
});

// Generate a random string for email prefix
const randomString = crypto.randomBytes(4).toString('hex');

// Test data with random email prefixes to avoid conflicts
const TEST_ORGS = [
  {
    name: `Test Referring Org ${randomString}`,
    type: 'referring',
    contact_email: `test.referring.${randomString}@example.com`,
    contact_phone: '555-123-4567',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip: '12345',
    status: 'active'
  },
  {
    name: `Test Radiology Org ${randomString}`,
    type: 'radiology',
    contact_email: `test.radiology.${randomString}@example.com`,
    contact_phone: '555-987-6543',
    address: '456 Test Ave',
    city: 'Test City',
    state: 'TS',
    zip: '12345',
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
         (name, type, contact_email, contact_phone, address, city, state, zip, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
         RETURNING id`,
        [org.name, org.type, org.contact_email, org.contact_phone, org.address, org.city, org.state, org.zip, org.status]
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
         (email, password, first_name, last_name, role, organization_id, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW(), NOW()) 
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
    
    // Create a pending relationship
    const pendingResult = await client.query(
      `INSERT INTO organization_relationships 
       (organization_id, related_organization_id, status, initiated_by_id, notes, created_at, updated_at) 
       VALUES ($1, $2, 'pending', $3, 'Test pending relationship', NOW(), NOW()) 
       RETURNING id`,
      [orgIds[0], orgIds[1], userIds[0]]
    );
    
    const pendingRelationshipId = pendingResult.rows[0].id;
    console.log(`Inserted pending relationship with ID: ${pendingRelationshipId}`);
    
    // Create an active relationship
    const activeResult = await client.query(
      `INSERT INTO organization_relationships 
       (organization_id, related_organization_id, status, initiated_by_id, approved_by_id, notes, created_at, updated_at) 
       VALUES ($1, $2, 'active', $3, $4, 'Test active relationship', NOW(), NOW()) 
       RETURNING id`,
      [orgIds[0], orgIds[1], userIds[0], userIds[1]]
    );
    
    const activeRelationshipId = activeResult.rows[0].id;
    console.log(`Inserted active relationship with ID: ${activeRelationshipId}`);
    
    await client.query('COMMIT');
    
    return {
      pendingRelationshipId,
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

// Function to get JWT token
async function getToken(email, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    return response.data.token;
  } catch (error) {
    console.error(`Error getting token for ${email}:`, error.response?.data || error.message);
    throw error;
  }
}

// Function to save token to file
function saveToken(role, token) {
  const tokenFile = path.join(TOKENS_DIR, `${role}-token.txt`);
  fs.writeFileSync(tokenFile, token);
  console.log(`Token saved to ${tokenFile}`);
}

// Function to test connection endpoints
async function testConnectionEndpoints(relationshipIds, tokens) {
  console.log('\n=== TESTING CONNECTION ENDPOINTS ===');
  console.log(`API URL: ${API_URL}`);
  console.log('===================================\n');
  
  // Test list connections
  console.log('--- Testing List Connections ---');
  try {
    const response = await axios.get(`${API_URL}/connections`, {
      headers: { Authorization: `Bearer ${tokens.adminReferring}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
  
  // Test list incoming requests
  console.log('\n--- Testing List Incoming Requests ---');
  try {
    const response = await axios.get(`${API_URL}/connections/requests`, {
      headers: { Authorization: `Bearer ${tokens.adminRadiology}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
  
  // Test approve connection
  console.log(`\n--- Testing Approve Connection (ID: ${relationshipIds.pendingRelationshipId}) ---`);
  try {
    const response = await axios.post(`${API_URL}/connections/${relationshipIds.pendingRelationshipId}/approve`, {}, {
      headers: { Authorization: `Bearer ${tokens.adminRadiology}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
  
  // Test terminate connection
  console.log(`\n--- Testing Terminate Connection (ID: ${relationshipIds.activeRelationshipId}) ---`);
  try {
    const response = await axios.delete(`${API_URL}/connections/${relationshipIds.activeRelationshipId}`, {
      headers: { Authorization: `Bearer ${tokens.adminRadiology}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
  
  console.log('\n=== CONNECTION ENDPOINT TESTING COMPLETE ===');
}

// Main function
async function main() {
  try {
    console.log('=== CREATING TEST DATA IN PRODUCTION ===');
    
    // Insert test organizations
    const orgIds = await insertTestOrganizations();
    
    // Insert test users
    const userIds = await insertTestUsers(orgIds);
    
    // Insert test relationships
    const relationshipIds = await insertTestRelationships(orgIds, userIds);
    
    // Get tokens for test users
    console.log('\nGetting tokens for test users...');
    const adminReferringToken = await getToken(TEST_USERS[0].email, 'password123');
    const adminRadiologyToken = await getToken(TEST_USERS[1].email, 'password123');
    
    // Save tokens to files
    saveToken('admin_referring', adminReferringToken);
    saveToken('admin_radiology', adminRadiologyToken);
    
    // Test connection endpoints
    await testConnectionEndpoints(relationshipIds, {
      adminReferring: adminReferringToken,
      adminRadiology: adminRadiologyToken
    });
    
    console.log('\n=== TEST DATA CREATION COMPLETE ===');
    console.log('\nTest Organizations:');
    console.log(`- Referring Org ID: ${orgIds[0]}`);
    console.log(`- Radiology Org ID: ${orgIds[1]}`);
    
    console.log('\nTest Users:');
    console.log(`- Admin Referring: ${TEST_USERS[0].email} (ID: ${TEST_USERS[0].id})`);
    console.log(`- Admin Radiology: ${TEST_USERS[1].email} (ID: ${TEST_USERS[1].id})`);
    
    console.log('\nTest Relationships:');
    console.log(`- Pending Relationship ID: ${relationshipIds.pendingRelationshipId}`);
    console.log(`- Active Relationship ID: ${relationshipIds.activeRelationshipId}`);
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
main();