/**
 * Script to update the active validation prompt template
 * Usage: node update-active-validation-prompt.js <template_id>
 * Example: node update-active-validation-prompt.js 14
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
    // Get the template ID from command line arguments
    const templateId = process.argv[2];
    if (!templateId) {
      console.error('Please provide a template ID as a command line argument');
      console.error('Usage: node update-active-validation-prompt.js <template_id>');
      console.error('Example: node update-active-validation-prompt.js 14');
      return;
    }
    
    console.log(`Activating template ID: ${templateId}`);
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Step 1: Verify the template exists
    console.log(`\nStep 1: Verifying template ID ${templateId} exists...`);
    const checkResult = await client.query(`
      SELECT id, name, type, version
      FROM prompt_templates
      WHERE id = $1;
    `, [templateId]);
    
    if (checkResult.rows.length === 0) {
      console.error(`Template ID ${templateId} not found!`);
      return;
    }
    
    const template = checkResult.rows[0];
    console.log(`Found template: ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}`);
    
    // Step 2: Set all templates to inactive
    console.log('\nStep 2: Setting all templates to inactive...');
    await client.query(`
      UPDATE prompt_templates
      SET active = FALSE,
          updated_at = NOW()
      WHERE type = 'default';
    `);
    console.log('All templates set to inactive');
    
    // Step 3: Set the specified template to active
    console.log(`\nStep 3: Setting template ID ${templateId} to active...`);
    await client.query(`
      UPDATE prompt_templates
      SET active = TRUE,
          updated_at = NOW()
      WHERE id = $1;
    `, [templateId]);
    console.log(`Template ID ${templateId} set to active`);
    
    // Step 4: Verify the active template
    console.log('\nStep 4: Verifying active template...');
    const result = await client.query(`
      SELECT id, name, type, version, active, word_limit
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (result.rows.length === 0) {
      console.error('No active templates found!');
    } else {
      console.log('Active template:');
      const activeTemplate = result.rows[0];
      console.log(`ID: ${activeTemplate.id}, Name: ${activeTemplate.name}, Type: ${activeTemplate.type}, Version: ${activeTemplate.version}, Active: ${activeTemplate.active}, Word Limit: ${activeTemplate.word_limit}`);
    }
    
    console.log('\nTemplate update completed successfully.');
    console.log('\nTo run tests with this template, use:');
    console.log('node debug-scripts/test-complex-specialty-cases.js');
    console.log('node debug-scripts/test-additional-notes-requirement.js');
    
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