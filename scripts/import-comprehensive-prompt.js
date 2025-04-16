/**
 * Import Comprehensive Prompt
 * 
 * This script imports the comprehensive validation prompt into the database
 * by directly using the database connection from the application.
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Set database connection details from the server logs
const dbConfig = {
  host: 'localhost',
  port: 5433,
  database: 'radorder_main',
  user: 'postgres',
  password: 'postgres123'
};

console.log('Database connection details:');
console.log(`Host: ${dbConfig.host}`);
console.log(`Port: ${dbConfig.port}`);
console.log(`Database: ${dbConfig.database}`);
console.log(`User: ${dbConfig.user}`);
console.log(`Password: [HIDDEN]`);
console.log('');

// Create a new database connection pool
const pool = new Pool(dbConfig);

// Read the comprehensive prompt from the file
const promptFilePath = path.join(__dirname, 'Docs', 'implementation', 'FINAL_PROMPT.txt');
console.log(`Reading prompt from: ${promptFilePath}`);
const comprehensivePrompt = fs.readFileSync(promptFilePath, 'utf8');
console.log(`Prompt length: ${comprehensivePrompt.length} characters`);

async function importComprehensivePrompt() {
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Deactivate all existing default prompts
    const deactivateResult = await client.query(`
      UPDATE prompt_templates
      SET active = FALSE, 
          updated_at = NOW()
      WHERE type = 'default' 
        AND active = TRUE
    `);
    
    console.log(`Deactivated ${deactivateResult.rowCount} existing default prompts`);
    
    // Insert the new comprehensive prompt
    const insertResult = await client.query(`
      INSERT INTO prompt_templates (
        name, 
        type, 
        version, 
        content_template, 
        word_limit,
        active, 
        created_at, 
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, NOW(), NOW()
      )
    `, [
      'Comprehensive Imaging Order Validation',
      'default',
      1,
      comprehensivePrompt,
      null,
      true
    ]);
    
    console.log(`Inserted new comprehensive prompt: ${insertResult.rowCount} row`);
    
    // Commit the transaction
    await client.query('COMMIT');
    
    // Verify the update
    const verifyResult = await client.query(`
      SELECT id, name, type, active, version, created_at 
      FROM prompt_templates 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('\nVerification - Recent prompt templates:');
    verifyResult.rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Type: ${row.type}, Active: ${row.active}, Version: ${row.version}, Created: ${row.created_at}`);
    });
    
    console.log('\nComprehensive prompt imported successfully!');
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error('Error importing comprehensive prompt:', error);
  } finally {
    // Release the client back to the pool
    client.release();
    // Close the pool
    await pool.end();
  }
}

// Run the import function
importComprehensivePrompt().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});