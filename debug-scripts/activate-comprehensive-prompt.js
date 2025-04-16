/**
 * Script to activate the comprehensive prompt template
 */
require('dotenv').config();
const { Pool } = require('pg');
const { exec } = require('child_process');

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
    
    // Step 1: Check template ID 2
    console.log('\nStep 1: Checking template ID 2...');
    const templateResult = await client.query(`
      SELECT id, name, type, version, active
      FROM prompt_templates
      WHERE id = 2;
    `);
    
    if (templateResult.rows.length === 0) {
      console.error('Template ID 2 not found!');
      return;
    }
    
    const template = templateResult.rows[0];
    console.log('Template ID 2 details:');
    console.log(`ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}, Active: ${template.active}`);
    
    // Step 2: Set all templates to inactive
    console.log('\nStep 2: Setting all templates to inactive...');
    await client.query(`
      UPDATE prompt_templates
      SET active = FALSE,
          updated_at = NOW();
    `);
    console.log('All templates set to inactive');
    
    // Step 3: Update template ID 2 type to 'default' and set it to active
    console.log('\nStep 3: Updating template ID 2 type to "default" and setting it to active...');
    await client.query(`
      UPDATE prompt_templates
      SET type = 'default',
          active = TRUE,
          updated_at = NOW()
      WHERE id = 2;
    `);
    console.log('Template ID 2 updated to type "default" and set to active');
    
    // Step 4: Verify the active template
    console.log('\nStep 4: Verifying active template...');
    const activeResult = await client.query(`
      SELECT id, name, type, version, active
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (activeResult.rows.length === 0) {
      console.error('No active templates found!');
    } else {
      console.log('Active templates:');
      activeResult.rows.forEach(row => {
        console.log(`ID: ${row.id}, Name: ${row.name}, Type: ${row.type}, Version: ${row.version}, Active: ${row.active}`);
      });
    }
    
    console.log('\nTemplate update completed successfully.');
    
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