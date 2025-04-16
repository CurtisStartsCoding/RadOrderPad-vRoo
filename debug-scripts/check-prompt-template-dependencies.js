/**
 * Script to check for foreign key dependencies on the prompt_templates table
 * and suggest a strategy for cleaning up the database
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
    
    // Step 1: Check for foreign key constraints referencing prompt_templates
    console.log('\nChecking for foreign key constraints referencing prompt_templates...');
    const fkResult = await client.query(`
      SELECT
        tc.table_schema, 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
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
        AND ccu.table_name = 'prompt_templates';
    `);
    
    if (fkResult.rows.length === 0) {
      console.log('No foreign key constraints found referencing prompt_templates table.');
    } else {
      console.log('Foreign key constraints found:');
      fkResult.rows.forEach(row => {
        console.log(`- Table: ${row.table_name}, Column: ${row.column_name}, Constraint: ${row.constraint_name}`);
      });
    }
    
    // Step 2: Check for any tables that might reference prompt_templates without foreign keys
    console.log('\nChecking for columns that might reference prompt_templates without foreign keys...');
    const colResult = await client.query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE column_name LIKE '%prompt%' OR column_name LIKE '%template%'
      ORDER BY table_name, column_name;
    `);
    
    if (colResult.rows.length === 0) {
      console.log('No columns found that might reference prompt_templates.');
    } else {
      console.log('Columns that might reference prompt_templates:');
      colResult.rows.forEach(row => {
        console.log(`- Table: ${row.table_name}, Column: ${row.column_name}`);
      });
    }
    
    // Step 3: Check for any validation_logs that reference prompt_templates
    console.log('\nChecking for validation logs that reference prompt_templates...');
    const logResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_name LIKE '%validation%' OR table_name LIKE '%log%';
    `);
    
    if (logResult.rows.length === 0) {
      console.log('No validation log tables found.');
    } else {
      console.log('Validation log tables found:');
      logResult.rows.forEach(row => {
        console.log(`- Table: ${row.table_name}`);
      });
    }
    
    // Step 4: List all prompt templates
    console.log('\nListing all prompt templates...');
    const templateResult = await client.query(`
      SELECT id, name, type, version, active, created_at, updated_at
      FROM prompt_templates
      ORDER BY id;
    `);
    
    if (templateResult.rows.length === 0) {
      console.log('No prompt templates found.');
    } else {
      console.log('Prompt templates:');
      templateResult.rows.forEach(row => {
        console.log(`- ID: ${row.id}, Name: ${row.name}, Type: ${row.type}, Version: ${row.version}, Active: ${row.active}`);
        console.log(`  Created: ${row.created_at}, Updated: ${row.updated_at}`);
      });
      
      // Count active templates
      const activeTemplates = templateResult.rows.filter(row => row.active);
      console.log(`\nTotal templates: ${templateResult.rows.length}`);
      console.log(`Active templates: ${activeTemplates.length}`);
    }
    
    // Step 5: Suggest a strategy
    console.log('\n=== Database Cleanup Strategy ===');
    
    if (fkResult.rows.length === 0) {
      console.log('Since there are no foreign key constraints referencing the prompt_templates table, you have several options:');
      
      console.log('\nOption 1: Delete unused templates');
      console.log('You can safely delete inactive templates that are no longer needed:');
      console.log(`
DELETE FROM prompt_templates
WHERE active = FALSE AND id NOT IN (14, 15, 16);  -- Keep a few recent versions for reference
      `);
      
      console.log('\nOption 2: Reset IDs and keep only essential templates');
      console.log('You can dump the essential templates, truncate the table, and reinsert them with new IDs:');
      console.log(`
-- Step 1: Backup essential templates
CREATE TEMPORARY TABLE temp_templates AS
SELECT name, type, version, content_template, word_limit, active
FROM prompt_templates
WHERE id IN (14, 15, 16);  -- Keep only the essential templates

-- Step 2: Truncate the table (this resets the ID sequence)
TRUNCATE prompt_templates RESTART IDENTITY;

-- Step 3: Reinsert the essential templates
INSERT INTO prompt_templates (name, type, version, content_template, word_limit, active, created_at, updated_at)
SELECT name, type, version, content_template, word_limit, active, NOW(), NOW()
FROM temp_templates;

-- Step 4: Drop the temporary table
DROP TABLE temp_templates;
      `);
      
      console.log('\nOption 3: Update template #15 directly');
      console.log('If you just want to update template #15 without creating a new one:');
      console.log(`
UPDATE prompt_templates
SET content_template = 'Your updated template content here',
    updated_at = NOW()
WHERE id = 15;
      `);
    } else {
      console.log('Since there are foreign key constraints referencing the prompt_templates table, you should be careful about deleting records.');
      console.log('The safest approach is to update existing templates rather than deleting them:');
      console.log(`
UPDATE prompt_templates
SET content_template = 'Your updated template content here',
    updated_at = NOW()
WHERE id = 15;
      `);
    }
    
    console.log('\nRecommended Approach:');
    console.log('1. Keep only one active template at a time');
    console.log('2. Update existing templates instead of creating new ones');
    console.log('3. If you need to clean up, delete only inactive templates that are not referenced elsewhere');
    console.log('4. Consider implementing a version control system for templates outside the database');
    
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