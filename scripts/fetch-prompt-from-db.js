/**
 * Script to fetch the active prompt template directly from the database
 */

require('dotenv').config();
const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'radorder_main',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123'
};

console.log('Database connection details:');
console.log(`Host: ${dbConfig.host}`);
console.log(`Port: ${dbConfig.port}`);
console.log(`Database: ${dbConfig.database}`);
console.log(`User: ${dbConfig.user}`);
console.log(`Password: [HIDDEN]`);
console.log();

async function fetchActivePrompt() {
  const pool = new Pool(dbConfig);
  
  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to database');
    
    // Query to get the active prompt template
    const query = `
      SELECT id, name, type, version, content_template, active, created_at
      FROM prompt_templates
      WHERE type = 'default' AND active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    // Execute the query
    const result = await client.query(query);
    
    // Release the client
    client.release();
    
    if (result.rows.length === 0) {
      console.error('No active prompt template found');
      return null;
    }
    
    // Get the prompt template
    const promptTemplate = result.rows[0];
    
    console.log('Active Prompt Template:');
    console.log(`ID: ${promptTemplate.id}`);
    console.log(`Name: ${promptTemplate.name}`);
    console.log(`Type: ${promptTemplate.type}`);
    console.log(`Version: ${promptTemplate.version}`);
    console.log(`Active: ${promptTemplate.active}`);
    console.log(`Created: ${promptTemplate.created_at}`);
    console.log();
    console.log('Full Prompt Content:');
    console.log('='.repeat(80));
    console.log(promptTemplate.content_template);
    console.log('='.repeat(80));
    console.log();
    console.log(`Prompt length: ${promptTemplate.content_template.length} characters`);
    
    return promptTemplate;
  } catch (error) {
    console.error('Error fetching prompt template:', error);
    return null;
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the function
fetchActivePrompt()
  .then(() => {
    console.log('Done');
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });