/**
 * Script to check validation details in the PHI database
 */
require('dotenv').config();
const { Pool } = require('pg');

// Get database connection details from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = 'radorder_phi'; // Use the PHI database
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
    console.log('Connecting to PHI database...');
    client = await pool.connect();
    console.log('Connected to PHI database');
    
    // Check the structure of the validation_attempts table
    console.log('\nChecking the structure of the validation_attempts table...');
    const validationAttemptsStructure = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'validation_attempts'
      ORDER BY ordinal_position;
    `);
    
    if (validationAttemptsStructure.rows.length === 0) {
      console.log('No columns found in the validation_attempts table.');
    } else {
      console.log('Columns in the validation_attempts table:');
      validationAttemptsStructure.rows.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type})`);
      });
    }
    
    // Check the structure of the llm_validation_logs table
    console.log('\nChecking the structure of the llm_validation_logs table...');
    const llmValidationLogsStructure = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'llm_validation_logs'
      ORDER BY ordinal_position;
    `);
    
    if (llmValidationLogsStructure.rows.length === 0) {
      console.log('No columns found in the llm_validation_logs table.');
    } else {
      console.log('Columns in the llm_validation_logs table:');
      llmValidationLogsStructure.rows.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type})`);
      });
    }
    
    // Get the most recent validation attempt with more details
    console.log('\nGetting details of the most recent validation attempt...');
    const validationAttemptResult = await client.query(`
      SELECT *
      FROM validation_attempts
      ORDER BY created_at DESC
      LIMIT 1;
    `);
    
    if (validationAttemptResult.rows.length === 0) {
      console.log('No validation attempts found.');
    } else {
      const attempt = validationAttemptResult.rows[0];
      console.log('Most recent validation attempt:');
      console.log(`ID: ${attempt.id}`);
      console.log(`Order ID: ${attempt.order_id}`);
      console.log(`Created: ${attempt.created_at}`);
      console.log(`Status: ${attempt.status}`);
      console.log(`Error Message: ${attempt.error_message || 'None'}`);
      
      // Get the corresponding order
      console.log('\nGetting the corresponding order...');
      const orderResult = await client.query(`
        SELECT *
        FROM orders
        WHERE id = $1;
      `, [attempt.order_id]);
      
      if (orderResult.rows.length === 0) {
        console.log(`No order found with ID ${attempt.order_id}.`);
      } else {
        const order = orderResult.rows[0];
        console.log('Order details:');
        console.log(`ID: ${order.id}`);
        console.log(`Created: ${order.created_at}`);
        console.log(`Status: ${order.status}`);
        console.log(`Validation Status: ${order.validation_status || 'None'}`);
        console.log(`Modality: ${order.modality}`);
        console.log(`Dictation Text: ${order.dictation_text ? order.dictation_text.substring(0, 100) + '...' : 'None'}`);
      }
      
      // Get the corresponding llm_validation_log
      console.log('\nGetting the corresponding llm_validation_log...');
      const logResult = await client.query(`
        SELECT *
        FROM llm_validation_logs
        WHERE validation_attempt_id = $1;
      `, [attempt.id]);
      
      if (logResult.rows.length === 0) {
        console.log(`No llm_validation_log found for validation attempt ID ${attempt.id}.`);
      } else {
        const log = logResult.rows[0];
        console.log('LLM validation log details:');
        console.log(`ID: ${log.id}`);
        console.log(`Created: ${log.created_at}`);
        console.log(`Status: ${log.status}`);
        console.log(`Error Message: ${log.error_message || 'None'}`);
        console.log(`LLM Provider: ${log.llm_provider}`);
        console.log(`Model Name: ${log.model_name}`);
        console.log(`Prompt Template ID: ${log.prompt_template_id}`);
        console.log(`Prompt Tokens: ${log.prompt_tokens}`);
        console.log(`Completion Tokens: ${log.completion_tokens}`);
        console.log(`Total Tokens: ${log.total_tokens}`);
        console.log(`Latency (ms): ${log.latency_ms}`);
        
        // Check if there are any request_data or response_data fields
        if (log.request_data) {
          console.log(`Request Data: ${JSON.stringify(log.request_data).substring(0, 100)}...`);
        }
        if (log.response_data) {
          console.log(`Response Data: ${JSON.stringify(log.response_data).substring(0, 100)}...`);
        }
      }
    }
    
    // Check for failed validation attempts
    console.log('\nChecking for failed validation attempts...');
    const failedAttemptsResult = await client.query(`
      SELECT *
      FROM validation_attempts
      WHERE status = 'error'
      ORDER BY created_at DESC
      LIMIT 5;
    `);
    
    if (failedAttemptsResult.rows.length === 0) {
      console.log('No failed validation attempts found.');
    } else {
      console.log('Most recent failed validation attempts:');
      failedAttemptsResult.rows.forEach(attempt => {
        console.log(`ID: ${attempt.id}, Created: ${attempt.created_at}`);
        console.log(`Order ID: ${attempt.order_id}`);
        console.log(`Status: ${attempt.status}`);
        console.log(`Error Message: ${attempt.error_message || 'None'}`);
        console.log('---');
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