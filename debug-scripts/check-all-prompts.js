/**
 * Script to check all prompt templates in the database
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
    
    // Get all prompt templates
    console.log('\nGetting all prompt templates...');
    const result = await client.query(`
      SELECT id, name, type, version, active, word_limit, 
             LEFT(content_template, 100) || '...' AS content_preview,
             LENGTH(content_template) AS content_length,
             created_at, updated_at
      FROM prompt_templates
      ORDER BY id;
    `);
    
    console.log(`Found ${result.rows.length} prompt templates:`);
    
    // Display all prompt templates
    result.rows.forEach((template, index) => {
      console.log(`\n${index + 1}. ${template.name} (ID: ${template.id})`);
      console.log(`   Type: ${template.type}, Version: ${template.version}, Active: ${template.active}`);
      console.log(`   Word limit: ${template.word_limit}`);
      console.log(`   Created: ${template.created_at}, Updated: ${template.updated_at}`);
      console.log(`   Content length: ${template.content_length} characters`);
      console.log(`   Content preview: ${template.content_preview}`);
    });
    
    // Find the lean template specifically
    console.log('\nLooking for the lean template...');
    const leanTemplate = result.rows.find(row => 
      row.name.toLowerCase().includes('lean') || 
      row.content_template.toLowerCase().includes('lean')
    );
    
    if (leanTemplate) {
      console.log('\nFound lean template:');
      console.log(`ID: ${leanTemplate.id}, Name: ${leanTemplate.name}`);
      console.log(`Type: ${leanTemplate.type}, Version: ${leanTemplate.version}, Active: ${leanTemplate.active}`);
      console.log(`Word limit: ${leanTemplate.word_limit}`);
      
      // Get the full content of the lean template
      const fullContentResult = await client.query(`
        SELECT content_template
        FROM prompt_templates
        WHERE id = $1;
      `, [leanTemplate.id]);
      
      if (fullContentResult.rows.length > 0) {
        const fullContent = fullContentResult.rows[0].content_template;
        
        // Save the full content to a file
        const fs = require('fs');
        fs.writeFileSync('lean_template_content.txt', fullContent);
        console.log('\nFull content of the lean template saved to lean_template_content.txt');
      }
    } else {
      console.log('\nNo lean template found.');
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