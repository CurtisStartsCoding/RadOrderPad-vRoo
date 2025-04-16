/**
 * Script to update the active template and run tests
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
    
    // Step 1: Set all templates to inactive
    console.log('\nStep 1: Setting all templates to inactive...');
    await client.query(`
      UPDATE prompt_templates
      SET active = FALSE,
          updated_at = NOW()
      WHERE type = 'default';
    `);
    console.log('All templates set to inactive');
    
    // Step 2: Set the comprehensive template (ID 2) to active
    console.log('\nStep 2: Setting the comprehensive template (ID 2) to active...');
    await client.query(`
      UPDATE prompt_templates
      SET active = TRUE,
          updated_at = NOW()
      WHERE id = 2;
    `);
    console.log('Comprehensive template set to active');
    
    // Step 3: Verify the active template
    console.log('\nStep 3: Verifying active template...');
    const result = await client.query(`
      SELECT id, name, type, version, active
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (result.rows.length === 0) {
      console.error('No active templates found!');
    } else {
      console.log('Active templates:');
      result.rows.forEach(row => {
        console.log(`ID: ${row.id}, Name: ${row.name}, Type: ${row.type}, Version: ${row.version}, Active: ${row.active}`);
      });
    }
    
    console.log('\nTemplate update completed successfully.');
    console.log('\nNow running the comprehensive workflow tests...');
    
    // Run the comprehensive workflow tests
    exec('run-comprehensive-workflow-tests.bat', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running tests: ${error.message}`);
        return;
      }
      
      console.log('Test output:');
      console.log(stdout);
      
      if (stderr) {
        console.error('Test errors:');
        console.error(stderr);
      }
      
      console.log('Comprehensive workflow tests completed.');
    });
    
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