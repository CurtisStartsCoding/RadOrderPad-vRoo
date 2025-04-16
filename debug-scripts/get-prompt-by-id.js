/**
 * Script to get a prompt template by ID
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
      console.error('Usage: node get-prompt-by-id.js <template_id>');
      return;
    }
    
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Get the prompt template by ID
    console.log(`\nGetting prompt template with ID ${templateId}...`);
    const result = await client.query(`
      SELECT id, name, type, version, content_template, active, word_limit
      FROM prompt_templates
      WHERE id = $1;
    `, [templateId]);
    
    if (result.rows.length === 0) {
      console.error(`No prompt template found with ID ${templateId}`);
      return;
    }
    
    const template = result.rows[0];
    console.log(`Template: ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}, Active: ${template.active}, Word Limit: ${template.word_limit}`);
    
    // Save the content to a file
    const filePath = path.join(__dirname, '..', `prompt_template_${template.id}.txt`);
    fs.writeFileSync(filePath, template.content_template);
    console.log(`\nPrompt template content saved to ${filePath}`);
    
    // Print a preview of the content
    console.log(`\nContent preview (first 100 characters):`);
    console.log(template.content_template.substring(0, 100) + '...');
    
    console.log(`\nContent length: ${template.content_template.length} characters`);
    
    // Check for key phrases
    console.log('\nChecking content for key phrases:');
    console.log(`- Contains "JSON": ${template.content_template.includes('JSON')}`);
    console.log(`- Contains "isPrimary": ${template.content_template.includes('isPrimary')}`);
    console.log(`- Contains "validationStatus": ${template.content_template.includes('validationStatus')}`);
    console.log(`- Contains "suggestedICD10Codes": ${template.content_template.includes('suggestedICD10Codes')}`);
    console.log(`- Contains "{{WORD_LIMIT}}": ${template.content_template.includes('{{WORD_LIMIT}}')}`);
    
    // Print the full content
    console.log('\nFull content:');
    console.log('='.repeat(80));
    console.log(template.content_template);
    console.log('='.repeat(80));
    
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