/**
 * Script to check the most recent validation logs in the PHI database
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
    
    // Check the most recent orders
    console.log('\nChecking the most recent orders...');
    const ordersResult = await client.query(`
      SELECT id, order_number, patient_id, status, validation_status, created_at, updated_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 20;
    `);
    
    if (ordersResult.rows.length === 0) {
      console.log('No orders found.');
    } else {
      console.log(`Found ${ordersResult.rows.length} orders:`);
      ordersResult.rows.forEach(order => {
        console.log(`ID: ${order.id}, Order #: ${order.order_number}, Patient ID: ${order.patient_id}, Status: ${order.status}, Validation: ${order.validation_status}, Created: ${order.created_at}`);
      });
    }
    
    // Check the most recent validation attempts
    console.log('\nChecking the most recent validation attempts...');
    const attemptsResult = await client.query(`
      SELECT id, order_id, attempt_number, created_at
      FROM validation_attempts
      ORDER BY created_at DESC
      LIMIT 20;
    `);
    
    if (attemptsResult.rows.length === 0) {
      console.log('No validation attempts found.');
    } else {
      console.log(`Found ${attemptsResult.rows.length} validation attempts:`);
      attemptsResult.rows.forEach(attempt => {
        console.log(`ID: ${attempt.id}, Order ID: ${attempt.order_id}, Attempt #: ${attempt.attempt_number}, Created: ${attempt.created_at}`);
      });
    }
    
    // Check the most recent LLM validation logs
    console.log('\nChecking the most recent LLM validation logs...');
    const logsResult = await client.query(`
      SELECT id, provider, model, prompt_tokens, completion_tokens, total_tokens, latency_ms, created_at
      FROM llm_validation_logs
      ORDER BY created_at DESC
      LIMIT 20;
    `);
    
    if (logsResult.rows.length === 0) {
      console.log('No LLM validation logs found.');
    } else {
      console.log(`Found ${logsResult.rows.length} LLM validation logs:`);
      logsResult.rows.forEach(log => {
        console.log(`ID: ${log.id}, Provider: ${log.provider}, Model: ${log.model}, Tokens: ${log.total_tokens}, Latency: ${log.latency_ms}ms, Created: ${log.created_at}`);
      });
    }
    
    // Check for any recent errors in the system_logs table (if it exists)
    console.log('\nChecking for recent errors in system_logs...');
    try {
      const errorLogsResult = await client.query(`
        SELECT id, log_level, message, created_at
        FROM system_logs
        WHERE log_level = 'ERROR'
        ORDER BY created_at DESC
        LIMIT 10;
      `);
      
      if (errorLogsResult.rows.length === 0) {
        console.log('No error logs found.');
      } else {
        console.log(`Found ${errorLogsResult.rows.length} error logs:`);
        errorLogsResult.rows.forEach(log => {
          console.log(`ID: ${log.id}, Level: ${log.log_level}, Created: ${log.created_at}, Message: ${log.message.substring(0, 100)}...`);
        });
      }
    } catch (error) {
      console.log(`Could not check system_logs table: ${error.message}`);
    }
    
    // Check the patients table to see if our test patients exist
    console.log('\nChecking if test patients exist...');
    const patientsResult = await client.query(`
      SELECT id, first_name, last_name, created_at
      FROM patients
      WHERE id <= 10
      ORDER BY id;
    `);
    
    if (patientsResult.rows.length === 0) {
      console.log('No test patients found.');
    } else {
      console.log(`Found ${patientsResult.rows.length} test patients:`);
      patientsResult.rows.forEach(patient => {
        console.log(`ID: ${patient.id}, Name: ${patient.first_name} ${patient.last_name}, Created: ${patient.created_at}`);
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