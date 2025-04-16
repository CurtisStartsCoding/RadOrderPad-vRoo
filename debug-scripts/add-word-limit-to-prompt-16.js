/**
 * Script to add the word limit to prompt template 16
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
    
    // Get prompt template 16
    console.log('\nRetrieving prompt template 16...');
    const result = await client.query(`
      SELECT id, name, type, version, content_template
      FROM prompt_templates
      WHERE id = 16;
    `);
    
    if (result.rows.length === 0) {
      console.error('Prompt template 16 not found!');
      return;
    }
    
    const template = result.rows[0];
    console.log(`Found template 16: ${template.name}, Version: ${template.version}`);
    
    // Modify the content to add the word limit
    let content = template.content_template;
    
    // Replace the feedback line to include the {{WORD_LIMIT}} placeholder
    content = content.replace(
      "- feedback: Always return a concise, educational note (33 words target length). If the order is appropriate, highlight what was done well to support payer approval.",
      "- feedback: Always return a concise, educational note ({{WORD_LIMIT}} words target length). If the order is appropriate, highlight what was done well to support payer approval."
    );
    
    // Insert the new template
    console.log('\nInserting updated prompt template...');
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
        'v2.1 Fixed Heuristic-Enhanced Validation with Word Limit', 
        'default', 
        '2.1', 
        $1, 
        FALSE, 
        NOW(), 
        NOW(),
        33
      )
      RETURNING id;
    `, [content]);
    
    const newTemplateId = insertResult.rows[0].id;
    console.log(`Updated prompt template inserted with ID: ${newTemplateId}`);
    
    // Save the template to a file for reference
    const outputPath = path.join(__dirname, '..', `word_limit_prompt_${newTemplateId}.txt`);
    fs.writeFileSync(outputPath, content);
    console.log(`Saved updated prompt template to ${outputPath}`);
    
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