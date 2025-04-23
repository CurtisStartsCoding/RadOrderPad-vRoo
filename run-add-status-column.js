const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Local database configuration
const localDbConfig = {
  user: 'postgres',
  password: 'postgres123',
  host: 'localhost',
  port: 5433,
  database: 'radorder_main'
};

// Create connection pool
const localDbPool = new Pool(localDbConfig);

async function addStatusColumn() {
  try {
    console.log('Connecting to the local database...');
    const client = await localDbPool.connect();
    console.log('Connected successfully!');

    // Read the SQL script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'add-status-column.sql'), 'utf8');
    
    console.log('Executing SQL script to add status column...');
    await client.query(sqlScript);
    
    console.log('SQL script executed successfully!');
    
    // Verify that the status column exists
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'organizations'
      AND column_name = 'status';
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length > 0) {
      console.log('\nStatus column exists in the organizations table:');
      console.log('Column Name | Data Type | Nullable | Default Value');
      console.log('---------------------------');
      result.rows.forEach(column => {
        console.log(`${column.column_name} | ${column.data_type} | ${column.is_nullable} | ${column.column_default || 'NULL'}`);
      });
    } else {
      console.log('\nStatus column does not exist in the organizations table.');
    }
    
    client.release();
  } catch (error) {
    console.error('Error adding status column:', error);
  } finally {
    await localDbPool.end();
  }
}

// Run the function
addStatusColumn().catch(console.error);