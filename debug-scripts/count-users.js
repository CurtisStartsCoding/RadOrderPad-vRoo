const { Client } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function countUsers() {
  // Use the development database URL from environment
  const connectionString = process.env.DEV_MAIN_DATABASE_URL || 'postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main?sslmode=no-verify';
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!\n');

    // Get total user count
    const totalResult = await client.query('SELECT COUNT(*) as total FROM users');
    console.log(`Total users in database: ${totalResult.rows[0].total}`);
    
    // Get count by role
    console.log('\nUsers by role:');
    const roleResult = await client.query(
      `SELECT role, COUNT(*) as count 
       FROM users 
       GROUP BY role 
       ORDER BY count DESC, role`
    );
    
    roleResult.rows.forEach(row => {
      console.log(`  ${row.role}: ${row.count}`);
    });
    
    // Get count by organization
    console.log('\nUsers by organization:');
    const orgResult = await client.query(
      `SELECT o.id, o.name, o.type, COUNT(u.id) as user_count
       FROM organizations o
       LEFT JOIN users u ON u.organization_id = o.id
       GROUP BY o.id, o.name, o.type
       ORDER BY o.id`
    );
    
    orgResult.rows.forEach(row => {
      console.log(`  Org ${row.id} - ${row.name} (${row.type}): ${row.user_count} users`);
    });
    
    // Show recently created users
    console.log('\nRecently created users (last 10):');
    const recentResult = await client.query(
      `SELECT id, email, first_name, last_name, role, organization_id, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT 10`
    );
    
    recentResult.rows.forEach(user => {
      const createdDate = new Date(user.created_at).toLocaleString();
      console.log(`  ${user.id}: ${user.first_name} ${user.last_name} (${user.email}) - ${user.role} in Org ${user.organization_id} - Created: ${createdDate}`);
    });

  } catch (err) {
    console.error('Error:', err.message);
    if (err.detail) {
      console.error('Details:', err.detail);
    }
  } finally {
    await client.end();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
countUsers();