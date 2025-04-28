/**
 * Script to create missing users for admin_referring and super_admin roles
 */

const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'radorderpad',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

// Users to create
const usersToCreate = [
  {
    email: 'test.admin_referring@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'AdminReferring',
    role: 'admin_referring',
    organizationId: 1,
    isActive: true,
    emailVerified: true
  },
  {
    email: 'test.superadmin@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'SuperAdmin',
    role: 'super_admin',
    organizationId: 1,
    isActive: true,
    emailVerified: true
  }
];

// Connect to the database
const pool = new Pool(dbConfig);

// Hash password using bcrypt (same as in the application)
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Create users
async function createUsers() {
  console.log('=== CREATING MISSING USERS ===');
  console.log('============================\n');
  
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    for (const user of usersToCreate) {
      // Check if user already exists
      const checkResult = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [user.email]
      );
      
      if (checkResult.rows.length > 0) {
        console.log(`User ${user.email} already exists. Updating password...`);
        
        // Hash the password
        const hashedPassword = await hashPassword(user.password);
        
        // Update the user
        await client.query(
          `UPDATE users
           SET password_hash = $1,
               first_name = $2,
               last_name = $3,
               role = $4,
               organization_id = $5,
               is_active = $6,
               email_verified = $7,
               updated_at = NOW()
           WHERE email = $8`,
          [
            hashedPassword,
            user.firstName,
            user.lastName,
            user.role,
            user.organizationId,
            user.isActive,
            user.emailVerified,
            user.email
          ]
        );
        
        console.log(`✅ Updated user ${user.email} with role ${user.role}`);
      } else {
        console.log(`Creating new user ${user.email}...`);
        
        // Hash the password
        const hashedPassword = await hashPassword(user.password);
        
        // Insert the user
        await client.query(
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
            hashedPassword,
            user.firstName,
            user.lastName,
            user.role,
            user.organizationId,
            user.isActive,
            user.emailVerified
          ]
        );
        
        console.log(`✅ Created new user ${user.email} with role ${user.role}`);
      }
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    
    console.log('\n✅ All users created or updated successfully');
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error('❌ Error creating users:', error.message);
    console.error(error.stack);
  } finally {
    // Release the client
    client.release();
  }
}

// Run the script
createUsers()
  .then(() => {
    console.log('\n=== SCRIPT COMPLETE ===');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error running script:', error);
    process.exit(1);
  });