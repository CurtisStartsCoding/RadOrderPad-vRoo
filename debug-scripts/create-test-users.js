// Script to create test users with different roles
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../.env.production' });

// Get the database URL from environment variables
const mainDbUrl = process.env.MAIN_DATABASE_URL;

// Create modified connection string with SSL verification disabled
const noVerifyMainDbUrl = mainDbUrl.replace('?sslmode=require', '?sslmode=no-verify');

console.log('=== Test Users Creation Tool ===');
console.log('This tool will create test users with different roles for testing purposes.');

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString: noVerifyMainDbUrl,
  ssl: {
    rejectUnauthorized: false // Disable SSL certificate verification
  }
});

// Test users to create
const testUsers = [
  {
    email: 'test.physician@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'Physician',
    role: 'physician',
    organizationId: 1
  },
  {
    email: 'test.admin_staff@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'AdminStaff',
    role: 'admin_staff',
    organizationId: 1
  },
  {
    email: 'test.admin_radiology@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'RadiologyAdmin',
    role: 'admin_radiology',
    organizationId: 2
  },
  {
    email: 'test.scheduler@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'Scheduler',
    role: 'scheduler',
    organizationId: 2
  },
  {
    email: 'test.radiologist@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'Radiologist',
    role: 'radiologist',
    organizationId: 2
  },
  {
    email: 'test.super_admin@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'SuperAdmin',
    role: 'super_admin',
    organizationId: 1
  }
];

// Function to create a test user
async function createTestUser(user) {
  console.log(`\nCreating test user with email '${user.email}' and role '${user.role}'...`);
  
  try {
    // Check if the user already exists
    const existingUserResult = await pool.query('SELECT * FROM users WHERE email = $1', [user.email]);
    
    if (existingUserResult.rows.length > 0) {
      console.log(`✅ User with email '${user.email}' already exists. Updating role to '${user.role}'...`);
      
      // Update the user's role
      await pool.query(
        'UPDATE users SET role = $1, first_name = $2, last_name = $3, organization_id = $4 WHERE email = $5',
        [user.role, user.firstName, user.lastName, user.organizationId, user.email]
      );
      
      console.log(`✅ User updated successfully.`);
      return true;
    }
    
    // Generate a bcrypt hash for the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltRounds);
    
    // Insert the new user
    await pool.query(
      `INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        role, 
        organization_id, 
        is_active, 
        email_verified, 
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        user.email,
        passwordHash,
        user.firstName,
        user.lastName,
        user.role,
        user.organizationId,
        true,
        true
      ]
    );
    
    console.log(`✅ User created successfully.`);
    return true;
  } catch (err) {
    console.error(`❌ Error creating user '${user.email}':`, err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    return false;
  }
}

// Run the creation
async function run() {
  try {
    // Check if organizations exist
    const orgResult = await pool.query('SELECT * FROM organizations');
    
    if (orgResult.rows.length === 0) {
      console.log('❌ No organizations found in the database. Please create organizations first.');
      return;
    }
    
    console.log('Organizations found:');
    orgResult.rows.forEach(org => {
      console.log(`  ID: ${org.id}, Name: ${org.name}, Type: ${org.type}`);
    });
    
    // Create test users
    for (const user of testUsers) {
      await createTestUser(user);
    }
    
    console.log('\n✅ All test users created or updated successfully.');
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the creation
run();