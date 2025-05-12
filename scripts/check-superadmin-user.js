/**
 * Script to check the super_admin user in the database
 */
const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.production
const envPath = path.resolve(process.cwd(), '.env.production');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

// Get connection strings from .env.production
const mainDbUrl = process.env.DEV_MAIN_DATABASE_URL;

console.log('Using DEV connection string from .env.production:');
console.log(`DEV Main DB URL: ${mainDbUrl}`);

// Create connection pool using connection string
const mainPool = new Pool({ 
  connectionString: mainDbUrl,
  ssl: { rejectUnauthorized: false }
});

/**
 * Query the users table in the main database for super_admin users
 */
async function querySuperAdminUsers() {
  try {
    console.log(`\nQuerying users table in Main DB for super_admin users...`);
    
    const query = `
      SELECT id, email, first_name, last_name, role, is_active, last_login, created_at, updated_at
      FROM users
      WHERE role = 'super_admin'
    `;
    
    const result = await mainPool.query(query);
    
    if (result.rows.length === 0) {
      console.log(`No super_admin users found in Main DB`);
      return null;
    }
    
    return result.rows;
  } catch (error) {
    console.error(`Error querying Main DB users table:`, error);
    return null;
  }
}

/**
 * Query the users table in the main database for a specific user ID
 */
async function queryUserById(userId) {
  try {
    console.log(`\nQuerying users table in Main DB for user ID ${userId}...`);
    
    const query = `
      SELECT id, email, first_name, last_name, role, is_active, last_login, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    
    const result = await mainPool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      console.log(`No user found with ID ${userId} in Main DB`);
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error(`Error querying Main DB users table:`, error);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('=== CHECKING SUPER ADMIN USER ===');
    
    // Check if there's a JWT token in the superadmin-test-token.txt file
    const tokenPath = path.join(__dirname, '..', 'superadmin-test-token.txt');
    if (fs.existsSync(tokenPath)) {
      const token = fs.readFileSync(tokenPath, 'utf8').trim();
      console.log('\nFound superadmin token in file');
      
      // Decode the JWT token (without verification)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('\nDecoded token payload:');
        console.log(payload);
        
        if (payload.userId) {
          // Query the user by ID from the token
          const user = await queryUserById(payload.userId);
          
          if (user) {
            console.log('\nUser found in database:');
            console.log(`ID: ${user.id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Name: ${user.first_name} ${user.last_name}`);
            console.log(`Role: ${user.role}`);
            console.log(`Active: ${user.is_active}`);
            console.log(`Last Login: ${user.last_login}`);
            console.log(`Created At: ${user.created_at}`);
            console.log(`Updated At: ${user.updated_at}`);
            
            // Check if the user is a super_admin and is active
            if (user.role === 'super_admin' && user.is_active) {
              console.log('\nThe super_admin user is valid and active.');
            } else if (user.role !== 'super_admin') {
              console.log('\nThe user is not a super_admin. Role:', user.role);
            } else if (!user.is_active) {
              console.log('\nThe super_admin user is inactive.');
            }
          }
        }
      }
    }
    
    // Query all super_admin users
    const superAdminUsers = await querySuperAdminUsers();
    
    if (superAdminUsers && superAdminUsers.length > 0) {
      console.log('\nAll super_admin users in the database:');
      superAdminUsers.forEach(user => {
        console.log(`\nID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.first_name} ${user.last_name}`);
        console.log(`Active: ${user.is_active}`);
        console.log(`Last Login: ${user.last_login}`);
        console.log(`Created At: ${user.created_at}`);
        console.log(`Updated At: ${user.updated_at}`);
      });
      
      // Count active super_admin users
      const activeSuperAdmins = superAdminUsers.filter(user => user.is_active);
      console.log(`\nTotal super_admin users: ${superAdminUsers.length}`);
      console.log(`Active super_admin users: ${activeSuperAdmins.length}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close connection
    await mainPool.end();
    console.log('\n=== CHECK COMPLETE ===');
  }
}

// Run the main function
main().catch(console.error);