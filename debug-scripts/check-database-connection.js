/**
 * Script to check database connection and list tables
 */
require('dotenv').config();
const { Pool } = require('pg');

// Get database connection details from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

console.log('Checking database connection...');
console.log(`Database: ${DB_NAME}`);
console.log(`Host: ${DB_HOST}:${DB_PORT}`);
console.log(`User: ${DB_USER}`);

async function checkConnection() {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('Successfully connected to the database!');
    
    // List all tables in the database
    console.log('\nListing all tables in the database:');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables:');
      tablesResult.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    }
    
    // Check if prompt_templates table exists and show its content
    const promptTemplatesExists = tablesResult.rows.some(row => row.table_name === 'prompt_templates');
    if (promptTemplatesExists) {
      console.log('\nChecking prompt_templates table:');
      const promptsResult = await client.query(`
        SELECT id, name, type, version, active, 
               LEFT(content_template, 100) || '...' AS content_preview,
               created_at, updated_at
        FROM prompt_templates
        ORDER BY id;
      `);
      
      if (promptsResult.rows.length === 0) {
        console.log('No records found in prompt_templates table.');
      } else {
        console.log(`Found ${promptsResult.rows.length} prompt templates:`);
        promptsResult.rows.forEach((row, index) => {
          console.log(`\n${index + 1}. ${row.name} (ID: ${row.id})`);
          console.log(`   Type: ${row.type}, Version: ${row.version}, Active: ${row.active}`);
          console.log(`   Created: ${row.created_at}, Updated: ${row.updated_at}`);
          console.log(`   Content preview: ${row.content_preview}`);
        });
      }
    }
    
    // Release the client back to the pool
    client.release();
  } catch (error) {
    console.error('Error connecting to the database:');
    console.error(error.message);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the function
checkConnection().catch(err => {
  console.error('Unhandled error:', err);
});