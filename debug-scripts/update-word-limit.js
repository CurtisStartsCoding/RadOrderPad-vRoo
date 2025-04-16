/**
 * Script to update the word_limit field in the prompt_templates table
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
    
    // Get the active prompt template
    console.log('\nGetting active prompt template...');
    const result = await client.query(`
      SELECT id, name, type, version, word_limit
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (result.rows.length === 0) {
      console.error('No active prompt template found!');
      return;
    }
    
    const template = result.rows[0];
    console.log(`Active template: ID ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}`);
    console.log(`Current word limit: ${template.word_limit}`);
    
    // Update the word_limit field
    console.log('\nUpdating word_limit field to 33...');
    await client.query(`
      UPDATE prompt_templates
      SET word_limit = 33,
          updated_at = NOW()
      WHERE id = $1;
    `, [template.id]);
    console.log('Word limit updated to 33');
    
    // Verify the update
    const verifyResult = await client.query(`
      SELECT id, name, word_limit
      FROM prompt_templates
      WHERE id = $1;
    `, [template.id]);
    
    if (verifyResult.rows.length > 0) {
      console.log(`Updated word limit: ${verifyResult.rows[0].word_limit}`);
    }
    
    console.log('\nWord limit updated successfully.');
    
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