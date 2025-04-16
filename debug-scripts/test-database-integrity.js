/**
 * Script to test database integrity, focusing on the prompt_templates table
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
    
    // Test 1: Check if the prompt_templates table exists
    console.log('\nTest 1: Checking if the prompt_templates table exists...');
    const tableExistsResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'prompt_templates'
      );
    `);
    
    const tableExists = tableExistsResult.rows[0].exists;
    console.log(`prompt_templates table exists: ${tableExists}`);
    
    if (!tableExists) {
      console.error('The prompt_templates table does not exist!');
      return;
    }
    
    // Test 2: Check the structure of the prompt_templates table
    console.log('\nTest 2: Checking the structure of the prompt_templates table...');
    const tableStructureResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'prompt_templates'
      ORDER BY ordinal_position;
    `);
    
    console.log('Columns in the prompt_templates table:');
    tableStructureResult.rows.forEach(column => {
      console.log(`- ${column.column_name} (${column.data_type}${column.character_maximum_length ? `(${column.character_maximum_length})` : ''})`);
    });
    
    // Test 3: Check for any active templates
    console.log('\nTest 3: Checking for active templates...');
    const activeTemplatesResult = await client.query(`
      SELECT id, name, type, version, active
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (activeTemplatesResult.rows.length === 0) {
      console.error('No active templates found!');
    } else {
      console.log('Active templates:');
      activeTemplatesResult.rows.forEach(template => {
        console.log(`- ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}, Active: ${template.active}`);
      });
    }
    
    // Test 4: Check for any templates with NULL content
    console.log('\nTest 4: Checking for templates with NULL content...');
    const nullContentResult = await client.query(`
      SELECT id, name, type, version
      FROM prompt_templates
      WHERE content_template IS NULL;
    `);
    
    if (nullContentResult.rows.length === 0) {
      console.log('No templates with NULL content found.');
    } else {
      console.error('Templates with NULL content:');
      nullContentResult.rows.forEach(template => {
        console.error(`- ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}`);
      });
    }
    
    // Test 5: Check for any templates with empty content
    console.log('\nTest 5: Checking for templates with empty content...');
    const emptyContentResult = await client.query(`
      SELECT id, name, type, version
      FROM prompt_templates
      WHERE content_template = '';
    `);
    
    if (emptyContentResult.rows.length === 0) {
      console.log('No templates with empty content found.');
    } else {
      console.error('Templates with empty content:');
      emptyContentResult.rows.forEach(template => {
        console.error(`- ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}`);
      });
    }
    
    // Test 6: Check for any templates with invalid JSON in content
    console.log('\nTest 6: Checking for templates with potentially invalid content...');
    const allTemplatesResult = await client.query(`
      SELECT id, name, type, version, content_template
      FROM prompt_templates;
    `);
    
    console.log('Checking content of all templates...');
    allTemplatesResult.rows.forEach(template => {
      // Check if content contains unbalanced braces or brackets
      const content = template.content_template || '';
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      const openBrackets = (content.match(/\[/g) || []).length;
      const closeBrackets = (content.match(/\]/g) || []).length;
      
      if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
        console.error(`Template ID ${template.id} has unbalanced braces or brackets:`);
        console.error(`- Open braces: ${openBraces}, Close braces: ${closeBraces}`);
        console.error(`- Open brackets: ${openBrackets}, Close brackets: ${closeBrackets}`);
      }
      
      // Check if content contains any suspicious patterns
      if (content.includes('undefined') || content.includes('NaN') || content.includes('[object Object]')) {
        console.error(`Template ID ${template.id} contains suspicious patterns (undefined, NaN, or [object Object])`);
      }
    });
    
    // Test 7: Check the relationship between prompt_templates and other tables
    console.log('\nTest 7: Checking relationships with other tables...');
    
    // Check if there's a foreign key relationship with any other table
    const foreignKeyResult = await client.query(`
      SELECT
        tc.table_schema, 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND (tc.table_name = 'prompt_templates' OR ccu.table_name = 'prompt_templates');
    `);
    
    if (foreignKeyResult.rows.length === 0) {
      console.log('No foreign key relationships found for prompt_templates.');
    } else {
      console.log('Foreign key relationships for prompt_templates:');
      foreignKeyResult.rows.forEach(relation => {
        console.log(`- Table ${relation.table_name} column ${relation.column_name} references ${relation.foreign_table_name} column ${relation.foreign_column_name}`);
      });
    }
    
    // Test 8: Check if the validation system can access the active template
    console.log('\nTest 8: Testing if the validation system can access the active template...');
    
    // First, get the active template
    const activeTemplate = activeTemplatesResult.rows[0];
    if (!activeTemplate) {
      console.error('No active template to test with!');
    } else {
      // Try to simulate how the validation system would access the template
      const validationAccessResult = await client.query(`
        SELECT id, name, type, version, active, word_limit, content_template
        FROM prompt_templates
        WHERE active = TRUE
        LIMIT 1;
      `);
      
      if (validationAccessResult.rows.length === 0) {
        console.error('Validation system would not be able to find an active template!');
      } else {
        const template = validationAccessResult.rows[0];
        console.log('Validation system would access this template:');
        console.log(`- ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}, Active: ${template.active}, Word Limit: ${template.word_limit}`);
        console.log(`- Content length: ${template.content_template ? template.content_template.length : 0} characters`);
        
        // Check if the content contains the expected placeholders
        if (template.content_template) {
          const hasDatabaseContext = template.content_template.includes('{{DATABASE_CONTEXT}}');
          const hasDictationText = template.content_template.includes('{{DICTATION_TEXT}}');
          const hasWordLimit = template.content_template.includes('{{WORD_LIMIT}}');
          
          console.log('Template contains expected placeholders:');
          console.log(`- {{DATABASE_CONTEXT}}: ${hasDatabaseContext}`);
          console.log(`- {{DICTATION_TEXT}}: ${hasDictationText}`);
          console.log(`- {{WORD_LIMIT}}: ${hasWordLimit}`);
          
          if (!hasDatabaseContext || !hasDictationText) {
            console.error('Template is missing required placeholders!');
          }
        }
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