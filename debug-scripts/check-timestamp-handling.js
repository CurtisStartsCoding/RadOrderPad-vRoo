/**
 * Script to investigate timestamp handling in the database
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
    
    // Check for database triggers related to timestamps
    console.log('\nChecking for database triggers related to timestamps...');
    const triggersResult = await client.query(`
      SELECT 
        trigger_name,
        event_manipulation,
        event_object_table,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'prompt_templates'
      ORDER BY trigger_name;
    `);
    
    if (triggersResult.rows.length === 0) {
      console.log('No triggers found for the prompt_templates table.');
    } else {
      console.log(`Found ${triggersResult.rows.length} triggers for the prompt_templates table:`);
      triggersResult.rows.forEach(trigger => {
        console.log(`- ${trigger.trigger_name} (${trigger.event_manipulation} on ${trigger.event_object_table})`);
        console.log(`  Action: ${trigger.action_statement}`);
      });
    }
    
    // Check the table definition to see if there are default values for timestamps
    console.log('\nChecking table definition for timestamp defaults...');
    const columnDefaultsResult = await client.query(`
      SELECT 
        column_name, 
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'prompt_templates'
        AND (column_name = 'created_at' OR column_name = 'updated_at')
      ORDER BY column_name;
    `);
    
    if (columnDefaultsResult.rows.length === 0) {
      console.log('No timestamp columns found in the prompt_templates table.');
    } else {
      console.log('Timestamp column defaults:');
      columnDefaultsResult.rows.forEach(column => {
        console.log(`- ${column.column_name}: Default = ${column.column_default || 'NULL'}, Nullable = ${column.is_nullable}`);
      });
    }
    
    // Check the history of updates to the active template
    console.log('\nChecking history of updates to the active template (ID 14)...');
    const templateHistoryResult = await client.query(`
      SELECT id, name, active, created_at, updated_at
      FROM prompt_templates
      WHERE id = 14
      ORDER BY updated_at DESC;
    `);
    
    if (templateHistoryResult.rows.length === 0) {
      console.log('No template with ID 14 found.');
    } else {
      console.log('Template history:');
      templateHistoryResult.rows.forEach(template => {
        console.log(`- ID: ${template.id}, Name: ${template.name}, Active: ${template.active}`);
        console.log(`  Created: ${template.created_at}, Updated: ${template.updated_at}`);
        
        // Calculate the difference between created_at and updated_at
        const createdAt = new Date(template.created_at);
        const updatedAt = new Date(template.updated_at);
        const diffMs = updatedAt - createdAt;
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        
        console.log(`  Time difference: ${diffMins} minutes, ${diffSecs} seconds`);
      });
    }
    
    // Check if there's a function that updates the updated_at timestamp
    console.log('\nChecking for functions that might update timestamps...');
    const functionsResult = await client.query(`
      SELECT 
        routine_name,
        routine_definition
      FROM information_schema.routines
      WHERE routine_schema = 'public'
        AND routine_definition LIKE '%updated_at%'
      ORDER BY routine_name;
    `);
    
    if (functionsResult.rows.length === 0) {
      console.log('No functions found that update timestamps.');
    } else {
      console.log(`Found ${functionsResult.rows.length} functions that might update timestamps:`);
      functionsResult.rows.forEach(func => {
        console.log(`- ${func.routine_name}`);
        console.log(`  Definition: ${func.routine_definition}`);
      });
    }
    
    // Check the update history in the prompt_templates_backup table if it exists
    console.log('\nChecking for backup/audit tables...');
    try {
      const backupResult = await client.query(`
        SELECT id, name, active, created_at, updated_at
        FROM prompt_templates_backup
        WHERE id = 14
        ORDER BY updated_at DESC
        LIMIT 5;
      `);
      
      if (backupResult.rows.length === 0) {
        console.log('No backup records found for template ID 14.');
      } else {
        console.log(`Found ${backupResult.rows.length} backup records for template ID 14:`);
        backupResult.rows.forEach(template => {
          console.log(`- ID: ${template.id}, Name: ${template.name}, Active: ${template.active}`);
          console.log(`  Created: ${template.created_at}, Updated: ${template.updated_at}`);
        });
      }
    } catch (error) {
      console.log(`Could not check backup table: ${error.message}`);
    }
    
    // Check for recent updates to any prompt templates
    console.log('\nChecking for recent updates to any prompt templates...');
    const recentUpdatesResult = await client.query(`
      SELECT id, name, active, created_at, updated_at
      FROM prompt_templates
      WHERE updated_at > NOW() - INTERVAL '2 hours'
      ORDER BY updated_at DESC;
    `);
    
    if (recentUpdatesResult.rows.length === 0) {
      console.log('No recent updates to prompt templates found.');
    } else {
      console.log(`Found ${recentUpdatesResult.rows.length} recently updated prompt templates:`);
      recentUpdatesResult.rows.forEach(template => {
        console.log(`- ID: ${template.id}, Name: ${template.name}, Active: ${template.active}`);
        console.log(`  Created: ${template.created_at}, Updated: ${template.updated_at}`);
      });
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