/**
 * Script to retrieve the full text of prompt templates 14 and 16 from the database
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
    
    // Get prompt template 14
    console.log('\nRetrieving prompt template 14...');
    const result14 = await client.query(`
      SELECT id, name, type, version, content_template
      FROM prompt_templates
      WHERE id = 14;
    `);
    
    if (result14.rows.length === 0) {
      console.error('Prompt template 14 not found!');
    } else {
      const template14 = result14.rows[0];
      console.log(`Found template 14: ${template14.name}, Version: ${template14.version}`);
      
      // Save the content to a file
      const outputPath14 = path.join(__dirname, '..', 'db_prompt_template_14.txt');
      fs.writeFileSync(outputPath14, template14.content_template);
      console.log(`Saved prompt template 14 to ${outputPath14}`);
      
      // Print the content
      console.log('\n=== PROMPT TEMPLATE 14 CONTENT ===');
      console.log(template14.content_template);
      console.log('=== END OF PROMPT TEMPLATE 14 CONTENT ===');
    }
    
    // Get prompt template 16
    console.log('\nRetrieving prompt template 16...');
    const result16 = await client.query(`
      SELECT id, name, type, version, content_template
      FROM prompt_templates
      WHERE id = 16;
    `);
    
    if (result16.rows.length === 0) {
      console.error('Prompt template 16 not found!');
    } else {
      const template16 = result16.rows[0];
      console.log(`Found template 16: ${template16.name}, Version: ${template16.version}`);
      
      // Save the content to a file
      const outputPath16 = path.join(__dirname, '..', 'db_prompt_template_16.txt');
      fs.writeFileSync(outputPath16, template16.content_template);
      console.log(`Saved prompt template 16 to ${outputPath16}`);
      
      // Print the content
      console.log('\n=== PROMPT TEMPLATE 16 CONTENT ===');
      console.log(template16.content_template);
      console.log('=== END OF PROMPT TEMPLATE 16 CONTENT ===');
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