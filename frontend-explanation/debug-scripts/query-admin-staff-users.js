const { Pool } = require('pg');

// Database configuration from test-db-data.js
const mainDbConfig = {
  user: 'postgres',
  password: 'SimplePassword123',
  host: 'radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com',
  port: 5432,
  database: 'radorder_main',
  ssl: {
    rejectUnauthorized: false
  }
};

// Create connection pool
const mainDbPool = new Pool(mainDbConfig);

// Query users with admin_staff role
async function queryAdminStaffUsers() {
  try {
    console.log('Querying users with admin_staff role...');
    
    // Query users table for admin_staff users
    const query = `
      SELECT id, email, first_name, last_name, role, organization_id, is_active
      FROM users
      WHERE role = 'admin_staff' AND is_active = true
      ORDER BY id
    `;
    
    const result = await mainDbPool.query(query);
    
    console.log(`Found ${result.rows.length} admin_staff users:`);
    
    if (result.rows.length > 0) {
      // Display user information
      result.rows.forEach(user => {
        console.log(`\nUser ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.first_name} ${user.last_name}`);
        console.log(`Role: ${user.role}`);
        console.log(`Organization ID: ${user.organization_id}`);
        console.log(`Active: ${user.is_active}`);
      });
      
      console.log('\nYou can use these credentials in your admin finalization test:');
      console.log(`Email: ${result.rows[0].email}`);
      console.log('Password: [Use the standard test password]');
    } else {
      console.log('No admin_staff users found.');
      
      // Query for other roles to see what's available
      console.log('\nQuerying available user roles...');
      const rolesQuery = `
        SELECT DISTINCT role, COUNT(*) as count
        FROM users
        WHERE is_active = true
        GROUP BY role
        ORDER BY count DESC
      `;
      
      const rolesResult = await mainDbPool.query(rolesQuery);
      
      console.log('Available roles:');
      rolesResult.rows.forEach(role => {
        console.log(`${role.role}: ${role.count} users`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Query failed:', error);
    return false;
  } finally {
    // Close connection
    await mainDbPool.end();
  }
}

// Run query
queryAdminStaffUsers().catch(console.error);