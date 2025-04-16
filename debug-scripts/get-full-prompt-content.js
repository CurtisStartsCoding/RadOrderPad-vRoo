/**
 * Script to get the full content of the active prompt template
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs').promises;

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
      SELECT id, name, type, version, content_template
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (result.rows.length === 0) {
      console.error('No active prompt template found!');
      return;
    }
    
    const template = result.rows[0];
    console.log(`Active template: ID ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}`);
    
    // Save the content to a file for easier viewing
    const filename = `full_prompt_template_${template.id}.txt`;
    await fs.writeFile(filename, template.content_template || 'No content found');
    console.log(`\nPrompt template content saved to ${filename}`);
    
    // Print the first 100 characters of the content
    const content = template.content_template || '';
    console.log(`\nContent preview (first 100 characters):`);
    console.log(content.substring(0, 100));
    
    // Print the content length
    console.log(`\nContent length: ${content.length} characters`);
    
    // Check if the content includes key phrases
    console.log('\nChecking content for key phrases:');
    console.log(`- Contains "JSON": ${content.includes('JSON') || content.includes('json')}`);
    console.log(`- Contains "isPrimary": ${content.includes('isPrimary')}`);
    console.log(`- Contains "validationStatus": ${content.includes('validationStatus')}`);
    console.log(`- Contains "suggestedICD10Codes": ${content.includes('suggestedICD10Codes')}`);
    
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