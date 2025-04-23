const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load production environment variables
dotenv.config({ path: '.env.production' });

// Production database configuration
const prodDbConfig = {
  user: process.env.PROD_DB_USER || 'postgres',
  password: process.env.PROD_DB_PASSWORD || 'Nt35w912#DietCoke86!',
  host: process.env.PROD_MAIN_DB_HOST || 'radorder-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com',
  port: parseInt(process.env.PROD_MAIN_DB_PORT || '5432'),
  database: process.env.PROD_MAIN_DB_NAME || 'radorder_main',
  ssl: {
    rejectUnauthorized: false
  }
};

// Create connection pool
const prodDbPool = new Pool(prodDbConfig);

async function addStatusColumnToProd() {
  try {
    console.log('Connecting to the production database...');
    const client = await prodDbPool.connect();
    console.log('Connected successfully to production database!');

    // Read the SQL script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'add-status-column.sql'), 'utf8');
    
    console.log('Executing SQL script to add status column to production database...');
    await client.query(sqlScript);
    
    console.log('SQL script executed successfully on production database!');
    
    // Verify that the status column exists
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'organizations'
      AND column_name = 'status';
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length > 0) {
      console.log('\nStatus column exists in the organizations table in production:');
      console.log('Column Name | Data Type | Nullable | Default Value');
      console.log('---------------------------');
      result.rows.forEach((column) => {
        console.log(`${column.column_name} | ${column.data_type} | ${column.is_nullable} | ${column.column_default || 'NULL'}`);
      });
    } else {
      console.log('\nStatus column does not exist in the organizations table in production.');
    }
    
    client.release();
  } catch (error) {
    console.error('Error adding status column to production database:', error);
  } finally {
    await prodDbPool.end();
  }
}

// Run the function
addStatusColumnToProd().catch(console.error);