const { Pool } = require('pg');

// Database configuration for the main database
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

// Function to check the organizations table schema
async function checkOrganizationsSchema() {
  try {
    console.log('Connecting to the main database...');
    const client = await mainDbPool.connect();
    console.log('Connected successfully!');

    // Query to get the column information for the organizations table
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'organizations'
      ORDER BY ordinal_position;
    `;

    console.log('Querying organizations table schema...');
    const result = await client.query(query);
    
    console.log('\nOrganizations Table Schema:');
    console.log('---------------------------');
    console.log('Column Name | Data Type | Nullable | Default Value');
    console.log('---------------------------');
    
    // Check if the status column exists
    let statusColumnExists = false;
    
    result.rows.forEach(column => {
      console.log(`${column.column_name} | ${column.data_type} | ${column.is_nullable} | ${column.column_default || 'NULL'}`);
      
      if (column.column_name === 'status') {
        statusColumnExists = true;
      }
    });
    
    console.log('\nStatus Column Exists:', statusColumnExists ? 'YES' : 'NO');
    
    // If the status column exists, try to query some sample data
    if (statusColumnExists) {
      console.log('\nQuerying sample data from organizations table...');
      const sampleDataQuery = `
        SELECT id, name, type, status
        FROM organizations
        LIMIT 5;
      `;
      
      const sampleData = await client.query(sampleDataQuery);
      
      console.log('\nSample Data:');
      console.log('---------------------------');
      sampleData.rows.forEach(org => {
        console.log(`ID: ${org.id}, Name: ${org.name}, Type: ${org.type}, Status: ${org.status || 'NULL'}`);
      });
    }
    
    client.release();
  } catch (error) {
    console.error('Error checking organizations schema:', error);
  } finally {
    await mainDbPool.end();
  }
}

// Run the function
checkOrganizationsSchema().catch(console.error);