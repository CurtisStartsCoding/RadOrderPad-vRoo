/**
 * Script to check timestamps in the PHI database tables
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
    
    // Check the structure of the orders table
    console.log('\nChecking the structure of the orders table...');
    const ordersStructure = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'orders'
      ORDER BY ordinal_position;
    `);
    
    if (ordersStructure.rows.length === 0) {
      console.log('No columns found in the orders table.');
    } else {
      console.log('Columns in the orders table:');
      ordersStructure.rows.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type}), Default: ${column.column_default || 'NULL'}`);
      });
    }
    
    // Check the most recent orders
    console.log('\nChecking the most recent orders...');
    const ordersResult = await client.query(`
      SELECT id, order_number, created_at, updated_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5;
    `);
    
    if (ordersResult.rows.length === 0) {
      console.log('No orders found.');
    } else {
      console.log('Most recent orders:');
      ordersResult.rows.forEach(order => {
        console.log(`- ID: ${order.id}, Order #: ${order.order_number}`);
        console.log(`  Created: ${order.created_at}`);
        console.log(`  Updated: ${order.updated_at}`);
        
        // Calculate the difference between created_at and updated_at
        if (order.created_at && order.updated_at) {
          const createdAt = new Date(order.created_at);
          const updatedAt = new Date(order.updated_at);
          const diffMs = updatedAt - createdAt;
          const diffSecs = Math.floor(diffMs / 1000);
          const diffMins = Math.floor(diffSecs / 60);
          const remainingSecs = diffSecs % 60;
          
          console.log(`  Time difference: ${diffMins} minutes, ${remainingSecs} seconds (${diffMs} ms)`);
        }
      });
    }
    
    // Check the structure of the validation_attempts table
    console.log('\nChecking the structure of the validation_attempts table...');
    const attemptsStructure = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'validation_attempts'
      ORDER BY ordinal_position;
    `);
    
    if (attemptsStructure.rows.length === 0) {
      console.log('No columns found in the validation_attempts table.');
    } else {
      console.log('Columns in the validation_attempts table:');
      attemptsStructure.rows.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type}), Default: ${column.column_default || 'NULL'}`);
      });
    }
    
    // Check the most recent validation attempts
    console.log('\nChecking the most recent validation attempts...');
    const attemptsResult = await client.query(`
      SELECT id, order_id, created_at
      FROM validation_attempts
      ORDER BY created_at DESC
      LIMIT 5;
    `);
    
    if (attemptsResult.rows.length === 0) {
      console.log('No validation attempts found.');
    } else {
      console.log('Most recent validation attempts:');
      attemptsResult.rows.forEach(attempt => {
        console.log(`- ID: ${attempt.id}, Order ID: ${attempt.order_id}, Created: ${attempt.created_at}`);
      });
    }
    
    // Check the structure of the llm_validation_logs table
    console.log('\nChecking the structure of the llm_validation_logs table...');
    const logsStructure = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'llm_validation_logs'
      ORDER BY ordinal_position;
    `);
    
    if (logsStructure.rows.length === 0) {
      console.log('No columns found in the llm_validation_logs table.');
    } else {
      console.log('Columns in the llm_validation_logs table:');
      logsStructure.rows.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type}), Default: ${column.column_default || 'NULL'}`);
      });
    }
    
    // Check the most recent LLM validation logs
    console.log('\nChecking the most recent LLM validation logs...');
    const logsResult = await client.query(`
      SELECT id, created_at
      FROM llm_validation_logs
      ORDER BY created_at DESC
      LIMIT 5;
    `);
    
    if (logsResult.rows.length === 0) {
      console.log('No LLM validation logs found.');
    } else {
      console.log('Most recent LLM validation logs:');
      logsResult.rows.forEach(log => {
        console.log(`- ID: ${log.id}, Created: ${log.created_at}`);
      });
    }
    
    // Check for relationships between orders, validation_attempts, and llm_validation_logs
    console.log('\nChecking for relationships between tables...');
    
    // Check for a recent order with its validation attempts and LLM logs
    if (ordersResult.rows.length > 0) {
      const recentOrderId = ordersResult.rows[0].id;
      console.log(`\nChecking validation attempts for order ID ${recentOrderId}...`);
      
      const orderAttemptsResult = await client.query(`
        SELECT id, created_at
        FROM validation_attempts
        WHERE order_id = $1
        ORDER BY created_at DESC;
      `, [recentOrderId]);
      
      if (orderAttemptsResult.rows.length === 0) {
        console.log(`No validation attempts found for order ID ${recentOrderId}.`);
      } else {
        console.log(`Found ${orderAttemptsResult.rows.length} validation attempts for order ID ${recentOrderId}:`);
        
        for (const attempt of orderAttemptsResult.rows) {
          console.log(`- Attempt ID: ${attempt.id}, Created: ${attempt.created_at}`);
          
          // Check for LLM logs related to this validation attempt
          const attemptLogsResult = await client.query(`
            SELECT id, created_at
            FROM llm_validation_logs
            WHERE id = $1
            ORDER BY created_at DESC;
          `, [attempt.id]);
          
          if (attemptLogsResult.rows.length === 0) {
            console.log(`  No LLM logs found for attempt ID ${attempt.id}.`);
          } else {
            console.log(`  Found ${attemptLogsResult.rows.length} LLM logs for attempt ID ${attempt.id}:`);
            attemptLogsResult.rows.forEach(log => {
              console.log(`  - Log ID: ${log.id}, Created: ${log.created_at}`);
            });
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