/**
 * Test connection to the database through SSH tunnel
 * This assumes you have already established the SSH tunnel with:
 * ssh -i "C:\Dropbox\Apps\ROP Roo Backend Finalization\temp\radorderpad-key-pair.pem" -L 15432:radorderpad-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432 ubuntu@3.129.73.23
 */

const { Pool } = require('pg');

// Connect to the forwarded port on localhost
const pool = new Pool({
  host: 'localhost',
  port: 15432,
  database: 'radorder_phi',
  user: 'postgres',
  password: 'password2',
  ssl: {
    rejectUnauthorized: false // Disable SSL verification
  }
});

async function testConnection() {
  let client;
  try {
    console.log('Connecting to PHI database through SSH tunnel...');
    client = await pool.connect();
    
    console.log('Connected successfully!');
    
    // Test query to check if we can access the orders table
    const result = await client.query(`
      SELECT 
        column_name,
        is_nullable,
        data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'orders'
        AND column_name = 'radiology_organization_id';
    `);
    
    if (result.rows.length === 0) {
      console.log('ERROR: radiology_organization_id column not found in orders table');
      return;
    }
    
    const column = result.rows[0];
    console.log('\nColumn Information:');
    console.log('- Column Name:', column.column_name);
    console.log('- Is Nullable:', column.is_nullable);
    console.log('- Data Type:', column.data_type);
    
    console.log('\nConnection test successful!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run the test
testConnection();