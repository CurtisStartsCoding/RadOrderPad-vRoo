/**
 * Script to test database connection and schema
 * This script inserts a test organization and then queries it to verify the connection
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env.production
const envConfig = dotenv.parse(fs.readFileSync('.env.production'));

// Create a connection pool using the production database URL with sslmode=no-verify
const connectionString = envConfig.MAIN_DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify');

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // Use this for testing
});

async function testDatabaseConnection() {
  console.log('Testing database connection and schema...');
  console.log(`Using connection string: ${connectionString}`);
  
  const client = await pool.connect();
  
  try {
    // First, check the schema of the organizations table
    console.log('Checking organizations table schema...');
    const schemaResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'organizations'
      ORDER BY ordinal_position
    `);
    
    console.log('Organizations table schema:');
    schemaResult.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type}, ${row.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
    });
    
    // Check if status column exists
    const statusColumn = schemaResult.rows.find(row => row.column_name === 'status');
    console.log('\nStatus column exists:', !!statusColumn);
    if (statusColumn) {
      console.log('Status column details:', statusColumn);
    }
    
    // Count organizations
    const countResult = await client.query('SELECT COUNT(*) FROM organizations');
    console.log(`\nTotal organizations: ${countResult.rows[0].count}`);
    
    // Sample organizations
    const sampleResult = await client.query('SELECT id, name, type FROM organizations LIMIT 5');
    console.log('\nSample organizations:');
    sampleResult.rows.forEach(row => {
      console.log(`- ID: ${row.id}, Name: ${row.name}, Type: ${row.type}`);
    });
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing database connection:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the test
testDatabaseConnection().catch(err => {
  console.error('Unexpected error:', err);
});