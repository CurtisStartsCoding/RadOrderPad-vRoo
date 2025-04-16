/**
 * Script to activate the lean template (ID 9)
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
    
    // First, deactivate all prompt templates
    console.log('\nDeactivating all prompt templates...');
    await client.query(`
      UPDATE prompt_templates
      SET active = false;
    `);
    console.log('All prompt templates deactivated');
    
    // Then, activate the lean template (ID 9)
    console.log('\nActivating the lean template (ID 9)...');
    await client.query(`
      UPDATE prompt_templates
      SET active = true,
          word_limit = 33,
          updated_at = NOW()
      WHERE id = 9;
    `);
    console.log('Lean template activated with word_limit = 33');
    
    // Verify the update was successful
    console.log('\nVerifying the update...');
    const result = await client.query(`
      SELECT id, name, type, version, active, word_limit
      FROM prompt_templates
      WHERE id = 9;
    `);
    
    if (result.rows.length === 0) {
      console.log('Lean template not found');
      return;
    }
    
    const template = result.rows[0];
    console.log(`Template ID ${template.id} (${template.name}) is now ${template.active ? 'active' : 'inactive'}`);
    console.log(`Word limit: ${template.word_limit}`);
    
    // Check if any other templates are active
    const activeResult = await client.query(`
      SELECT id, name
      FROM prompt_templates
      WHERE active = true AND id != 9;
    `);
    
    if (activeResult.rows.length > 0) {
      console.log('\nWARNING: Other active templates found:');
      activeResult.rows.forEach(row => {
        console.log(`- Template ID ${row.id} (${row.name}) is also active`);
      });
    } else {
      console.log('\nNo other active templates found');
    }
    
    console.log('\nLean template activation completed successfully');
    
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