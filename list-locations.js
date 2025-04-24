/**
 * Script to list locations for the organizations we just created
 */

const { Pool } = require('pg');

// Database connection to PUBLIC RDS instance
const pool = new Pool({
  connectionString: 'postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main',
  ssl: {
    rejectUnauthorized: false // Disable SSL verification
  }
});

// Main function
async function main() {
  try {
    console.log('=== LISTING LOCATIONS FOR ORGANIZATIONS ===');
    
    // Get the organizations we just created
    const orgsResult = await pool.query(
      `SELECT id, name, type FROM organizations 
       WHERE name LIKE '%97e67c9d%'
       ORDER BY id DESC
       LIMIT 10`
    );
    
    if (orgsResult.rows.length === 0) {
      console.log('No organizations found with the random string 97e67c9d');
      return;
    }
    
    console.log(`Found ${orgsResult.rows.length} organizations:`);
    for (const org of orgsResult.rows) {
      console.log(`- ${org.name} (ID: ${org.id}, Type: ${org.type})`);
      
      // Get locations for this organization
      const locationsResult = await pool.query(
        `SELECT id, name, address_line1, city, state, zip_code, is_active
         FROM locations
         WHERE organization_id = $1
         ORDER BY id`,
        [org.id]
      );
      
      if (locationsResult.rows.length === 0) {
        console.log('  No locations found for this organization');
        
        // Let's create a location for this organization
        console.log('  Creating a test location for this organization...');
        const insertResult = await pool.query(
          `INSERT INTO locations
           (organization_id, name, address_line1, city, state, zip_code, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
           RETURNING id, name`,
          [org.id, `${org.type === 'referring' ? 'Clinic' : 'Imaging Center'} Location`, 
           `${org.type === 'referring' ? '123 Medical St' : '456 Imaging Ave'}`,
           'Test City', 'TS', '12345']
        );
        
        console.log(`  Created location: ${insertResult.rows[0].name} (ID: ${insertResult.rows[0].id})`);
      } else {
        console.log(`  Found ${locationsResult.rows.length} locations:`);
        for (const location of locationsResult.rows) {
          console.log(`  - ${location.name} (ID: ${location.id}, Active: ${location.is_active})`);
        }
      }
    }
    
    // Get users for these organizations
    const usersResult = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.organization_id, o.name as org_name
       FROM users u
       JOIN organizations o ON u.organization_id = o.id
       WHERE o.name LIKE '%97e67c9d%'
       ORDER BY u.organization_id, u.role
       LIMIT 10`
    );
    
    console.log('\nSample users:');
    for (const user of usersResult.rows) {
      console.log(`- ${user.email} (ID: ${user.id}, Role: ${user.role}, Org: ${user.org_name})`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
main();