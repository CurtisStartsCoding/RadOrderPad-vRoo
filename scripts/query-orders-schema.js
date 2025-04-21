/**
 * Script to query the database schema for the orders table
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create database connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.PHI_DB || 'radorder_phi',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123'
});

// Query to get column information for the orders table
const query = `
  SELECT column_name, data_type, character_maximum_length
  FROM information_schema.columns
  WHERE table_name = 'orders'
  ORDER BY ordinal_position;
`;

// Execute the query
async function querySchema() {
  const client = await pool.connect();
  try {
    console.log('Connected to database. Querying orders table schema...');
    const result = await client.query(query);
    
    console.log(`Found ${result.rows.length} columns in the orders table:`);
    console.log('----------------------------------------------------');
    console.log('Column Name                 | Data Type      | Max Length');
    console.log('----------------------------------------------------');
    
    result.rows.forEach(row => {
      const columnName = row.column_name.padEnd(28);
      const dataType = row.data_type.padEnd(15);
      const maxLength = row.character_maximum_length || '';
      console.log(`${columnName}| ${dataType}| ${maxLength}`);
    });
    
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error(`Error querying database: ${err.message}`);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

querySchema();