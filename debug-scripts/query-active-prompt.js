/**
 * Script to query the active prompt template directly from the database
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
    
    // Query the active prompt template
    console.log('\nQuerying active prompt template...');
    const result = await client.query(`
      SELECT id, name, type, version, content_template, word_limit, created_at, updated_at
      FROM prompt_templates
      WHERE active = TRUE
      ORDER BY id DESC
      LIMIT 1;
    `);
    
    if (result.rows.length === 0) {
      console.error('No active prompt template found!');
      return;
    }
    
    const activeTemplate = result.rows[0];
    
    console.log('\nActive Prompt Template:');
    console.log(`ID: ${activeTemplate.id}`);
    console.log(`Name: ${activeTemplate.name}`);
    console.log(`Type: ${activeTemplate.type}`);
    console.log(`Version: ${activeTemplate.version}`);
    console.log(`Word Limit: ${activeTemplate.word_limit}`);
    console.log(`Created At: ${activeTemplate.created_at}`);
    console.log(`Updated At: ${activeTemplate.updated_at}`);
    
    console.log('\nContent Template:');
    console.log('='.repeat(80));
    console.log(activeTemplate.content_template);
    console.log('='.repeat(80));
    
    // Check if the content contains word limit
    const containsWordLimit = activeTemplate.content_template.includes('{{WORD_LIMIT}}');
    console.log(`\nContains {{WORD_LIMIT}} placeholder: ${containsWordLimit}`);
    
    if (containsWordLimit) {
      // Find the line containing the word limit
      const lines = activeTemplate.content_template.split('\n');
      const wordLimitLine = lines.find(line => line.includes('{{WORD_LIMIT}}'));
      if (wordLimitLine) {
        console.log(`Word limit line: "${wordLimitLine}"`);
      }
    }
    
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