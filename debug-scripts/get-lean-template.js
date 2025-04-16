/**
 * Script to get the content of the lean template (ID 9)
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

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
    
    // Get the lean template (ID 9)
    console.log('\nGetting the lean template (ID 9)...');
    const result = await client.query(`
      SELECT id, name, type, version, active, word_limit, content_template
      FROM prompt_templates
      WHERE id = 9;
    `);
    
    if (result.rows.length === 0) {
      console.log('Lean template not found');
      return;
    }
    
    const template = result.rows[0];
    console.log(`Found lean template: ${template.name} (ID: ${template.id})`);
    console.log(`Type: ${template.type}, Version: ${template.version}, Active: ${template.active}`);
    console.log(`Word limit: ${template.word_limit}`);
    
    // Save the content to a file
    fs.writeFileSync('lean_template_content.txt', template.content_template);
    console.log('\nFull content of the lean template saved to lean_template_content.txt');
    
    // Print the first 500 characters of the content
    console.log('\nContent preview:');
    console.log(template.content_template.substring(0, 500) + '...');
    
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