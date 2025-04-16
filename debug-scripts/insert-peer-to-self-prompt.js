/**
 * Script to insert a new peer-to-self prompt template based on the current hybrid prompt
 * but without the word limit part
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
    
    // Step 1: Get the current active prompt template
    console.log('\nStep 1: Getting current active prompt template...');
    const result = await client.query(`
      SELECT id, name, type, version, content_template, word_limit
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
    console.log(`Found active template: ID: ${activeTemplate.id}, Name: ${activeTemplate.name}`);
    
    // Step 2: Create a new template without the word limit part
    console.log('\nStep 2: Creating new template without word limit...');
    
    // Remove the line with the word limit instruction
    let newContent = activeTemplate.content_template;
    newContent = newContent.replace('5. Limit your feedback to {{WORD_LIMIT}} words.\n', '');
    
    // Insert the new template
    const insertResult = await client.query(`
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
        'Peer-to-Self Validation Prompt', 
        'default', 
        '1.0', 
        $1, 
        FALSE, 
        NOW(), 
        NOW(),
        33
      )
      RETURNING id;
    `, [newContent]);
    
    const newTemplateId = insertResult.rows[0].id;
    console.log(`New prompt template inserted with ID: ${newTemplateId}`);
    
    // Step 3: Verify the new template
    console.log('\nStep 3: Verifying new template...');
    const verifyResult = await client.query(`
      SELECT id, name, type, version, active, word_limit
      FROM prompt_templates
      WHERE id = $1;
    `, [newTemplateId]);
    
    if (verifyResult.rows.length === 0) {
      console.error('Failed to verify new template!');
      return;
    }
    
    const newTemplate = verifyResult.rows[0];
    console.log('New template details:');
    console.log(`- ID: ${newTemplate.id}`);
    console.log(`- Name: ${newTemplate.name}`);
    console.log(`- Type: ${newTemplate.type}`);
    console.log(`- Version: ${newTemplate.version}`);
    console.log(`- Active: ${newTemplate.active}`);
    console.log(`- Word Limit: ${newTemplate.word_limit}`);
    
    console.log('\nTo activate this prompt template, run:');
    console.log(`node debug-scripts/activate-prompt-template.js ${newTemplateId}`);
    
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