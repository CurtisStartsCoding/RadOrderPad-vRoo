/**
 * Script to check the last successful test time in the orders database
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
    
    // Check the orders table for the last successful validation
    console.log('\nChecking orders table for the last successful validation...');
    const ordersResult = await client.query(`
      SELECT id, created_at, updated_at, validation_status
      FROM orders
      WHERE validation_status IS NOT NULL
      ORDER BY updated_at DESC
      LIMIT 10;
    `);
    
    if (ordersResult.rows.length === 0) {
      console.log('No orders with validation status found.');
    } else {
      console.log('Last 10 orders with validation status:');
      ordersResult.rows.forEach(order => {
        console.log(`ID: ${order.id}, Created: ${order.created_at}, Updated: ${order.updated_at}, Status: ${order.validation_status}`);
      });
    }
    
    // Check the validation_results table for the last successful validation
    console.log('\nChecking validation_results table for the last successful validation...');
    const validationResult = await client.query(`
      SELECT id, order_id, created_at, validation_status
      FROM validation_results
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    
    if (validationResult.rows.length === 0) {
      console.log('No validation results found.');
    } else {
      console.log('Last 10 validation results:');
      validationResult.rows.forEach(result => {
        console.log(`ID: ${result.id}, Order ID: ${result.order_id}, Created: ${result.created_at}, Status: ${result.validation_status}`);
      });
    }
    
    // Check the prompt_templates table for recent changes
    console.log('\nChecking prompt_templates table for recent changes...');
    const promptResult = await client.query(`
      SELECT id, name, type, version, active, created_at, updated_at
      FROM prompt_templates
      ORDER BY updated_at DESC
      LIMIT 10;
    `);
    
    if (promptResult.rows.length === 0) {
      console.log('No prompt templates found.');
    } else {
      console.log('Last 10 prompt template changes:');
      promptResult.rows.forEach(template => {
        console.log(`ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}, Active: ${template.active}, Created: ${template.created_at}, Updated: ${template.updated_at}`);
      });
    }
    
    // Check the system_logs table for recent errors
    console.log('\nChecking system_logs table for recent errors...');
    const logsResult = await client.query(`
      SELECT id, log_level, message, created_at
      FROM system_logs
      WHERE log_level = 'ERROR'
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    
    if (logsResult.rows.length === 0) {
      console.log('No error logs found.');
    } else {
      console.log('Last 10 error logs:');
      logsResult.rows.forEach(log => {
        console.log(`ID: ${log.id}, Level: ${log.log_level}, Created: ${log.created_at}, Message: ${log.message}`);
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