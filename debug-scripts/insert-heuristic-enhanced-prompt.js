/**
 * Script to insert the peer-to-self prompt as a new template
 * named "v2.1 Heuristic-Enhanced Validation v2.1"
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
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Read the peer-to-self prompt content
    const promptPath = path.join(__dirname, '..', 'Docs', 'prompt_examples', 'peer-to-self-prompt.txt');
    const promptContent = fs.readFileSync(promptPath, 'utf8');
    
    console.log(`Read prompt content from ${promptPath}`);
    console.log(`Content length: ${promptContent.length} characters`);
    
    // Insert the new prompt template
    console.log('\nInserting new heuristic-enhanced prompt template...');
    const result = await client.query(`
      INSERT INTO prompt_templates (
        name, 
        type, 
        version, 
        content_template, 
        active, 
        created_at, 
        updated_at,
        word_limit
      )
      VALUES (
        'v2.1 Heuristic-Enhanced Validation v2.1', 
        'default', 
        '2.1', 
        $1, 
        FALSE, 
        NOW(), 
        NOW(),
        33
      )
      RETURNING id;
    `, [promptContent]);
    
    const newTemplateId = result.rows[0].id;
    console.log(`New prompt template inserted with ID: ${newTemplateId}`);
    
    // Save the template to a file for reference
    const outputPath = path.join(__dirname, '..', `heuristic_enhanced_prompt_${newTemplateId}.txt`);
    fs.writeFileSync(outputPath, promptContent);
    console.log(`Saved prompt template to ${outputPath}`);
    
    console.log('\nTo activate this template, run:');
    console.log(`node debug-scripts/update-active-validation-prompt.js ${newTemplateId}`);
    
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