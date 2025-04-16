/**
 * Script to show the exact content of the comprehensive prompt template from the database
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

async function run() {
  let client;
  
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Get the comprehensive template (ID 2)
    console.log('\nGetting comprehensive template content...');
    const result = await client.query(`
      SELECT id, name, content_template, active
      FROM prompt_templates
      WHERE id = 2;
    `);
    
    if (result.rows.length === 0) {
      console.error('Comprehensive template with ID 2 not found!');
      return;
    }
    
    const template = result.rows[0];
    console.log(`\nTemplate ID: ${template.id}`);
    console.log(`Template Name: ${template.name}`);
    console.log(`Active: ${template.active}`);
    console.log('\n=== TEMPLATE CONTENT ===\n');
    console.log(template.content_template);
    console.log('\n=== END OF TEMPLATE CONTENT ===\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    // Close the pool
    await pool.end();
  }
}

// Run the function
run().catch(err => {
  console.error('Unhandled error:', err);
});